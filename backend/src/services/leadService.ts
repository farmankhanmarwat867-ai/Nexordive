import crypto from 'node:crypto';
import { FilterQuery } from 'mongoose';
import { LEAD_STATUSES, LeadSource, LeadStatus } from '../constants/index.js';
import { ILead, Lead } from '../models/Lead.js';
import { ApiError } from '../utils/ApiError.js';
import { sendNewLeadNotification } from './mailService.js';

export interface CreateLeadInput {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  budget: string;
  notes?: string;
  projectGoals?: string;
  requiredFeatures?: string;
  preferredTimeline?: string;
  source?: LeadSource;
  website?: string; // Honeypot trap
}

export interface ListLeadsQuery {
  status?: 'All' | LeadStatus;
  service?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generateReferenceCode(): string {
  const num = crypto.randomInt(100_000, 999_999);
  return `NXD-${num}`;
}

export function escapeCsvCell(value: unknown): string {
  const str = String(value ?? '').replace(/\r?\n/g, ' ');
  // Guard against spreadsheet formula injection (=, +, -, @, tab)
  const neutralized = /^[=+\-@\t]/.test(str) ? `'${str}` : str;
  return `"${neutralized.replace(/"/g, '""')}"`;
}

function buildLeadFilter(query: ListLeadsQuery): FilterQuery<ILead> {
  const filter: FilterQuery<ILead> = {};

  if (query.status && query.status !== 'All') {
    filter.status = query.status;
  }

  if (query.service) {
    filter.service = { $regex: escapeRegExp(query.service), $options: 'i' };
  }

  if (query.search) {
    const safeSearch = escapeRegExp(query.search);
    filter.$or = [
      { referenceCode: { $regex: safeSearch, $options: 'i' } },
      { name: { $regex: safeSearch, $options: 'i' } },
      { email: { $regex: safeSearch, $options: 'i' } },
      { whatsapp: { $regex: safeSearch, $options: 'i' } },
      { service: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  return filter;
}

export async function createLead(
  input: CreateLeadInput,
  clientIp?: string
): Promise<{ lead: Record<string, unknown>; spamFiltered?: boolean }> {
  // Honeypot trap: bots often populate hidden `website` fields
  if (input.website && input.website.trim().length > 0) {
    return {
      spamFiltered: true,
      lead: {
        referenceCode: generateReferenceCode(),
        status: 'New',
      },
    };
  }

  const ipHash = clientIp
    ? crypto.createHash('sha256').update(clientIp).digest('hex')
    : undefined;

  let lead: ILead | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      lead = await Lead.create({
        referenceCode: generateReferenceCode(),
        name: input.name,
        email: input.email,
        whatsapp: input.whatsapp,
        service: input.service,
        budget: input.budget,
        status: 'New',
        notes: input.notes || '',
        projectGoals: input.projectGoals,
        requiredFeatures: input.requiredFeatures,
        preferredTimeline: input.preferredTimeline,
        source: input.source || 'contact_form',
        ipHash,
      });
      break;
    } catch (err: any) {
      if (err?.code === 11000 && attempt < 2) {
        continue;
      }
      throw err;
    }
  }

  if (!lead) {
    throw new Error('Could not generate a unique reference code for lead.');
  }

  // Fire-and-forget notification so SMTP hiccups never fail lead capture
  void sendNewLeadNotification(lead);

  return { lead: lead.toJSON() };
}

export async function listLeads(query: ListLeadsQuery) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

  const filter = buildLeadFilter(query);

  const [leads, total, groupedCounts] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit),
    Lead.countDocuments(filter),
    Lead.aggregate<{ _id: LeadStatus; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const statusCounts: Record<string, number> = { All: 0 };
  for (const s of LEAD_STATUSES) {
    statusCounts[s] = 0;
  }
  for (const row of groupedCounts) {
    statusCounts[row._id] = row.count;
    statusCounts.All += row.count;
  }

  return {
    items: leads.map((l) => l.toJSON()),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    statusCounts,
  };
}

export async function getLeadById(id: string): Promise<Record<string, unknown>> {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw ApiError.notFound('Lead inquiry not found.', 'LEAD_NOT_FOUND');
  }
  return lead.toJSON();
}

export async function updateLead(
  id: string,
  updates: Partial<Pick<ILead, 'status' | 'notes' | 'preferredTimeline'>>
): Promise<Record<string, unknown>> {
  const lead = await Lead.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!lead) {
    throw ApiError.notFound('Lead inquiry not found.', 'LEAD_NOT_FOUND');
  }
  return lead.toJSON();
}

export async function deleteLead(id: string): Promise<void> {
  const deleted = await Lead.findByIdAndDelete(id);
  if (!deleted) {
    throw ApiError.notFound('Lead inquiry not found.', 'LEAD_NOT_FOUND');
  }
}

export async function exportLeadsCsv(query: ListLeadsQuery): Promise<string> {
  const filter = buildLeadFilter(query);
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(5000);

  const headers = [
    'Reference',
    'Name',
    'Email',
    'WhatsApp',
    'Service',
    'Budget',
    'Status',
    'Source',
    'Notes',
    'CreatedAt',
  ];

  const rows = leads.map((lead) =>
    [
      lead.referenceCode,
      lead.name,
      lead.email,
      lead.whatsapp,
      lead.service,
      lead.budget,
      lead.status,
      lead.source,
      lead.notes || '',
      lead.createdAt.toISOString(),
    ]
      .map(escapeCsvCell)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
