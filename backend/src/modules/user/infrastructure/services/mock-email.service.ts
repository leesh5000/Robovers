import { Injectable } from '@nestjs/common';
import { EmailServiceInterface } from '../../application/services/email.service.interface';

@Injectable()
export class MockEmailService implements EmailServiceInterface {
  private verificationCodes = new Map<string, string>();

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    // Store the verification code for development testing
    this.verificationCodes.set(email, code);
    
    console.log('\n🎭 ================== MOCK EMAIL SERVICE ==================');
    console.log('📧 Email Type: Verification Email');
    console.log(`📮 To: ${email}`);
    console.log(`🔐 Verification Code: ${code}`);
    console.log('⏰ Valid for: 10 minutes');
    console.log('🎭 ======================================================\n');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    console.log('\n🎭 ================== MOCK EMAIL SERVICE ==================');
    console.log('📧 Email Type: Welcome Email');
    console.log(`📮 To: ${email}`);
    console.log(`👤 Username: ${username}`);
    console.log('🎉 Content: Welcome to Robovers!');
    console.log('🎭 ======================================================\n');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    console.log('\n🎭 ================== MOCK EMAIL SERVICE ==================');
    console.log('📧 Email Type: Password Reset Email');
    console.log(`📮 To: ${email}`);
    console.log(`🔑 Reset Token: ${resetToken}`);
    console.log('⏰ Valid for: 1 hour');
    console.log('🎭 ======================================================\n');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Development helper method to get verification code
  getVerificationCode(email: string): string | undefined {
    return this.verificationCodes.get(email);
  }

  // Development helper method to list all verification codes
  getAllVerificationCodes(): Record<string, string> {
    return Object.fromEntries(this.verificationCodes);
  }

  // Clear stored codes (for testing)
  clearVerificationCodes(): void {
    this.verificationCodes.clear();
  }
}