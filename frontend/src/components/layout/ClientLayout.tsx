'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminPage && <Header />}
      {children}
    </div>
  );
}