'use client';

import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthCriteria {
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
  hasMaxLength: boolean;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const criteria: StrengthCriteria = useMemo(() => {
    return {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
      hasMinLength: password.length >= 8,
      hasMaxLength: password.length <= 30,
    };
  }, [password]);

  const strength = useMemo(() => {
    if (!password) return 0;
    
    const criteriaMet = Object.values(criteria).filter(Boolean).length;
    
    if (criteriaMet === 6) return 4; // Strong
    if (criteriaMet >= 5) return 3; // Good
    if (criteriaMet >= 3) return 2; // Fair
    return 1; // Weak
  }, [criteria, password]);

  const strengthText = ['', '약함', '보통', '좋음', '강함'][strength];
  const strengthColor = ['', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'][strength];
  const barColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">비밀번호 강도</span>
        <span className={`text-sm font-medium ${strengthColor}`}>{strengthText}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${strength * 25}%` }}
        />
      </div>

      <div className="mt-2 space-y-1">
        <CriteriaItem met={criteria.hasMinLength} text="8자 이상" />
        <CriteriaItem met={criteria.hasMaxLength} text="30자 이하" />
        <CriteriaItem met={criteria.hasLowercase} text="소문자 포함" />
        <CriteriaItem met={criteria.hasUppercase} text="대문자 포함" />
        <CriteriaItem met={criteria.hasNumber} text="숫자 포함" />
        <CriteriaItem met={criteria.hasSpecialChar} text="특수문자 포함 (@$!%*?&)" />
      </div>
    </div>
  );
}

function CriteriaItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center space-x-1">
      {met ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={`text-xs ${met ? 'text-gray-700' : 'text-gray-400'}`}>{text}</span>
    </div>
  );
}