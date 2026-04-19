// Unit tests for userController.js
const userController = require('../../../src/controllers/userController');
const userService = require('../../../src/services/userService');

jest.mock('../../../src/services/userService');

describe('UserController', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {}, query: {}, params: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    });

    // ===================== handleCreateNewUser =====================
    describe('handleCreateNewUser', () => {
        // TC_UC_001 - Tạo user thành công
        test('test_handleCreateNewUser_success', async () => {
            const mockResult = { errCode: 0, message: 'OK' };
            req.body = { email: 'test@example.com', password: '123456', lastName: 'Nguyen' };
            userService.handleCreateNewUser.mockResolvedValue(mockResult);
            await userController.handleCreateNewUser(req, res);
            expect(userService.handleCreateNewUser).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_002 - Tạo user lỗi server
        test('test_handleCreateNewUser_error', async () => {
            userService.handleCreateNewUser.mockRejectedValue(new Error('DB error'));
            await userController.handleCreateNewUser(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== handleUpdateUser =====================
    describe('handleUpdateUser', () => {
        // TC_UC_003
        test('test_handleUpdateUser_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'Update the user succeeds!' };
            req.body = { id: 1, firstName: 'John', lastName: 'Doe', genderId: 'M' };
            userService.updateUserData.mockResolvedValue(mockResult);
            await userController.handleUpdateUser(req, res);
            expect(userService.updateUserData).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_004
        test('test_handleUpdateUser_error', async () => {
            userService.updateUserData.mockRejectedValue(new Error('fail'));
            await userController.handleUpdateUser(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== handleDeleteUser =====================
    describe('handleDeleteUser', () => {
        // TC_UC_005
        test('test_handleDeleteUser_success', async () => {
            const mockResult = { errCode: 0, message: 'The user is deleted' };
            req.body = { id: 1 };
            userService.deleteUser.mockResolvedValue(mockResult);
            await userController.handleDeleteUser(req, res);
            expect(userService.deleteUser).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_006
        test('test_handleDeleteUser_error', async () => {
            req.body = { id: 1 };
            userService.deleteUser.mockRejectedValue(new Error('fail'));
            await userController.handleDeleteUser(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== handleLogin =====================
    describe('handleLogin', () => {
        // TC_UC_007
        test('test_handleLogin_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'Ok', user: { id: 1 }, accessToken: 'abc' };
            req.body = { email: 'test@example.com', password: '123456' };
            userService.handleLogin.mockResolvedValue(mockResult);
            await userController.handleLogin(req, res);
            expect(userService.handleLogin).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_008
        test('test_handleLogin_error', async () => {
            userService.handleLogin.mockRejectedValue(new Error('fail'));
            await userController.handleLogin(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== handleChangePassword =====================
    describe('handleChangePassword', () => {
        // TC_UC_009
        test('test_handleChangePassword_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { id: 1, password: 'newpass', oldpassword: 'oldpass' };
            userService.handleChangePassword.mockResolvedValue(mockResult);
            await userController.handleChangePassword(req, res);
            expect(userService.handleChangePassword).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_010
        test('test_handleChangePassword_error', async () => {
            userService.handleChangePassword.mockRejectedValue(new Error('fail'));
            await userController.handleChangePassword(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getAllUser =====================
    describe('getAllUser', () => {
        // TC_UC_011
        test('test_getAllUser_success', async () => {
            const mockResult = { errCode: 0, data: [{ id: 1 }], count: 1 };
            req.query = { limit: 10, offset: 0, keyword: '' };
            userService.getAllUser.mockResolvedValue(mockResult);
            await userController.getAllUser(req, res);
            expect(userService.getAllUser).toHaveBeenCalledWith(req.query);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_012
        test('test_getAllUser_error', async () => {
            userService.getAllUser.mockRejectedValue(new Error('fail'));
            await userController.getAllUser(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getDetailUserById =====================
    describe('getDetailUserById', () => {
        // TC_UC_013
        test('test_getDetailUserById_success', async () => {
            const mockResult = { errCode: 0, data: { id: 1, firstName: 'John' } };
            req.query = { id: 1 };
            userService.getDetailUserById.mockResolvedValue(mockResult);
            await userController.getDetailUserById(req, res);
            expect(userService.getDetailUserById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_014
        test('test_getDetailUserById_error', async () => {
            req.query = { id: 1 };
            userService.getDetailUserById.mockRejectedValue(new Error('fail'));
            await userController.getDetailUserById(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getDetailUserByEmail =====================
    describe('getDetailUserByEmail', () => {
        // TC_UC_015
        test('test_getDetailUserByEmail_success', async () => {
            const mockResult = { errCode: 0, data: { id: 1 } };
            req.query = { email: 'test@example.com' };
            userService.getDetailUserByEmail.mockResolvedValue(mockResult);
            await userController.getDetailUserByEmail(req, res);
            expect(userService.getDetailUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_016
        test('test_getDetailUserByEmail_error', async () => {
            req.query = { email: 'test@example.com' };
            userService.getDetailUserByEmail.mockRejectedValue(new Error('fail'));
            await userController.getDetailUserByEmail(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== handleSendVerifyEmailUser =====================
    describe('handleSendVerifyEmailUser', () => {
        // TC_UC_017
        test('test_handleSendVerifyEmailUser_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { id: 1 };
            userService.handleSendVerifyEmailUser.mockResolvedValue(mockResult);
            await userController.handleSendVerifyEmailUser(req, res);
            expect(userService.handleSendVerifyEmailUser).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_018
        test('test_handleSendVerifyEmailUser_error', async () => {
            userService.handleSendVerifyEmailUser.mockRejectedValue(new Error('fail'));
            await userController.handleSendVerifyEmailUser(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== handleVerifyEmailUser =====================
    describe('handleVerifyEmailUser', () => {
        // TC_UC_019
        test('test_handleVerifyEmailUser_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { id: 1, token: 'valid-token' };
            userService.handleVerifyEmailUser.mockResolvedValue(mockResult);
            await userController.handleVerifyEmailUser(req, res);
            expect(userService.handleVerifyEmailUser).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_020
        test('test_handleVerifyEmailUser_error', async () => {
            userService.handleVerifyEmailUser.mockRejectedValue(new Error('fail'));
            await userController.handleVerifyEmailUser(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== handleSendEmailForgotPassword =====================
    describe('handleSendEmailForgotPassword', () => {
        // TC_UC_021
        test('test_handleSendEmailForgotPassword_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { email: 'test@example.com' };
            userService.handleSendEmailForgotPassword.mockResolvedValue(mockResult);
            await userController.handleSendEmailForgotPassword(req, res);
            expect(userService.handleSendEmailForgotPassword).toHaveBeenCalledWith('test@example.com');
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_022
        test('test_handleSendEmailForgotPassword_error', async () => {
            req.body = { email: 'test@example.com' };
            userService.handleSendEmailForgotPassword.mockRejectedValue(new Error('fail'));
            await userController.handleSendEmailForgotPassword(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== handleForgotPassword =====================
    describe('handleForgotPassword', () => {
        // TC_UC_023
        test('test_handleForgotPassword_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { id: 1, token: 'valid-token', password: 'newpass' };
            userService.handleForgotPassword.mockResolvedValue(mockResult);
            await userController.handleForgotPassword(req, res);
            expect(userService.handleForgotPassword).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_024
        test('test_handleForgotPassword_error', async () => {
            userService.handleForgotPassword.mockRejectedValue(new Error('fail'));
            await userController.handleForgotPassword(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== checkPhonenumberEmail =====================
    describe('checkPhonenumberEmail', () => {
        // TC_UC_025
        test('test_checkPhonenumberEmail_success', async () => {
            const mockResult = { isCheck: false, errMessage: 'Hợp lệ' };
            req.query = { phonenumber: '0123456789', email: 'new@example.com' };
            userService.checkPhonenumberEmail.mockResolvedValue(mockResult);
            await userController.checkPhonenumberEmail(req, res);
            expect(userService.checkPhonenumberEmail).toHaveBeenCalledWith(req.query);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_UC_026
        test('test_checkPhonenumberEmail_error', async () => {
            userService.checkPhonenumberEmail.mockRejectedValue(new Error('fail'));
            await userController.checkPhonenumberEmail(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });
});
