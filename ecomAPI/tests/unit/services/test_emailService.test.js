// Unit tests for emailService.js
const emailService = require('../../../src/services/emailService');
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('EmailService', () => {
    let mockTransporter;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTransporter = {
            sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
        };
        nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);
    });

    describe('sendSimpleEmail', () => {
        // TC_ES_001 - Gửi email xác thực thành công
        test('test_sendSimpleEmail_verifyEmail_success', async () => {
            const dataSend = {
                type: 'verifyEmail',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                redirectLink: 'http://localhost:3000/verify?token=abc'
            };
            await emailService.sendSimpleEmail(dataSend);
            expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
                host: 'smtp.gmail.com', port: 587, secure: false
            }));
            expect(mockTransporter.sendMail).toHaveBeenCalled();
            const callArgs = mockTransporter.sendMail.mock.calls[0][0];
            expect(callArgs.to).toBe('test@example.com');
            expect(callArgs.subject).toContain('PTITSHOP');
            expect(callArgs.html).toContain('John Doe');
            expect(callArgs.html).toContain(dataSend.redirectLink);
        });

        // TC_ES_002 - Gửi email quên mật khẩu thành công
        test('test_sendSimpleEmail_forgotpassword_success', async () => {
            const dataSend = {
                type: 'forgotpassword',
                email: 'user@example.com',
                firstName: 'Alice',
                lastName: 'Smith',
                redirectLink: 'http://localhost:3000/reset?token=xyz'
            };
            await emailService.sendSimpleEmail(dataSend);
            expect(mockTransporter.sendMail).toHaveBeenCalled();
            const callArgs = mockTransporter.sendMail.mock.calls[0][0];
            expect(callArgs.to).toBe('user@example.com');
            expect(callArgs.subject).toContain('PTITSHOP');
            expect(callArgs.html).toContain('Alice Smith');
            expect(callArgs.html).toContain(dataSend.redirectLink);
        });

        // TC_ES_003 - Lỗi gửi email
        test('test_sendSimpleEmail_smtp_error', async () => {
            mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));
            const dataSend = {
                type: 'verifyEmail',
                email: 'test@example.com',
                firstName: 'A', lastName: 'B',
                redirectLink: 'http://localhost:3000/verify'
            };
            await expect(emailService.sendSimpleEmail(dataSend)).rejects.toThrow('SMTP error');
        });

        // TC_ES_004 - Type không khớp thì không gửi
        test('test_sendSimpleEmail_unknown_type_no_send', async () => {
            const dataSend = {
                type: 'unknownType',
                email: 'test@example.com',
                firstName: 'A', lastName: 'B',
                redirectLink: 'http://localhost:3000'
            };
            await emailService.sendSimpleEmail(dataSend);
            expect(mockTransporter.sendMail).not.toHaveBeenCalled();
        });

        // TC_ES_005 - Cấu hình transporter đúng
        test('test_sendSimpleEmail_transporter_config', async () => {
            const dataSend = {
                type: 'verifyEmail',
                email: 'x@y.com',
                firstName: 'A', lastName: 'B',
                redirectLink: 'http://localhost:3000/verify'
            };
            await emailService.sendSimpleEmail(dataSend);
            expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
                host: 'smtp.gmail.com', port: 587, secure: false
            }));
        });

        // TC_ES_006 - Sender address đúng
        test('test_sendSimpleEmail_sender_address', async () => {
            const dataSend = {
                type: 'verifyEmail',
                email: 'x@y.com',
                firstName: 'A', lastName: 'B',
                redirectLink: 'http://localhost:3000/verify'
            };
            await emailService.sendSimpleEmail(dataSend);
            const callArgs = mockTransporter.sendMail.mock.calls[0][0];
            expect(callArgs.from).toContain('dotanthanhvlog@gmail.com');
        });
    });
});
