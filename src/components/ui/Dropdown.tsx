'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  className = '',
  disabled = false,
  size = 'md'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            const selectedOption = options[highlightedIndex];
            if (!selectedOption.disabled) {
              onChange(selectedOption.value);
              setIsOpen(false);
              setHighlightedIndex(-1);
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options, onChange]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setHighlightedIndex(-1);
      }
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-sm';
      case 'lg':
        return 'px-4 py-3 text-lg';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          'relative w-full bg-white border border-gray-300 rounded-md shadow-sm',
          'flex items-center justify-between',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-colors duration-200',
          getSizeClasses(),
          {
            'hover:bg-gray-50': !disabled && !isOpen,
            'bg-gray-50': isOpen,
            'bg-gray-100 cursor-not-allowed text-gray-400': disabled,
            'text-gray-900': !disabled
          }
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={clsx('block truncate', {
          'text-gray-400': !selectedOption && !disabled
        })}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        {/* 화살표 아이콘 */}
        <svg
          className={clsx(
            'h-4 w-4 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
            disabled ? 'text-gray-300' : 'text-gray-400'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 border border-gray-200 overflow-auto focus:outline-none">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option)}
              disabled={option.disabled}
              className={clsx(
                'w-full text-left px-3 py-2 text-sm transition-colors duration-150',
                {
                  'bg-blue-50 text-blue-600': index === highlightedIndex && !option.disabled,
                  'bg-blue-100 text-blue-700 font-medium': option.value === value,
                  'text-gray-900 hover:bg-gray-50': !option.disabled && index !== highlightedIndex && option.value !== value,
                  'text-gray-400 cursor-not-allowed': option.disabled
                }
              )}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}