import type { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'My Profile', icon: 'account_circle', path: '/profile' },
  { label: 'Job Feed', icon: 'home', path: '/feed' },
  { label: 'Find Jobs', icon: 'search', path: '/jobs' },
  { label: 'Earnings', icon: 'payments', path: '/earnings' },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: 'home', path: '/feed' },
  { label: 'Jobs', icon: 'search', path: '/jobs' },
  { label: 'Alerts', icon: 'notifications', path: '/notifications' },
  { label: 'Menu', icon: 'menu', path: '/dashboard' },
];

export function formatWage(wage: string, unit: string): string {
  return `${wage} / ${unit}`;
}

export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
