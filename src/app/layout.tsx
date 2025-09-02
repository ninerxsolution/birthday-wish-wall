import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "กำแพงคำอวยพรวันเกิด",
  description: "แพลตฟอร์มส่วนตัวสำหรับรวบรวมและตอบกลับคำอวยพรวันเกิด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          {/* <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  🎂 Birthday Wish Wall
                </h1>
                <nav className="flex space-x-4">
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Wall
                  </Link>
                  <Link href="/submit" className="text-gray-600 hover:text-gray-900">
                    Leave a Wish
                  </Link>
                </nav>
              </div>
            </div>
          </header> */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
