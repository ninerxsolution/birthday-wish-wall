import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const isAuthenticated = checkAdminAuth(request);
  return NextResponse.json({ authenticated: isAuthenticated });
}
