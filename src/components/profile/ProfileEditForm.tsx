'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usersApi, UpdateProfileData, UserProfile } from '@/lib/api/users';
import toast from 'react-hot-toast';

interface ProfileEditFormProps {
  user: UserProfile;
  onCancel: () => void;
  onSuccess: (updatedUser: UserProfile) => void;
}

export default function ProfileEditForm({ user, onCancel, onSuccess }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileData>({
    defaultValues: {
      nickname: user.nickname,
      bio: user.bio || '',
    },
  });

  const onSubmit = async (data: UpdateProfileData) => {
    setIsLoading(true);
    try {
      const updatedUser = await usersApi.updateProfile(data);
      toast.success('프로필이 업데이트되었습니다.');
      onSuccess(updatedUser);
    } catch (error) {
      toast.error('프로필 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
          닉네임
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
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-md hover:border-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:shadow-lg text-base py-3 px-4 transition-all duration-200"
        />
        {errors.nickname && (
          <p className="mt-1 text-sm text-red-600">{errors.nickname.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          자기소개
        </label>
        <textarea
          {...register('bio')}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-md hover:border-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:shadow-lg text-base py-3 px-4 transition-all duration-200"
          placeholder="자신을 소개해주세요..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}