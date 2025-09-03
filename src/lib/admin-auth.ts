import { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_auth';

export function checkAdminAuth(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  return cookie === 'ok';
}

export function getAdminAuthError() {
  return { error: 'Unauthorized - Admin access required' };
}