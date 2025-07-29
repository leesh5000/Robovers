'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { getDummyUsers } from '@/lib/dummy-data';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

interface ExtendedUser extends User {
  role: 'admin' | 'editor' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'banned';
  postCount: number;
  commentCount: number;
  reportCount: number;
}

// 확장된 더미 사용자 데이터
const extendedUsers: ExtendedUser[] = getDummyUsers().map((user, index) => ({
  ...user,
  role: index === 0 ? 'admin' : index === 1 ? 'moderator' : 'user',
  status: 'active',
  postCount: (index + 1) * 15,     // 15, 30, 45, 60, 75
  commentCount: (index + 1) * 25,   // 25, 50, 75, 100, 125
  reportCount: index % 3,           // 0, 1, 2, 0, 1
}));

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ExtendedUser[]>(extendedUsers);
  const [selectedRole, setSelectedRole] = useState<'all' | ExtendedUser['role']>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ExtendedUser['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const roleFilterOptions: DropdownOption[] = [
    { value: 'all', label: '모든 역할' },
    { value: 'admin', label: '관리자' },
    { value: 'editor', label: '편집자' },
    { value: 'moderator', label: '모더레이터' },
    { value: 'user', label: '일반 사용자' },
  ];

  const statusFilterOptions: DropdownOption[] = [
    { value: 'all', label: '모든 상태' },
    { value: 'active', label: '활성' },
    { value: 'suspended', label: '정지' },
    { value: 'banned', label: '차단' },
  ];

  const roleOptions: DropdownOption[] = [
    { value: 'admin', label: '관리자' },
    { value: 'editor', label: '편집자' },
    { value: 'moderator', label: '모더레이터' },
    { value: 'user', label: '일반 사용자' },
  ];

  const statusOptions: DropdownOption[] = [
    { value: 'active', label: '활성' },
    { value: 'suspended', label: '정지' },
    { value: 'banned', label: '차단' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const _handleRoleChange = (userId: string, newRole: ExtendedUser['role']) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  const _handleStatusChange = (userId: string, newStatus: ExtendedUser['status']) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const getRoleBadge = (role: ExtendedUser['role']) => {
    const badges = {
      'admin': 'bg-red-100 text-red-800',
      'editor': 'bg-blue-100 text-blue-800',
      'moderator': 'bg-purple-100 text-purple-800',
      'user': 'bg-gray-100 text-gray-800',
    };
    return badges[role];
  };

  const getStatusBadge = (status: ExtendedUser['status']) => {
    const badges = {
      'active': 'bg-green-100 text-green-800',
      'suspended': 'bg-yellow-100 text-yellow-800',
      'banned': 'bg-red-100 text-red-800',
    };
    return badges[status];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
        <p className="mt-2 text-gray-600">사용자 계정과 권한을 관리합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">전체 사용자</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">활성 사용자</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">정지된 사용자</p>
          <p className="text-2xl font-bold text-yellow-600">
            {users.filter(u => u.status === 'suspended').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">관리자/모더레이터</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => ['admin', 'moderator'].includes(u.role)).length}
          </p>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="사용자명 또는 이메일 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <Dropdown
            options={roleFilterOptions}
            value={selectedRole}
            onChange={(value) => setSelectedRole(value as 'all' | ExtendedUser['role'])}
            className="w-36"
          />
          <Dropdown
            options={statusFilterOptions}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value as 'all' | ExtendedUser['status'])}
            className="w-32"
          />
        </div>
      </div>

      {/* 사용자 목록 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                역할
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                활동
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelect(user.id)}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                        {user.isVerified && (
                          <span className="ml-1 text-blue-600" title="인증됨">✓</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                    {roleOptions.find(opt => opt.value === user.role)?.label || user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                    {statusOptions.find(opt => opt.value === user.status)?.label || user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div className="text-xs space-y-1">
                      <div>게시글: {user.postCount}</div>
                      <div>댓글: {user.commentCount}</div>
                      {user.reportCount > 0 && (
                        <div className="text-red-600">신고: {user.reportCount}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(user.joinedAt)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      상세
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      메시지
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}