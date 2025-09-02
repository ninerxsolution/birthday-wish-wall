import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'admin_auth';

export async function POST(request: NextRequest) {
  const { code } = await request.json().catch(() => ({ code: '' }));
  const expected = process.env.ADMIN_SECRET_CODE;

  if (!expected) {
    return NextResponse.json({ error: 'ADMIN_SECRET_CODE ยังไม่ได้ตั้งค่า' }, { status: 500 });
  }

  if (!code || code !== expected) {
    return NextResponse.json({ error: 'รหัสไม่ถูกต้อง' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}


