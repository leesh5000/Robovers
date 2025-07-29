'use client';

import { memo } from 'react';
import { clsx } from 'clsx';
import Image from 'next/image';
import { CardProps } from '@/lib/interfaces';

const Card = memo(function Card({
  children,
  title,
  subtitle,
  image,
  imageAlt,
  actions,
  header,
  footer,
  hoverable = false,
  clickable = false,
  onCardClick,
  variant = 'primary',
  size = 'md',
  rounded = true,
  shadow = true,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'bg-white border border-gray-200 overflow-hidden transition-all duration-200';
  
  const variantStyles = {
    primary: 'border-gray-200',
    secondary: 'border-gray-300 bg-gray-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50'
  };

  const sizeStyles = {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const roundedStyles = {
    true: 'rounded-lg',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
    false: ''
  };

  const shadowStyles = {
    true: 'shadow-sm',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    false: ''
  };

  const interactiveStyles = hoverable || clickable ? 'hover:shadow-md' : '';
  const cursorStyles = clickable || onCardClick ? 'cursor-pointer' : '';

  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        roundedStyles[rounded as keyof typeof roundedStyles],
        shadowStyles[shadow as keyof typeof shadowStyles],
        interactiveStyles,
        cursorStyles,
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {/* 커스텀 헤더 */}
      {header && header}

      {/* 이미지 */}
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={imageAlt || title || ''}
            width={400}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 콘텐츠 영역 */}
      <div className={!header && !image ? sizeStyles[size] : 'p-6'}>
        {/* 제목과 부제목 */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* 메인 콘텐츠 */}
        {children && (
          <div className="text-gray-700">
            {children}
          </div>
        )}

        {/* 액션 버튼들 */}
        {actions && (
          <div className="mt-4 flex items-center justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>

      {/* 커스텀 푸터 */}
      {footer && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          {footer}
        </div>
      )}
    </div>
  );
});

export default Card;