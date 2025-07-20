'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Robot Emoji */}
          <div className="text-8xl animate-bounce">
            🤖
          </div>
          
          {/* 404 Text */}
          <div>
            <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              페이지를 찾을 수 없습니다
            </h2>
          </div>

          {/* Description */}
          <p className="text-gray-600">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            로봇들도 가끔 길을 잃곤 해요!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              홈으로 돌아가기
            </Link>
            
            <button
              onClick={() => router.back()}
              className="block w-full px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              이전 페이지로
            </button>
          </div>

          {/* Additional Links */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">다른 페이지를 찾고 계신가요?</p>
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/robots" className="text-blue-600 hover:text-blue-500">
                로봇 정보
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/community" className="text-blue-600 hover:text-blue-500">
                커뮤니티
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/companies" className="text-blue-600 hover:text-blue-500">
                기업 & 주가
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}