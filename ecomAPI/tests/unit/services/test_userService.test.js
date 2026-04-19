// Unit tests for userService.js
const userService = require('../../../src/services/userService');
const db = require('../../../src/models/index');
const bcrypt = require('bcryptjs');
const emailService = require('../../../src/services/emailService');

jest.mock('../../../src/models/index');
jest.mock('bcryptjs');
jest.mock('../../../src/services/emailService');
jest.mock('../../../src/services/recommendationService', () => ({ initForUser: jest.fn() }));
jest.mock('../../../src/utils/CommonUtils', () => ({ encodeToken: jest.fn().mockReturnValue('mock-token') }));
jest.mock('uuid', () => ({ v4: jest.fn().mockReturnValue('mock-uuid') }));

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ===================== handleCreateNewUser =====================
    describe('handleCreateNewUser', () => {
        // TC_US_001 - Tạo user thành công
        test('test_handleCreateNewUser_success', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({}) };
            bcrypt.genSaltSync.mockReturnValue('salt');
            bcrypt.hashSync.mockReturnValue('hashed');
            const result = await userService.handleCreateNewUser({
                email: 'new@example.com', password: '123', lastName: 'Nguyen'
            });
            expect(result.errCode).toBe(0);
            expect(db.User.create).toHaveBeenCalled();
        });

        // TC_US_002 - Thiếu email
        test('test_handleCreateNewUser_missing_email', async () => {
            const result = await userService.handleCreateNewUser({ lastName: 'Nguyen' });
            expect(result.errCode).toBe(2);
            expect(result.errMessage).toBe('Missing required parameters !');
        });

        // TC_US_003 - Thiếu lastName
        test('test_handleCreateNewUser_missing_lastName', async () => {
            const result = await userService.handleCreateNewUser({ email: 'a@b.com' });
            expect(result.errCode).toBe(2);
        });

        // TC_US_004 - Email đã tồn tại
        test('test_handleCreateNewUser_email_exists', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 1 }) };
            const result = await userService.handleCreateNewUser({
                email: 'existing@example.com', lastName: 'Nguyen', password: '123'
            });
            expect(result.errCode).toBe(1);
            expect(result.errMessage).toContain('already in used');
        });
    });

    // ===================== deleteUser =====================
    describe('deleteUser', () => {
        // TC_US_005
        test('test_deleteUser_success', async () => {
            db.User = {
                findOne: jest.fn().mockResolvedValue({ id: 1 }),
                destroy: jest.fn().mockResolvedValue(1)
            };
            const result = await userService.deleteUser(1);
            expect(result.errCode).toBe(0);
        });

        // TC_US_006
        test('test_deleteUser_missing_id', async () => {
            const result = await userService.deleteUser(null);
            expect(result.errCode).toBe(1);
        });

        // TC_US_007
        test('test_deleteUser_not_found', async () => {
            db.User = {
                findOne: jest.fn().mockResolvedValue(null),
                destroy: jest.fn().mockResolvedValue(0)
            };
            const result = await userService.deleteUser(999);
            expect(result.errCode).toBe(2);
        });
    });

    // ===================== updateUserData =====================
    describe('updateUserData', () => {
        // TC_US_008
        test('test_updateUserData_success', async () => {
            const mockUser = { save: jest.fn().mockResolvedValue({}) };
            db.User = { findOne: jest.fn().mockResolvedValue(mockUser) };
            const result = await userService.updateUserData({ id: 1, genderId: 'M', firstName: 'A', lastName: 'B' });
            expect(result.errCode).toBe(0);
            expect(mockUser.save).toHaveBeenCalled();
        });

        // TC_US_009
        test('test_updateUserData_missing_params', async () => {
            const result = await userService.updateUserData({ firstName: 'A' });
            expect(result.errCode).toBe(2);
        });

        // TC_US_010
        test('test_updateUserData_user_not_found', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue(null) };
            const result = await userService.updateUserData({ id: 999, genderId: 'M' });
            expect(result.errCode).toBe(1);
            expect(result.errMessage).toBe('User not found!');
        });
    });

    // ===================== handleLogin =====================
    describe('handleLogin', () => {
        // TC_US_011
        test('test_handleLogin_success', async () => {
            db.User = {
                findOne: jest.fn()
                    .mockResolvedValueOnce({ id: 1 })  // checkUserEmail
                    .mockResolvedValueOnce({ id: 1, email: 'a@b.com', password: 'hash', roleId: 'R1', firstName: 'A', lastName: 'B' })
            };
            bcrypt.compareSync.mockReturnValue(true);
            const result = await userService.handleLogin({ email: 'a@b.com', password: '123' });
            expect(result.errCode).toBe(0);
            expect(result.accessToken).toBeDefined();
        });

        // TC_US_012
        test('test_handleLogin_missing_params', async () => {
            const result = await userService.handleLogin({ email: '' });
            expect(result.errCode).toBe(4);
        });

        // TC_US_013
        test('test_handleLogin_wrong_password', async () => {
            db.User = {
                findOne: jest.fn()
                    .mockResolvedValueOnce({ id: 1 })
                    .mockResolvedValueOnce({ id: 1, email: 'a@b.com', password: 'hash', roleId: 'R1', firstName: 'A', lastName: 'B' })
            };
            bcrypt.compareSync.mockReturnValue(false);
            const result = await userService.handleLogin({ email: 'a@b.com', password: 'wrong' });
            expect(result.errCode).toBe(3);
        });

        // TC_US_014
        test('test_handleLogin_email_not_exist', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue(null) };
            const result = await userService.handleLogin({ email: 'notexist@a.com', password: '123' });
            expect(result.errCode).toBe(1);
        });
    });

    // ===================== handleChangePassword =====================
    describe('handleChangePassword', () => {
        // TC_US_015
        test('test_handleChangePassword_success', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ password: 'hash', save: jest.fn() }) };
            bcrypt.compareSync.mockReturnValue(true);
            bcrypt.hashSync.mockReturnValue('newhash');
            const result = await userService.handleChangePassword({ id: 1, password: 'new', oldpassword: 'old' });
            expect(result.errCode).toBe(0);
        });

        // TC_US_016
        test('test_handleChangePassword_missing_params', async () => {
            const result = await userService.handleChangePassword({ id: 1 });
            expect(result.errCode).toBe(1);
        });

        // TC_US_017
        test('test_handleChangePassword_wrong_old_password', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ password: 'hash' }) };
            bcrypt.compareSync.mockReturnValue(false);
            const result = await userService.handleChangePassword({ id: 1, password: 'new', oldpassword: 'wrong' });
            expect(result.errCode).toBe(2);
        });
    });

    // ===================== getDetailUserById =====================
    describe('getDetailUserById', () => {
        // TC_US_018
        test('test_getDetailUserById_success', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 1, image: null }) };
            const result = await userService.getDetailUserById(1);
            expect(result.errCode).toBe(0);
            expect(result.data).toBeDefined();
        });

        // TC_US_019
        test('test_getDetailUserById_missing_id', async () => {
            const result = await userService.getDetailUserById(null);
            expect(result.errCode).toBe(1);
        });
    });

    // ===================== handleVerifyEmailUser =====================
    describe('handleVerifyEmailUser', () => {
        // TC_US_020
        test('test_handleVerifyEmailUser_success', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ isActiveEmail: 0, usertoken: 'tok', save: jest.fn() }) };
            const result = await userService.handleVerifyEmailUser({ id: 1, token: 'tok' });
            expect(result.errCode).toBe(0);
        });

        // TC_US_021
        test('test_handleVerifyEmailUser_missing_params', async () => {
            const result = await userService.handleVerifyEmailUser({ id: 1 });
            expect(result.errCode).toBe(1);
        });

        // TC_US_022
        test('test_handleVerifyEmailUser_user_not_found', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue(null) };
            const result = await userService.handleVerifyEmailUser({ id: 999, token: 'bad' });
            expect(result.errCode).toBe(2);
        });
    });

    // ===================== handleSendEmailForgotPassword =====================
    describe('handleSendEmailForgotPassword', () => {
        // TC_US_023
        test('test_handleSendEmailForgotPassword_success', async () => {
            db.User = {
                findOne: jest.fn()
                    .mockResolvedValueOnce({ id: 1 })  // checkUserEmail
                    .mockResolvedValueOnce({ id: 1, firstName: 'A', lastName: 'B', email: 'a@b.com', usertoken: '', save: jest.fn() })
            };
            emailService.sendSimpleEmail.mockResolvedValue();
            const result = await userService.handleSendEmailForgotPassword('a@b.com');
            expect(result.errCode).toBe(0);
        });

        // TC_US_024
        test('test_handleSendEmailForgotPassword_missing_email', async () => {
            const result = await userService.handleSendEmailForgotPassword(null);
            expect(result.errCode).toBe(1);
        });

        // TC_US_025
        test('test_handleSendEmailForgotPassword_email_not_exist', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue(null) };
            const result = await userService.handleSendEmailForgotPassword('notexist@a.com');
            expect(result.errCode).toBe(2);
        });
    });

    // ===================== handleForgotPassword =====================
    describe('handleForgotPassword', () => {
        // TC_US_026
        test('test_handleForgotPassword_success', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ save: jest.fn() }) };
            bcrypt.hashSync.mockReturnValue('newhash');
            const result = await userService.handleForgotPassword({ id: 1, token: 'tok', password: 'new' });
            expect(result.errCode).toBe(0);
        });

        // TC_US_027
        test('test_handleForgotPassword_missing_params', async () => {
            const result = await userService.handleForgotPassword({ id: 1 });
            expect(result.errCode).toBe(1);
        });
    });

    // ===================== checkPhonenumberEmail =====================
    describe('checkPhonenumberEmail', () => {
        // TC_US_028
        test('test_checkPhonenumberEmail_valid', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue(null) };
            const result = await userService.checkPhonenumberEmail({ phonenumber: '012', email: 'a@b.com' });
            expect(result.isCheck).toBe(false);
        });

        // TC_US_029
        test('test_checkPhonenumberEmail_phone_exists', async () => {
            db.User = { findOne: jest.fn().mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce(null) };
            const result = await userService.checkPhonenumberEmail({ phonenumber: '012', email: 'a@b.com' });
            expect(result.isCheck).toBe(true);
        });
    });
});
