import { PortfolioProjectItem } from '../types/content';

export interface PortfolioFilterTab {
  id: string;
  label: string;
}

export const BASE_FILTER_TABS: PortfolioFilterTab[] = [
  { id: 'all', label: 'All Systems' },
  { id: 'saas', label: 'SaaS Platforms' },
  { id: 'ai', label: 'AI Solutions' },
  { id: 'lms', label: 'Educational LMS' },
  { id: 'web', label: 'Business & Web' },
];

export function matchesCategory(
  projectCategory: string | undefined,
  tabId: string
): boolean {
  if (!tabId || tabId === 'all') return true;
  if (!projectCategory) return false;

  const cat = projectCategory.toLowerCase().trim();
  const target = tabId.toLowerCase().trim();

  if (target === 'saas') {
    return (
      cat.includes('saas') ||
      cat.includes('fintech') ||
      cat.includes('platform') ||
      cat.includes('software') ||
      cat.includes('healthtech')
    );
  }

  if (target === 'ai') {
    return (
      cat.includes('ai') ||
      cat.includes('machine learning') ||
      cat.includes('artificial') ||
      cat.includes('intelligence')
    );
  }

  if (target === 'lms') {
    return (
      cat.includes('lms') ||
      cat.includes('education') ||
      cat.includes('academy') ||
      cat.includes('school') ||
      cat.includes('attendance')
    );
  }

  if (target === 'web') {
    return (
      cat.includes('web') ||
      cat.includes('business') ||
      cat.includes('hospital') ||
      cat.includes('healthcare') ||
      cat.includes('spatial') ||
      cat.includes('3d') ||
      cat.includes('e-commerce') ||
      cat.includes('commerce') ||
      cat.includes('food') ||
      cat.includes('restaurant')
    );
  }

  return cat === target;
}

export function getAvailableTabs(projects: PortfolioProjectItem[]): PortfolioFilterTab[] {
  const tabs = [...BASE_FILTER_TABS];

  // Also include any unique custom categories that do not fit into the standard buckets
  const customCategories = new Set<string>();
  projects.forEach((p) => {
    if (!p.category) return;
    const isCovered = BASE_FILTER_TABS.slice(1).some((tab) =>
      matchesCategory(p.category, tab.id)
    );
    if (!isCovered) {
      customCategories.add(p.category.trim());
    }
  });

  customCategories.forEach((customCat) => {
    tabs.push({
      id: customCat.toLowerCase().replace(/\s+/g, '-'),
      label: customCat,
    });
  });

  return tabs;
}
