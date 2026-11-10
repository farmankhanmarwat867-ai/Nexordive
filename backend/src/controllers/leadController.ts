import { Request, Response } from 'express';
import * as leadService from '../services/leadService.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export async function createLead(req: Request, res: Response): Promise<void> {
  const result = await leadService.createLead(req.body, req.ip);
  sendSuccess(res, 201, 'Inquiry received successfully.', result.lead);
}

export async function listLeads(req: Request, res: Response): Promise<void> {
  const query = (req.validatedQuery || req.query) as leadService.ListLeadsQuery;
  const data = await leadService.listLeads(query);
  sendSuccess(res, 200, 'Leads retrieved successfully.', data);
}

export async function getLead(req: Request, res: Response): Promise<void> {
  const id = req.validatedParams?.id || String(req.params.id);
  const lead = await leadService.getLeadById(id);
  sendSuccess(res, 200, 'Lead retrieved successfully.', { lead });
}

export async function updateLead(req: Request, res: Response): Promise<void> {
  const id = req.validatedParams?.id || String(req.params.id);
  const lead = await leadService.updateLead(id, req.body);
  sendSuccess(res, 200, 'Lead updated successfully.', { lead });
}

export async function deleteLead(req: Request, res: Response): Promise<void> {
  const id = req.validatedParams?.id || String(req.params.id);
  await leadService.deleteLead(id);
  sendSuccess(res, 200, 'Lead deleted successfully.', null);
}

export async function exportLeadsCsv(req: Request, res: Response): Promise<void> {
  const query = (req.validatedQuery || req.query) as leadService.ListLeadsQuery;
  const csv = await leadService.exportLeadsCsv(query);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="nexordive-leads.csv"');
  res.status(200).send(csv);
}
