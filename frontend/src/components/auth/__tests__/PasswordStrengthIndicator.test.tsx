import React from 'react';
import { render, screen } from '@testing-library/react';
import PasswordStrengthIndicator from '../PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  describe('Empty password handling', () => {
    it('should return null when password is empty', () => {
      const { container } = render(<PasswordStrengthIndicator password="" />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null when password is undefined/null', () => {
      const { container } = render(<PasswordStrengthIndicator password={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Password strength calculation', () => {
    it('should show weak strength for passwords meeting 1-2 criteria', () => {
      render(<PasswordStrengthIndicator password="abc" />);
      expect(screen.getByText('약함')).toBeInTheDocument();
      expect(screen.getByText('약함')).toHaveClass('text-red-500');
    });

    it('should show fair strength for passwords meeting 3-4 criteria', () => {
      render(<PasswordStrengthIndicator password="abcDEF123" />);
      expect(screen.getByText('보통')).toBeInTheDocument();
      expect(screen.getByText('보통')).toHaveClass('text-yellow-500');
    });

    it('should show good strength for passwords meeting 5 criteria', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@" />);
      expect(screen.getByText('좋음')).toBeInTheDocument();
      expect(screen.getByText('좋음')).toHaveClass('text-blue-500');
    });

    it('should show strong strength for passwords meeting all 6 criteria', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@validPass" />);
      expect(screen.getByText('강함')).toBeInTheDocument();
      expect(screen.getByText('강함')).toHaveClass('text-green-500');
    });
  });

  describe('Individual criteria validation', () => {
    it('should validate lowercase letters', () => {
      render(<PasswordStrengthIndicator password="abc123DEF@" />);
      
      const lowercaseItem = screen.getByText('소문자 포함').closest('div');
      expect(lowercaseItem?.querySelector('svg')).toHaveClass('text-green-500');
    });

    it('should validate uppercase letters', () => {
      render(<PasswordStrengthIndicator password="ABC123def@" />);
      
      const uppercaseItem = screen.getByText('대문자 포함').closest('div');
      expect(uppercaseItem?.querySelector('svg')).toHaveClass('text-green-500');
    });

    it('should validate numbers', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@" />);
      
      const numberItem = screen.getByText('숫자 포함').closest('div');
      expect(numberItem?.querySelector('svg')).toHaveClass('text-green-500');
    });

    it('should validate special characters', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@" />);
      
      const specialCharItem = screen.getByText('특수문자 포함 (@$!%*?&)').closest('div');
      expect(specialCharItem?.querySelector('svg')).toHaveClass('text-green-500');
    });

    it('should validate minimum length (8 characters)', () => {
      render(<PasswordStrengthIndicator password="abcDEF12" />);
      
      const minLengthItem = screen.getByText('8자 이상').closest('div');
      expect(minLengthItem?.querySelector('svg')).toHaveClass('text-green-500');
    });

    it('should invalidate passwords shorter than 8 characters', () => {
      render(<PasswordStrengthIndicator password="abcDEF1" />);
      
      const minLengthItem = screen.getByText('8자 이상').closest('div');
      expect(minLengthItem?.querySelector('svg')).toHaveClass('text-gray-400');
    });

    it('should validate maximum length (30 characters)', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@ValidPassword123!" />);
      
      const maxLengthItem = screen.getByText('30자 이하').closest('div');
      expect(maxLengthItem?.querySelector('svg')).toHaveClass('text-green-500');
    });

    it('should invalidate passwords longer than 30 characters', () => {
      const longPassword = 'abcDEF123@ThisPasswordIsTooLongAndExceeds30Characters!';
      render(<PasswordStrengthIndicator password={longPassword} />);
      
      const maxLengthItem = screen.getByText('30자 이하').closest('div');
      expect(maxLengthItem?.querySelector('svg')).toHaveClass('text-gray-400');
    });
  });

  describe('Special character validation', () => {
    const specialChars = ['@', '$', '!', '%', '*', '?', '&'];
    
    specialChars.forEach(char => {
      it(`should validate special character: ${char}`, () => {
        render(<PasswordStrengthIndicator password={`abcDEF123${char}`} />);
        
        const specialCharItem = screen.getByText('특수문자 포함 (@$!%*?&)').closest('div');
        expect(specialCharItem?.querySelector('svg')).toHaveClass('text-green-500');
      });
    });

    it('should not validate other special characters', () => {
      render(<PasswordStrengthIndicator password="abcDEF123#" />);
      
      const specialCharItem = screen.getByText('특수문자 포함 (@$!%*?&)').closest('div');
      expect(specialCharItem?.querySelector('svg')).toHaveClass('text-gray-400');
    });
  });

  describe('Strength bar visualization', () => {
    it('should show 25% width for weak password', () => {
      render(<PasswordStrengthIndicator password="abc" />);
      
      const strengthBar = document.querySelector('.bg-red-500');
      expect(strengthBar).toHaveStyle('width: 25%');
    });

    it('should show 50% width for fair password', () => {
      render(<PasswordStrengthIndicator password="abcDEF123" />);
      
      const strengthBar = document.querySelector('.bg-yellow-500');
      expect(strengthBar).toHaveStyle('width: 50%');
    });

    it('should show 75% width for good password', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@" />);
      
      const strengthBar = document.querySelector('.bg-blue-500');
      expect(strengthBar).toHaveStyle('width: 75%');
    });

    it('should show 100% width for strong password', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@validPass" />);
      
      const strengthBar = document.querySelector('.bg-green-500');
      expect(strengthBar).toHaveStyle('width: 100%');
    });
  });

  describe('Criteria items display', () => {
    it('should show all criteria items', () => {
      render(<PasswordStrengthIndicator password="test" />);
      
      expect(screen.getByText('8자 이상')).toBeInTheDocument();
      expect(screen.getByText('30자 이하')).toBeInTheDocument();
      expect(screen.getByText('소문자 포함')).toBeInTheDocument();
      expect(screen.getByText('대문자 포함')).toBeInTheDocument();
      expect(screen.getByText('숫자 포함')).toBeInTheDocument();
      expect(screen.getByText('특수문자 포함 (@$!%*?&)')).toBeInTheDocument();
    });

    it('should show check icon for met criteria', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@validPass" />);
      
      const checkIcons = document.querySelectorAll('.text-green-500 svg');
      expect(checkIcons.length).toBe(6); // All criteria met
      
      checkIcons.forEach(icon => {
        expect(icon.querySelector('path')).toHaveAttribute('d', 'M5 13l4 4L19 7');
      });
    });

    it('should show X icon for unmet criteria', () => {
      render(<PasswordStrengthIndicator password="abc" />);
      
      const xIcons = document.querySelectorAll('.text-gray-400 svg');
      expect(xIcons.length).toBeGreaterThan(0);
      
      // Check for X icon path
      const xIcon = Array.from(xIcons).find(icon => 
        icon.querySelector('path')?.getAttribute('d') === 'M6 18L18 6M6 6l12 12'
      );
      expect(xIcon).toBeDefined();
    });

    it('should apply correct text colors for met vs unmet criteria', () => {
      render(<PasswordStrengthIndicator password="abcDEF123" />);
      
      // Met criteria should have darker text
      const metCriteriaText = screen.getByText('소문자 포함');
      expect(metCriteriaText).toHaveClass('text-gray-700');
      
      // Unmet criteria should have lighter text  
      const unmetCriteriaText = screen.getByText('특수문자 포함 (@$!%*?&)');
      expect(unmetCriteriaText).toHaveClass('text-gray-400');
    });
  });

  describe('Edge cases', () => {
    it('should handle very short passwords', () => {
      render(<PasswordStrengthIndicator password="a" />);
      expect(screen.getByText('약함')).toBeInTheDocument();
    });

    it('should handle passwords with only spaces', () => {
      render(<PasswordStrengthIndicator password="        " />);
      expect(screen.getByText('약함')).toBeInTheDocument();
    });

    it('should handle passwords with unicode characters', () => {
      render(<PasswordStrengthIndicator password="abcDEF123@한글테스트" />);
      expect(screen.getByText('강함')).toBeInTheDocument();
    });

    it('should handle exactly 8 character password', () => {
      render(<PasswordStrengthIndicator password="abcDEF12" />);
      
      const minLengthItem = screen.getByText('8자 이상').closest('div');
      expect(minLengthItem?.querySelector('svg')).toHaveClass('text-green-500');
    });

    it('should handle exactly 30 character password', () => {
      const thirtyCharPassword = 'abcDEF123@ValidPassword1234!';
      expect(thirtyCharPassword.length).toBe(30);
      
      render(<PasswordStrengthIndicator password={thirtyCharPassword} />);
      
      const maxLengthItem = screen.getByText('30자 이하').closest('div');
      expect(maxLengthItem?.querySelector('svg')).toHaveClass('text-green-500');
    });
  });

  describe('Component structure', () => {
    it('should render strength label and text', () => {
      render(<PasswordStrengthIndicator password="test123" />);
      
      expect(screen.getByText('비밀번호 강도')).toBeInTheDocument();
      expect(screen.getByText('비밀번호 강도')).toHaveClass('text-sm', 'font-medium', 'text-gray-700');
    });

    it('should render progress bar container', () => {
      const { container } = render(<PasswordStrengthIndicator password="test123" />);
      
      const progressContainer = container.querySelector('.bg-gray-200.rounded-full.h-2');
      expect(progressContainer).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      const { container } = render(<PasswordStrengthIndicator password="abcDEF123@validPass" />);
      
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('mt-2');
      
      const strengthBar = container.querySelector('.h-2.rounded-full.transition-all.duration-300');
      expect(strengthBar).toBeInTheDocument();
    });
  });
});