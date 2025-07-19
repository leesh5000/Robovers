import apiClient from './client';

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  bio?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  nickname?: string;
  bio?: string;
  profileImageUrl?: string;
}

export const usersApi = {
  getProfile: async () => {
    const response = await apiClient.get<UserProfile>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiClient.put<UserProfile>('/users/me', data);
    return response.data;
  },
};