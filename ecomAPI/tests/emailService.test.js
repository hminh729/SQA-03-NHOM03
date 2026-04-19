const emailService = require('../src/services/emailService');
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('EmailService Tests', () => {
  let mockTransporter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
    };
    nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);
  });

  describe('sendSimpleEmail - Verify Email', () => {
    test('TC_EMAIL_001: Should send verification email successfully', async () => {
      const mockData = {
        type: 'verifyEmail',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        redirectLink: 'http://localhost:3000/verify?token=abc123'
      };

      await emailService.sendSimpleEmail(mockData);

      expect(mockTransporter.sendMail).toHaveBeenCalled();
      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('test@example.com');
      expect(callArgs.subject).toContain('PTITSHOP');
    });

    test('TC_EMAIL_002: Should handle email sending error', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));

      const mockData = {
        type: 'verifyEmail',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        redirectLink: 'http://localhost:3000/verify'
      };

      await expect(emailService.sendSimpleEmail(mockData)).rejects.toThrow();
    });
  });

  describe('sendSimpleEmail - Forgot Password', () => {
    test('TC_EMAIL_003: Should send forgot password email successfully', async () => {
      const mockData = {
        type: 'forgotpassword',
        email: 'user@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        redirectLink: 'http://localhost:3000/reset-password'
      };

      await emailService.sendSimpleEmail(mockData);

      expect(mockTransporter.sendMail).toHaveBeenCalled();
      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('user@example.com');
      expect(callArgs.subject).toContain('PTITSHOP');
    });

    test('TC_EMAIL_004: Should create transporter with correct config', async () => {
      const mockData = {
        type: 'verifyEmail',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        redirectLink: 'http://localhost:3000/verify'
      };

      await emailService.sendSimpleEmail(mockData);

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false
        })
      );
    });
  });
});

