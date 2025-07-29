'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

export default function SignupForm() {
  const router = useRouter();
  const { register: signUp, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      });
      router.push('/signup/verify');
    } catch (error) {
      // Error is handled by the store and toast
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="nickname" className="block text-base font-medium text-gray-700">
          닉네임 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('nickname', {
            required: '닉네임을 입력해주세요',
            minLength: {
              value: 2,
              message: '닉네임은 2자 이상이어야 합니다',
            },
            maxLength: {
              value: 20,
              message: '닉네임은 20자 이하여야 합니다',
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]{2,20}$/,
              message: '닉네임은 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다',
            },
          })}
          id="nickname"
          type="text"
          autoComplete="nickname"
          className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-md hover:border-gray-500 focus:border-2 focus:border-blue-500 focus:shadow-lg text-base py-3 px-4 transition-all duration-200"
        />
        {errors.nickname && (
          <p className="mt-1 text-sm text-red-600">{errors.nickname.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          영문, 숫자, 언더스코어(_), 하이픈(-)을 사용하여 2-20자로 입력해주세요
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-base font-medium text-gray-700">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email', {
            required: '이메일을 입력해주세요',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '올바른 이메일 형식이 아닙니다',
            },
          })}
          id="email"
          type="email"
          autoComplete="email"
          className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-md hover:border-gray-500 focus:border-2 focus:border-blue-500 focus:shadow-lg text-base py-3 px-4 transition-all duration-200"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>


      <div>
        <label htmlFor="password" className="block text-base font-medium text-gray-700">
          비밀번호 <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative">
          <input
            {...register('password', {
              required: '비밀번호를 입력해주세요',
              minLength: {
                value: 8,
                message: '비밀번호는 8자 이상이어야 합니다',
              },
              maxLength: {
                value: 30,
                message: '비밀번호는 30자 이하여야 합니다',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다',
              },
            })}
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="block w-full rounded-md border border-gray-400 bg-white shadow-md hover:border-gray-500 focus:border-2 focus:border-blue-500 focus:shadow-lg text-base py-3 px-4 pr-12 transition-all duration-200"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
        {password && <PasswordStrengthIndicator password={password} />}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">
          비밀번호 확인 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('confirmPassword', {
            required: '비밀번호 확인을 입력해주세요',
            validate: (value) =>
              value === password || '비밀번호가 일치하지 않습니다',
          })}
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-md hover:border-gray-500 focus:border-2 focus:border-blue-500 focus:shadow-lg text-base py-3 px-4 transition-all duration-200"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '처리 중...' : '회원가입'}
        </button>
      </div>
    </form>
  );
}