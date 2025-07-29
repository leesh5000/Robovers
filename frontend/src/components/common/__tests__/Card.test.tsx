import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('Card', () => {
  describe('Basic rendering', () => {
    it('should render children content', () => {
      render(
        <Card>
          <p>Test content</p>
        </Card>
      );
      
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render with title and subtitle', () => {
      render(
        <Card title="Test Title" subtitle="Test Subtitle">
          <p>Content</p>
        </Card>
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should render with image', () => {
      render(
        <Card image="/test-image.jpg" imageAlt="Test image">
          <p>Content</p>
        </Card>
      );
      
      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('should use title as alt text when imageAlt is not provided', () => {
      render(
        <Card image="/test-image.jpg" title="Card Title">
          <p>Content</p>
        </Card>
      );
      
      const image = screen.getByAltText('Card Title');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styles by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('border-gray-200');
    });

    it('should apply secondary variant styles', () => {
      const { container } = render(<Card variant="secondary">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('border-gray-300', 'bg-gray-50');
    });

    it('should apply success variant styles', () => {
      const { container } = render(<Card variant="success">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('border-green-200', 'bg-green-50');
    });

    it('should apply warning variant styles', () => {
      const { container } = render(<Card variant="warning">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('border-yellow-200', 'bg-yellow-50');
    });

    it('should apply error variant styles', () => {
      const { container } = render(<Card variant="error">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('border-red-200', 'bg-red-50');
    });

    it('should apply info variant styles', () => {
      const { container } = render(<Card variant="info">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('border-blue-200', 'bg-blue-50');
    });
  });

  describe('Sizes', () => {
    it('should apply medium size by default', () => {
      render(<Card>Content</Card>);
      const contentDiv = screen.getByText('Content').parentElement;
      expect(contentDiv).toHaveClass('p-6');
    });

    it('should apply extra small size styles', () => {
      render(<Card size="xs">Content</Card>);
      const contentDiv = screen.getByText('Content').parentElement;
      expect(contentDiv).toHaveClass('p-3');
    });

    it('should apply small size styles', () => {
      render(<Card size="sm">Content</Card>);
      const contentDiv = screen.getByText('Content').parentElement;
      expect(contentDiv).toHaveClass('p-4');
    });

    it('should apply large size styles', () => {
      render(<Card size="lg">Content</Card>);
      const contentDiv = screen.getByText('Content').parentElement;
      expect(contentDiv).toHaveClass('p-8');
    });

    it('should apply extra large size styles', () => {
      render(<Card size="xl">Content</Card>);
      const contentDiv = screen.getByText('Content').parentElement;
      expect(contentDiv).toHaveClass('p-10');
    });
  });

  describe('Rounded styles', () => {
    it('should apply rounded styles by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('rounded-lg');
    });

    it('should apply small rounded styles', () => {
      const { container } = render(<Card rounded="sm">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('rounded-sm');
    });

    it('should apply medium rounded styles', () => {
      const { container } = render(<Card rounded="md">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('rounded-md');
    });

    it('should apply full rounded styles', () => {
      const { container } = render(<Card rounded="full">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('rounded-full');
    });

    it('should not apply rounded styles when rounded is false', () => {
      const { container } = render(<Card rounded={false}>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).not.toHaveClass('rounded-lg', 'rounded-sm', 'rounded-md', 'rounded-full');
    });
  });

  describe('Shadow styles', () => {
    it('should apply shadow styles by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('shadow-sm');
    });

    it('should apply small shadow styles', () => {
      const { container } = render(<Card shadow="sm">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('shadow-sm');
    });

    it('should apply medium shadow styles', () => {
      const { container } = render(<Card shadow="md">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('shadow-md');
    });

    it('should apply large shadow styles', () => {
      const { container } = render(<Card shadow="lg">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('shadow-lg');
    });

    it('should apply extra large shadow styles', () => {
      const { container } = render(<Card shadow="xl">Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('shadow-xl');
    });

    it('should not apply shadow styles when shadow is false', () => {
      const { container } = render(<Card shadow={false}>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).not.toHaveClass('shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl');
    });
  });

  describe('Interactive behavior', () => {
    it('should apply hover styles when hoverable is true', () => {
      const { container } = render(<Card hoverable>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('hover:shadow-md');
    });

    it('should apply cursor pointer when clickable is true', () => {
      const { container } = render(<Card clickable>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should call onCardClick when card is clicked', () => {
      const mockClick = jest.fn();
      const { container } = render(
        <Card onCardClick={mockClick}>Content</Card>
      );
      
      const card = container.firstChild as HTMLElement;
      fireEvent.click(card);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('should apply cursor pointer when onCardClick is provided', () => {
      const mockClick = jest.fn();
      const { container } = render(
        <Card onCardClick={mockClick}>Content</Card>
      );
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should not call onCardClick when card has no click handler', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      // Should not throw error
      fireEvent.click(card);
    });
  });

  describe('Header and Footer', () => {
    it('should render custom header', () => {
      const customHeader = <div data-testid="custom-header">Custom Header</div>;
      render(
        <Card header={customHeader}>Content</Card>
      );
      
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('should render custom footer', () => {
      const customFooter = <div data-testid="custom-footer">Custom Footer</div>;
      render(
        <Card footer={customFooter}>Content</Card>
      );
      
      expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
      expect(screen.getByTestId('custom-footer').parentElement).toHaveClass(
        'border-t', 'border-gray-200', 'bg-gray-50', 'px-6', 'py-3'
      );
    });
  });

  describe('Actions', () => {
    it('should render action buttons', () => {
      const actions = (
        <>
          <button>Action 1</button>
          <button>Action 2</button>
        </>
      );
      
      render(
        <Card actions={actions}>Content</Card>
      );
      
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('should apply correct action container styles', () => {
      const actions = <button>Action</button>;
      render(
        <Card actions={actions}>Content</Card>
      );
      
      const actionContainer = screen.getByText('Action').parentElement;
      expect(actionContainer).toHaveClass(
        'mt-4', 'flex', 'items-center', 'justify-end', 'space-x-2'
      );
    });
  });

  describe('Custom className and props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Card className="custom-class">Content</Card>
      );
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass('custom-class');
    });

    it('should pass through additional props', () => {
      const { container } = render(
        <Card data-testid="custom-card">Content</Card>
      );
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveAttribute('data-testid', 'custom-card');
    });
  });

  describe('Content layout with image and header', () => {
    it('should use p-6 padding when header or image is present', () => {
      render(
        <Card 
          header={<div>Header</div>}
          size="xs" // This should be overridden to p-6
        >
          Content
        </Card>
      );
      
      const contentDiv = screen.getByText('Content').parentElement;
      expect(contentDiv).toHaveClass('p-6');
      expect(contentDiv).not.toHaveClass('p-3'); // size="xs" should be overridden
    });

    it('should use p-6 padding when image is present', () => {
      render(
        <Card 
          image="/test.jpg"
          size="xl" // This should be overridden to p-6
        >
          Content
        </Card>
      );
      
      const contentDiv = screen.getByText('Content').parentElement;
      expect(contentDiv).toHaveClass('p-6');
      expect(contentDiv).not.toHaveClass('p-10'); // size="xl" should be overridden
    });
  });

  describe('Conditional rendering', () => {
    it('should not render title/subtitle section when both are empty', () => {
      render(<Card>Content</Card>);
      
      // There should be no h3 or p elements for title/subtitle
      expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });

    it('should render title without subtitle', () => {
      render(<Card title="Only Title">Content</Card>);
      
      expect(screen.getByText('Only Title')).toBeInTheDocument();
      expect(screen.getByText('Only Title')).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
    });

    it('should render subtitle without title', () => {
      render(<Card subtitle="Only Subtitle">Content</Card>);
      
      expect(screen.getByText('Only Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Only Subtitle')).toHaveClass('text-sm', 'text-gray-600');
    });

    it('should not render children wrapper when children is empty', () => {
      const { container } = render(<Card title="Title" />);
      
      // Should not have the children wrapper div
      const childrenDiv = container.querySelector('.text-gray-700');
      expect(childrenDiv).not.toBeInTheDocument();
    });
  });

  describe('Base styles', () => {
    it('should always apply base styles', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass(
        'bg-white',
        'border',
        'border-gray-200',
        'overflow-hidden',
        'transition-all',
        'duration-200'
      );
    });
  });
});