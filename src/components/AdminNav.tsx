'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/admin', label: 'คำอวยพร' },
    { href: '/admin/friends', label: 'เพื่อน' },
    { href: '/admin/settings', label: 'การตั้งค่า' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">แดชบอร์ดแอดมิน</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === tab.href
                      ? 'border-purple-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <form action="/api/admin/logout" method="post">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                ออกจากระบบ
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
