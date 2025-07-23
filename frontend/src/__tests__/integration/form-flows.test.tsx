import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { validateField, validateFormData } from '@/lib/validation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

describe('Integration: Form Flows', () => {
  describe('Form Validation Integration', () => {
    it('should integrate validation with form components', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      
      const TestForm = () => {
        const [values, setValues] = React.useState({ email: '', password: '' });
        const [errors, setErrors] = React.useState<Record<string, string>>({});
        
        const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setValues(prev => ({ ...prev, [field]: value }));
          
          // Validate on change
          let error = '';
          if (field === 'email') {
            error = validateField(value, { required: true, email: true }) || '';
          } else if (field === 'password') {
            error = validateField(value, { required: true, minLength: 8 }) || '';
          }
          
          setErrors(prev => ({ ...prev, [field]: error }));
        };
        
        const handleFormSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          
          const formErrors = validateFormData(values, {
            email: [{ required: true }, { email: true }],
            password: [{ required: true }, { minLength: 8 }]
          });
          
          if (Object.keys(formErrors).length === 0) {
            handleSubmit(values);
          } else {
            setErrors(formErrors);
          }
        };
        
        return (
          <form onSubmit={handleFormSubmit} data-testid="test-form">
            <Input
              label="이메일"
              type="email"
              value={values.email}
              onChange={handleInputChange('email')}
              error={errors.email}
            />
            <Input
              label="비밀번호"
              type="password"
              value={values.password}
              onChange={handleInputChange('password')}
              error={errors.password}
            />
            <Button type="submit">제출</Button>
          </form>
        );
      };
      
      render(<TestForm />);
      
      // Test validation on submit with empty form
      const submitButton = screen.getByRole('button', { name: /제출/i });
      await user.click(submitButton);
      
      expect(screen.getByText('이 필드는 필수입니다.')).toBeInTheDocument();
      expect(handleSubmit).not.toHaveBeenCalled();
      
      // Test email validation
      const emailInput = screen.getByLabelText('이메일');
      await user.type(emailInput, 'invalid-email');
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText('올바른 이메일 주소를 입력해주세요.')).toBeInTheDocument();
      });
      
      // Test password validation
      const passwordInput = screen.getByLabelText('비밀번호');
      await user.type(passwordInput, '123');
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText('최소 8자 이상 입력해주세요.')).toBeInTheDocument();
      });
      
      // Test successful submission
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      
      await user.clear(passwordInput);
      await user.type(passwordInput, 'password123');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  });

  describe('Modal and Form Integration', () => {
    it('should handle form within modal correctly', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      const onSubmit = jest.fn();
      
      const ModalForm = () => {
        const [isOpen, setIsOpen] = React.useState(true);
        const [name, setName] = React.useState('');
        
        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (name.trim()) {
            onSubmit(name);
            setIsOpen(false);
          }
        };
        
        return (
          <Modal
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setIsOpen(false);
            }}
            title="사용자 정보 입력"
            footer={
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  취소
                </Button>
                <Button type="submit" form="user-form">
                  저장
                </Button>
              </div>
            }
          >
            <form id="user-form" onSubmit={handleSubmit}>
              <Input
                label="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </form>
          </Modal>
        );
      };
      
      render(<ModalForm />);
      
      // Modal should be open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('사용자 정보 입력')).toBeInTheDocument();
      
      // Test form submission
      const nameInput = screen.getByLabelText('이름');
      await user.type(nameInput, 'John Doe');
      
      const saveButton = screen.getByRole('button', { name: /저장/i });
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith('John Doe');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Complex Form Interactions', () => {
    it('should handle dynamic form fields', async () => {
      const user = userEvent.setup();
      
      const DynamicForm = () => {
        const [fields, setFields] = React.useState([{ id: 1, value: '' }]);
        
        const addField = () => {
          setFields(prev => [...prev, { id: Date.now(), value: '' }]);
        };
        
        const removeField = (id: number) => {
          setFields(prev => prev.filter(field => field.id !== id));
        };
        
        const updateField = (id: number, value: string) => {
          setFields(prev => prev.map(field => 
            field.id === id ? { ...field, value } : field
          ));
        };
        
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <Input
                  label={`필드 ${index + 1}`}
                  value={field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                />
                {fields.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeField(field.id)}
                  >
                    삭제
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addField}>필드 추가</Button>
          </div>
        );
      };
      
      render(<DynamicForm />);
      
      // Initially should have one field
      expect(screen.getByLabelText('필드 1')).toBeInTheDocument();
      expect(screen.queryByText('삭제')).not.toBeInTheDocument();
      
      // Add a field
      const addButton = screen.getByText('필드 추가');
      await user.click(addButton);
      
      expect(screen.getByLabelText('필드 2')).toBeInTheDocument();
      expect(screen.getAllByText('삭제')).toHaveLength(2);
      
      // Fill in values
      await user.type(screen.getByLabelText('필드 1'), 'First field');
      await user.type(screen.getByLabelText('필드 2'), 'Second field');
      
      expect(screen.getByDisplayValue('First field')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Second field')).toBeInTheDocument();
      
      // Remove a field
      const deleteButtons = screen.getAllByText('삭제');
      await user.click(deleteButtons[0]);
      
      expect(screen.queryByDisplayValue('First field')).not.toBeInTheDocument();
      expect(screen.getByDisplayValue('Second field')).toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle and display errors gracefully', async () => {
      const user = userEvent.setup();
      
      const ErrorProneForm = () => {
        const [error, setError] = React.useState<string | null>(null);
        const [loading, setLoading] = React.useState(false);
        
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          
          try {
            // Simulate API call that fails
            await new Promise((_, reject) => 
              setTimeout(() => reject(new Error('서버 오류가 발생했습니다.')), 100)
            );
          } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
          } finally {
            setLoading(false);
          }
        };
        
        return (
          <form onSubmit={handleSubmit}>
            {error && (
              <div role="alert" className="text-red-600 mb-4">
                {error}
              </div>
            )}
            <Input label="테스트 필드" />
            <Button type="submit" isLoading={loading}>
              {loading ? '처리 중...' : '제출'}
            </Button>
          </form>
        );
      };
      
      render(<ErrorProneForm />);
      
      const submitButton = screen.getByRole('button', { name: /제출/i });
      await user.click(submitButton);
      
      // Should show loading state
      expect(screen.getByText('처리 중...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      
      // Should show error after failure
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('서버 오류가 발생했습니다.')).toBeInTheDocument();
      });
      
      // Should be able to retry
      expect(screen.getByText('제출')).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });
});