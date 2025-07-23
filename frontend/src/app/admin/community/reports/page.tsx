'use client';

import { useState } from 'react';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

interface Report {
  id: string;
  type: 'post' | 'comment' | 'user';
  reason: string;
  description: string;
  reportedBy: string;
  reportedAt: Date;
  targetId: string;
  targetTitle: string;
  targetAuthor: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

// 더미 신고 데이터
const dummyReports: Report[] = [
  {
    id: '1',
    type: 'post',
    reason: '스팸/광고',
    description: '상업적 광고 게시글입니다.',
    reportedBy: 'user123',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    targetId: 'post-1',
    targetTitle: '최고의 로봇 부품 판매! 지금 구매하세요!',
    targetAuthor: 'spammer01',
    status: 'pending',
  },
  {
    id: '2',
    type: 'comment',
    reason: '욕설/비방',
    description: '다른 사용자에게 욕설을 사용했습니다.',
    reportedBy: 'user456',
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    targetId: 'comment-1',
    targetTitle: '이런 멍청한 질문을...',
    targetAuthor: 'troll99',
    status: 'pending',
  },
  {
    id: '3',
    type: 'post',
    reason: '허위정보',
    description: '잘못된 기술 정보를 퍼뜨리고 있습니다.',
    reportedBy: 'expert789',
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    targetId: 'post-2',
    targetTitle: 'Tesla 로봇이 내년에 무료 배포된다고?',
    targetAuthor: 'faker123',
    status: 'pending',
  },
  {
    id: '4',
    type: 'user',
    reason: '사칭',
    description: 'Boston Dynamics 직원을 사칭하고 있습니다.',
    reportedBy: 'admin',
    reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    targetId: 'user-1',
    targetTitle: 'BostonDynamics_Official',
    targetAuthor: 'BostonDynamics_Official',
    status: 'resolved',
  },
  {
    id: '5',
    type: 'post',
    reason: '기타',
    description: '게시글이 커뮤니티 가이드라인을 위반합니다.',
    reportedBy: 'moderator1',
    reportedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    targetId: 'post-3',
    targetTitle: '불법 로봇 개조 방법',
    targetAuthor: 'hacker007',
    status: 'resolved',
  },
];

export default function AdminCommunityReportsPage() {
  const [reports, setReports] = useState<Report[]>(dummyReports);
  const [selectedType, setSelectedType] = useState<'all' | Report['type']>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | Report['status']>('all');

  const typeOptions: DropdownOption[] = [
    { value: 'all', label: '모든 유형' },
    { value: 'post', label: '게시글' },
    { value: 'comment', label: '댓글' },
    { value: 'user', label: '사용자' },
  ];

  const statusOptions: DropdownOption[] = [
    { value: 'all', label: '모든 상태' },
    { value: 'pending', label: '대기중' },
    { value: 'resolved', label: '처리됨' },
    { value: 'dismissed', label: '기각됨' },
  ];

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const handleResolve = (id: string, action: 'resolved' | 'dismissed') => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, status: action } : r
    ));
  };

  const getReasonBadge = (reason: string) => {
    const badges = {
      '스팸/광고': 'bg-gray-100 text-gray-800',
      '욕설/비방': 'bg-red-100 text-red-800',
      '허위정보': 'bg-yellow-100 text-yellow-800',
      '사칭': 'bg-purple-100 text-purple-800',
      '기타': 'bg-blue-100 text-blue-800',
    };
    return badges[reason as keyof typeof badges] || badges['기타'];
  };

  const getStatusBadge = (status: Report['status']) => {
    const badges = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'dismissed': 'bg-gray-100 text-gray-800',
    };
    return badges[status];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}일 전`;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">신고 관리</h1>
        <p className="mt-2 text-gray-600">커뮤니티 신고 내용을 검토하고 처리합니다.</p>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Dropdown
            options={typeOptions}
            value={selectedType}
            onChange={(value) => setSelectedType(value as any)}
            className="w-32"
          />
          <Dropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value as any)}
            className="w-32"
          />
          <div className="ml-auto text-sm text-gray-600">
            총 {filteredReports.length}건의 신고
          </div>
        </div>
      </div>

      {/* 신고 목록 */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getReasonBadge(report.reason)}`}>
                    {report.reason}
                  </span>
                  <span className="text-xs text-gray-500">
                    {report.type === 'post' && '게시글'}
                    {report.type === 'comment' && '댓글'}
                    {report.type === 'user' && '사용자'}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(report.status)}`}>
                    {report.status === 'pending' && '대기중'}
                    {report.status === 'resolved' && '처리됨'}
                    {report.status === 'dismissed' && '기각됨'}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {report.targetTitle}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  작성자: <span className="font-medium">{report.targetAuthor}</span>
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(report.reportedAt)}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">신고 사유:</span> {report.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                신고자: {report.reportedBy}
              </p>
            </div>

            {report.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleResolve(report.id, 'resolved')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  삭제 및 처리
                </button>
                <button
                  onClick={() => handleResolve(report.id, 'dismissed')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  기각
                </button>
                <button className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm">
                  원본 보기
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">처리할 신고가 없습니다.</p>
        </div>
      )}
    </div>
  );
}