import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistance } from 'date-fns';

// Combine Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date
export function formatDate(date: string | Date) {
  return format(new Date(date), 'PPP');
}

// Format time
export function formatTime(date: string | Date) {
  return format(new Date(date), 'p');
}

// Format date and time
export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'PPp');
}

// Format relative time
export function formatRelativeTime(date: string | Date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

// Truncate text
export function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Get user initials
export function getUserInitials(name: string) {
  if (!name) return '';
  
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Generate random hex color based on string
export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}