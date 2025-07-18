import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Robovers - 휴머노이드 로봇 정보 플랫폼',
  description: '휴머노이드 로봇에 대한 지식을 공유하고, 발전 현황과 관련 기업 정보를 확인하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}