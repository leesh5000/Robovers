'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';

interface VerifyFormData {
  code: string;
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyEmail, resendVerification, pendingEmail, isLoading } = useAuthStore();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>();

  useEffect(() => {
    if (!pendingEmail) {
      router.push('/signup');
    }
  }, [pendingEmail, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [resendTimer]);

  const onSubmit = async (data: VerifyFormData) => {
    if (!pendingEmail) return;
    
    try {
      await verifyEmail(pendingEmail, data.code);
      router.push('/login');
    } catch (error) {
      // Error is handled by the store and toast
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    
    try {
      await resendVerification(pendingEmail);
      setResendDisabled(true);
      setResendTimer(60); // 1 minute cooldown
    } catch (error) {
      // Error is handled by the store and toast
    }
  };

  if (!pendingEmail) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            이메일 인증
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {pendingEmail}로 발송된 6자리 인증 코드를 입력해주세요.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              인증 코드
            </label>
            <input
              {...register('code', {
                required: '인증 코드를 입력해주세요',
                pattern: {
                  value: /^\d{6}$/,
                  message: '6자리 숫자를 입력해주세요',
                },
              })}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-lg tracking-widest"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '인증하기'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading || resendDisabled}
              className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendDisabled
                ? `인증 코드 재발송 (${resendTimer}초)`
                : '인증 코드 재발송'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              회원가입으로 돌아가기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}