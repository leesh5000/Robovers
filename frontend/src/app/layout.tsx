import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/layout/ClientLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Robovers - 휴머노이드 로봇 정보 플랫폼',
  description: '휴머노이드 로봇에 대한 지식을 공유하고, 발전 현황과 관련 기업 정보를 확인하세요',
  keywords: ['휴머노이드', '로봇', 'AI', '인공지능', '로보틱스', 'humanoid', 'robot'],
  authors: [{ name: 'Robovers Team' }],
  creator: 'Robovers',
  publisher: 'Robovers',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  manifest: '/manifest.json',
  openGraph: {
    title: 'Robovers - 휴머노이드 로봇 정보 플랫폼',
    description: '휴머노이드 로봇에 대한 지식을 공유하고, 발전 현황과 관련 기업 정보를 확인하세요',
    url: 'http://localhost:3000',
    siteName: 'Robovers',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Robovers - 휴머노이드 로봇 정보 플랫폼',
    description: '휴머노이드 로봇에 대한 지식을 공유하고, 발전 현황과 관련 기업 정보를 확인하세요',
    creator: '@robovers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}