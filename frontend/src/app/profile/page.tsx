'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { usersApi, UserProfile } from '@/lib/api/users';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const profile = await usersApi.getProfile();
        setUser(profile);
      } catch (error) {
        toast.error('프로필을 불러오는데 실패했습니다.');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router]);

  const handleUpdateSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">내 정보</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  수정
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-6">
            {isEditing ? (
              <ProfileEditForm
                user={user}
                onCancel={() => setIsEditing(false)}
                onSuccess={handleUpdateSuccess}
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">이메일</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                  {!user.emailVerified && (
                    <p className="mt-1 text-sm text-yellow-600">
                      ⚠️ 이메일 인증이 필요합니다
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">닉네임</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.nickname}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">자기소개</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.bio || <span className="text-gray-400">자기소개가 없습니다</span>}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">가입일</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">계정 상태</h3>
                  <div className="mt-1 flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '활성' : '비활성'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.emailVerified ? '이메일 인증됨' : '이메일 미인증'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}