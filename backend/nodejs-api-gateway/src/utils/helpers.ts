import { v4 as uuidv4 } from 'uuid';

// generate uuid
export function generateId(): string {
  return uuidv4();
}

// clean up user object before sending to client
export function sanitizeUser(user: any) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// pagination helper
export function getPagination(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  return { offset, limit };
}

// format date for postgres
export function formatDate(date: Date): string {
  return date.toISOString();
}

// simple slug generator
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
