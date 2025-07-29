import React from 'react';
import { render, screen } from '@testing-library/react';
import RobotFeatures from '../RobotFeatures';

describe('RobotFeatures', () => {
  const mockFeatures = [
    'AI 대화 기능',
    '물체 인식',
    '이족 보행',
    '물체 조작',
    '동적 균형',
    '자율 내비게이션',
    '음성 인식',
    '얼굴 인식',
    '감정 표현',
    '자동 충전',
    '다중 센서',
    '머신 러닝'
  ];

  describe('Rendering', () => {
    it('should render component title', () => {
      render(<RobotFeatures features={mockFeatures} />);
      
      expect(screen.getByText('주요 기능')).toBeInTheDocument();
      expect(screen.getByText('주요 기능')).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
    });

    it('should render all features as cards', () => {
      render(<RobotFeatures features={mockFeatures} />);
      
      mockFeatures.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });

    it('should render total feature count', () => {
      render(<RobotFeatures features={mockFeatures} />);
      
      expect(screen.getByText(`총 ${mockFeatures.length}개의 주요 기능`)).toBeInTheDocument();
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('should apply correct CSS classes to feature cards', () => {
      render(<RobotFeatures features={['테스트 기능']} />);
      
      const featureCard = screen.getByText('테스트 기능').closest('div');
      expect(featureCard).toHaveClass(
        'bg-gradient-to-r',
        'from-blue-50',
        'to-indigo-50',
        'border',
        'border-blue-200',
        'rounded-lg',
        'p-4'
      );
    });

    it('should render features in grid layout', () => {
      render(<RobotFeatures features={mockFeatures} />);
      
      const gridContainer = screen.getByText(mockFeatures[0]).closest('div')?.parentElement;
      expect(gridContainer).toHaveClass(
        'grid',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'gap-4'
      );
    });
  });

  describe('Feature Icons', () => {
    it('should display AI/대화 icon for AI-related features', () => {
      render(<RobotFeatures features={['AI 대화', '인공지능', '대화 기능']} />);
      
      const aiIcons = screen.getAllByText('🧠');
      expect(aiIcons).toHaveLength(3);
    });

    it('should display vision icon for recognition-related features', () => {
      render(<RobotFeatures features={['물체 인식', 'vision sensor', '카메라 기능']} />);
      
      const visionIcons = screen.getAllByText('👁️');
      expect(visionIcons).toHaveLength(3);
    });

    it('should display walking icon for movement-related features', () => {
      render(<RobotFeatures features={['이족 보행', 'walking capability', '이동 기능']} />);
      
      const walkIcons = screen.getAllByText('🚶');
      expect(walkIcons).toHaveLength(3);
    });

    it('should display manipulation icon for grabbing-related features', () => {
      render(<RobotFeatures features={['물체 조작', 'grab objects', '집기 기능']} />);
      
      const grabIcons = screen.getAllByText('🤲');
      expect(grabIcons).toHaveLength(3);
    });

    it('should display balance icon for balance-related features', () => {
      render(<RobotFeatures features={['동적 균형', 'balance control']} />);
      
      const balanceIcons = screen.getAllByText('⚖️');
      expect(balanceIcons).toHaveLength(2);
    });

    it('should display acrobatics icon for jumping-related features', () => {
      render(<RobotFeatures features={['점프 기능', '파쿠르', '백플립']} />);
      
      const jumpIcons = screen.getAllByText('🤸');
      expect(jumpIcons).toHaveLength(3);
    });

    it('should display learning icon for learning-related features', () => {
      render(<RobotFeatures features={['머신 러닝', 'learning capability', '학습 기능']} />);
      
      const learnIcons = screen.getAllByText('📚');
      expect(learnIcons).toHaveLength(3);
    });

    it('should display navigation icon for navigation-related features', () => {
      render(<RobotFeatures features={['자율 내비게이션', 'navigation system']} />);
      
      const navIcons = screen.getAllByText('🧭');
      expect(navIcons).toHaveLength(2);
    });

    it('should display voice icon for voice-related features', () => {
      render(<RobotFeatures features={['음성 인식', 'voice command']} />);
      
      const voiceIcons = screen.getAllByText('🗣️');
      expect(voiceIcons).toHaveLength(2);
    });

    it('should display face icon for face-related features', () => {
      render(<RobotFeatures features={['얼굴 인식', 'face detection']} />);
      
      const faceIcons = screen.getAllByText('😊');
      expect(faceIcons).toHaveLength(2);
    });

    it('should display emotion icon for emotion-related features', () => {
      render(<RobotFeatures features={['감정 표현', 'emotion recognition']} />);
      
      const emotionIcons = screen.getAllByText('💝');
      expect(emotionIcons).toHaveLength(2);
    });

    it('should display charge icon for charging-related features', () => {
      render(<RobotFeatures features={['자동 충전', 'wireless charge']} />);
      
      const chargeIcons = screen.getAllByText('🔌');
      expect(chargeIcons).toHaveLength(2);
    });

    it('should display sensor icon for sensor-related features', () => {
      render(<RobotFeatures features={['다중 센서', 'sensor array']} />);
      
      const sensorIcons = screen.getAllByText('📡');
      expect(sensorIcons).toHaveLength(2);
    });

    it('should display default icon for unmatched features', () => {
      render(<RobotFeatures features={['알 수 없는 기능', 'unknown feature']} />);
      
      const defaultIcons = screen.getAllByText('⚙️');
      expect(defaultIcons).toHaveLength(2);
    });

    it('should be case insensitive when matching icons', () => {
      render(<RobotFeatures features={['AI 기능', 'ai 기능', 'Ai 기능', 'aI 기능']} />);
      
      const aiIcons = screen.getAllByText('🧠');
      expect(aiIcons).toHaveLength(4);
    });

    it('should match partial keywords in feature names', () => {
      render(<RobotFeatures features={[
        '고급 AI 대화 시스템',
        '정밀 물체 인식 센서',
        '안정적인 이족 보행 알고리즘'
      ]} />);
      
      expect(screen.getByText('🧠')).toBeInTheDocument(); // AI
      expect(screen.getByText('👁️')).toBeInTheDocument(); // 인식
      expect(screen.getByText('🚶')).toBeInTheDocument(); // 보행
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty features array', () => {
      render(<RobotFeatures features={[]} />);
      
      expect(screen.getByText('주요 기능')).toBeInTheDocument();
      expect(screen.getByText('총 0개의 주요 기능')).toBeInTheDocument();
      
      // No feature cards should be rendered
      const featureCards = screen.queryAllByText(/🧠|👁️|🚶|🤲|⚖️|🤸|📚|🧭|🗣️|😊|💝|🔌|📡|⚙️/);
      expect(featureCards).toHaveLength(1); // Only the 🎯 icon in total count
    });

    it('should handle single feature', () => {
      render(<RobotFeatures features={['단일 기능']} />);
      
      expect(screen.getByText('단일 기능')).toBeInTheDocument();
      expect(screen.getByText('총 1개의 주요 기능')).toBeInTheDocument();
      expect(screen.getByText('⚙️')).toBeInTheDocument(); // Default icon
    });

    it('should handle duplicate features', () => {
      const duplicateFeatures = ['AI 기능', 'AI 기능', '물체 인식', '물체 인식'];
      render(<RobotFeatures features={duplicateFeatures} />);
      
      // Should render all features including duplicates
      expect(screen.getAllByText('AI 기능')).toHaveLength(2);
      expect(screen.getAllByText('물체 인식')).toHaveLength(2);
      expect(screen.getByText('총 4개의 주요 기능')).toBeInTheDocument();
    });

    it('should handle features with special characters', () => {
      const specialFeatures = [
        'AI/ML 통합 시스템',
        '3D 비전 & 인식',
        '멀티-센서 융합',
        '실시간 SLAM (동시 위치추정 및 지도작성)'
      ];
      
      render(<RobotFeatures features={specialFeatures} />);
      
      specialFeatures.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
      
      expect(screen.getByText('총 4개의 주요 기능')).toBeInTheDocument();
    });

    it('should handle very long feature names', () => {
      const longFeature = '매우 긴 기능명을 가진 복잡한 로봇 시스템으로 다양한 센서와 AI 기술이 통합된 고급 기능';
      render(<RobotFeatures features={[longFeature]} />);
      
      expect(screen.getByText(longFeature)).toBeInTheDocument();
      expect(screen.getByText('🧠')).toBeInTheDocument(); // Should match AI
    });

    it('should handle features with numbers', () => {
      const numberedFeatures = [
        '360도 시야각 카메라',
        '24시간 자율 운영',
        '5G 통신 지원',
        '3축 자이로스코프 센서'
      ];
      
      render(<RobotFeatures features={numberedFeatures} />);
      
      numberedFeatures.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
      
      // Should correctly identify sensor and camera
      expect(screen.getByText('👁️')).toBeInTheDocument(); // 카메라
      expect(screen.getByText('📡')).toBeInTheDocument(); // 센서
    });

    it('should handle mixed language features', () => {
      const mixedFeatures = [
        'Advanced AI Learning',
        '고급 물체 recognition',
        'Intelligent 음성 processing',
        'Multi-sensor 융합 시스템'
      ];
      
      render(<RobotFeatures features={mixedFeatures} />);
      
      mixedFeatures.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
      
      // Should match keywords regardless of language mix
      expect(screen.getByText('🧠')).toBeInTheDocument(); // AI
      expect(screen.getByText('👁️')).toBeInTheDocument(); // recognition
      expect(screen.getByText('🗣️')).toBeInTheDocument(); // 음성
      expect(screen.getByText('📡')).toBeInTheDocument(); // sensor
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<RobotFeatures features={mockFeatures} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('주요 기능');
    });

    it('should have readable text contrast', () => {
      render(<RobotFeatures features={['테스트 기능']} />);
      
      const featureText = screen.getByText('테스트 기능');
      expect(featureText).toHaveClass('text-gray-800', 'font-medium');
    });

    it('should have proper semantic structure', () => {
      render(<RobotFeatures features={mockFeatures} />);
      
      // Check if features are in a meaningful container
      const featureContainer = screen.getByText(mockFeatures[0]).closest('div');
      expect(featureContainer).toHaveClass('flex', 'items-center');
    });
  });

  describe('Performance', () => {
    it('should handle large number of features efficiently', () => {
      const manyFeatures = Array.from({ length: 100 }, (_, i) => `기능 ${i + 1}`);
      
      const { container } = render(<RobotFeatures features={manyFeatures} />);
      
      expect(screen.getByText('총 100개의 주요 기능')).toBeInTheDocument();
      expect(container.querySelectorAll('div[class*="bg-gradient-to-r"]')).toHaveLength(100);
    });

    it('should render features with consistent structure', () => {
      render(<RobotFeatures features={mockFeatures} />);
      
      // All feature cards should have the same structure
      const featureCards = screen.getAllByText(/🧠|👁️|🚶|🤲|⚖️|🤸|📚|🧭|🗣️|😊|💝|🔌|📡|⚙️/).slice(0, -1); // Exclude the 🎯 from count
      
      featureCards.forEach(icon => {
        const card = icon.closest('div');
        expect(card).toHaveClass('flex', 'items-center');
        
        const parentCard = card?.closest('div');
        expect(parentCard).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-indigo-50');
      });
    });
  });
});