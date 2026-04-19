// Unit tests for userController.js
const userController = require('../src/controllers/userController');
const userService = require('../src/services/userService');

// Mock the userService module
jest.mock('../src/services/userService');

describe('UserController Tests', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create mock request and response objects
    mockRequest = {
      body: {},
      query: {},
      params: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  // TC_USER_001: Test handleCreateNewUser - Success
  describe('handleCreateNewUser', () => {
    test('TC_USER_001: Should create new user successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'User created successfully'
      };
      
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
        lastName: 'Test'
      };

      userService.handleCreateNewUser.mockResolvedValue(mockData);

      await userController.handleCreateNewUser(mockRequest, mockResponse);

      expect(userService.handleCreateNewUser).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_002: Should handle error when creating user', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      userService.handleCreateNewUser.mockRejectedValue(new Error('Database error'));

      await userController.handleCreateNewUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_003-004: Test handleUpdateUser
  describe('handleUpdateUser', () => {
    test('TC_USER_003: Should update user successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'User updated successfully'
      };
      
      mockRequest.body = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe'
      };

      userService.updateUserData.mockResolvedValue(mockData);

      await userController.handleUpdateUser(mockRequest, mockResponse);

      expect(userService.updateUserData).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_004: Should handle error when updating user', async () => {
      mockRequest.body = { id: 1 };

      userService.updateUserData.mockRejectedValue(new Error('Update failed'));

      await userController.handleUpdateUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_005-006: Test handleDeleteUser
  describe('handleDeleteUser', () => {
    test('TC_USER_005: Should delete user successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'User deleted successfully'
      };
      
      mockRequest.body = { id: 1 };

      userService.deleteUser.mockResolvedValue(mockData);

      await userController.handleDeleteUser(mockRequest, mockResponse);

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_006: Should handle error when deleting user', async () => {
      mockRequest.body = { id: 1 };

      userService.deleteUser.mockRejectedValue(new Error('Delete failed'));

      await userController.handleDeleteUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_007-008: Test handleLogin
  describe('handleLogin', () => {
    test('TC_USER_007: Should login successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Login successful',
        user: { id: 1, email: 'test@example.com' },
        token: 'jwt_token_123'
      };
      
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      userService.handleLogin.mockResolvedValue(mockData);

      await userController.handleLogin(mockRequest, mockResponse);

      expect(userService.handleLogin).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_008: Should handle login error', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrong_password'
      };

      userService.handleLogin.mockRejectedValue(new Error('Authentication failed'));

      await userController.handleLogin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_009-010: Test handleChangePassword
  describe('handleChangePassword', () => {
    test('TC_USER_009: Should change password successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Password changed successfully'
      };
      
      mockRequest.body = {
        userId: 1,
        oldPassword: 'oldpass123',
        newPassword: 'newpass123'
      };

      userService.handleChangePassword.mockResolvedValue(mockData);

      await userController.handleChangePassword(mockRequest, mockResponse);

      expect(userService.handleChangePassword).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_010: Should handle change password error', async () => {
      mockRequest.body = {
        userId: 1,
        oldPassword: 'wrongpass',
        newPassword: 'newpass123'
      };

      userService.handleChangePassword.mockRejectedValue(new Error('Password change failed'));

      await userController.handleChangePassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_011-012: Test getAllUser
  describe('getAllUser', () => {
    test('TC_USER_011: Should get all users successfully', async () => {
      const mockData = {
        errCode: 0,
        data: [
          { id: 1, email: 'user1@example.com' },
          { id: 2, email: 'user2@example.com' }
        ]
      };
      
      mockRequest.query = {
        limit: 10,
        offset: 0
      };

      userService.getAllUser.mockResolvedValue(mockData);

      await userController.getAllUser(mockRequest, mockResponse);

      expect(userService.getAllUser).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_012: Should handle error when getting all users', async () => {
      mockRequest.query = {};

      userService.getAllUser.mockRejectedValue(new Error('Database error'));

      await userController.getAllUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_013-014: Test getDetailUserById
  describe('getDetailUserById', () => {
    test('TC_USER_013: Should get user detail by ID successfully', async () => {
      const mockData = {
        errCode: 0,
        data: { 
          id: 1, 
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      };
      
      mockRequest.query = { id: 1 };

      userService.getDetailUserById.mockResolvedValue(mockData);

      await userController.getDetailUserById(mockRequest, mockResponse);

      expect(userService.getDetailUserById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_014: Should handle error when getting user detail by ID', async () => {
      mockRequest.query = { id: 999 };

      userService.getDetailUserById.mockRejectedValue(new Error('User not found'));

      await userController.getDetailUserById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_015-016: Test getDetailUserByEmail
  describe('getDetailUserByEmail', () => {
    test('TC_USER_015: Should get user detail by email successfully', async () => {
      const mockData = {
        errCode: 0,
        data: { 
          id: 1, 
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      };
      
      mockRequest.query = { email: 'test@example.com' };

      userService.getDetailUserByEmail.mockResolvedValue(mockData);

      await userController.getDetailUserByEmail(mockRequest, mockResponse);

      expect(userService.getDetailUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_016: Should handle error when getting user detail by email', async () => {
      mockRequest.query = { email: 'notfound@example.com' };

      userService.getDetailUserByEmail.mockRejectedValue(new Error('User not found'));

      await userController.getDetailUserByEmail(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_017-018: Test handleSendVerifyEmailUser
  describe('handleSendVerifyEmailUser', () => {
    test('TC_USER_017: Should send verify email successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Verification email sent'
      };
      
      mockRequest.body = {
        email: 'test@example.com',
        userId: 1
      };

      userService.handleSendVerifyEmailUser.mockResolvedValue(mockData);

      await userController.handleSendVerifyEmailUser(mockRequest, mockResponse);

      expect(userService.handleSendVerifyEmailUser).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_018: Should handle error when sending verify email', async () => {
      mockRequest.body = { email: 'test@example.com' };

      userService.handleSendVerifyEmailUser.mockRejectedValue(new Error('Email service error'));

      await userController.handleSendVerifyEmailUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_019-020: Test handleVerifyEmailUser
  describe('handleVerifyEmailUser', () => {
    test('TC_USER_019: Should verify email successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Email verified successfully'
      };
      
      mockRequest.body = {
        token: 'verification_token',
        userId: 1
      };

      userService.handleVerifyEmailUser.mockResolvedValue(mockData);

      await userController.handleVerifyEmailUser(mockRequest, mockResponse);

      expect(userService.handleVerifyEmailUser).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_020: Should handle error when verifying email', async () => {
      mockRequest.body = {
        token: 'invalid_token',
        userId: 1
      };

      userService.handleVerifyEmailUser.mockRejectedValue(new Error('Invalid token'));

      await userController.handleVerifyEmailUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_021-022: Test handleSendEmailForgotPassword
  describe('handleSendEmailForgotPassword', () => {
    test('TC_USER_021: Should send forgot password email successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Password reset email sent'
      };
      
      mockRequest.body = { email: 'test@example.com' };

      userService.handleSendEmailForgotPassword.mockResolvedValue(mockData);

      await userController.handleSendEmailForgotPassword(mockRequest, mockResponse);

      expect(userService.handleSendEmailForgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_022: Should handle error when sending forgot password email', async () => {
      mockRequest.body = { email: 'notfound@example.com' };

      userService.handleSendEmailForgotPassword.mockRejectedValue(new Error('User not found'));

      await userController.handleSendEmailForgotPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_023-024: Test handleForgotPassword
  describe('handleForgotPassword', () => {
    test('TC_USER_023: Should reset password successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Password reset successfully'
      };
      
      mockRequest.body = {
        token: 'reset_token',
        newPassword: 'newpassword123'
      };

      userService.handleForgotPassword.mockResolvedValue(mockData);

      await userController.handleForgotPassword(mockRequest, mockResponse);

      expect(userService.handleForgotPassword).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_024: Should handle error when resetting password', async () => {
      mockRequest.body = {
        token: 'invalid_token',
        newPassword: 'newpassword123'
      };

      userService.handleForgotPassword.mockRejectedValue(new Error('Invalid or expired token'));

      await userController.handleForgotPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_USER_025-026: Test checkPhonenumberEmail
  describe('checkPhonenumberEmail', () => {
    test('TC_USER_025: Should check phone number and email successfully', async () => {
      const mockData = {
        errCode: 0,
        isExist: false
      };
      
      mockRequest.query = {
        email: 'test@example.com',
        phonenumber: '1234567890'
      };

      userService.checkPhonenumberEmail.mockResolvedValue(mockData);

      await userController.checkPhonenumberEmail(mockRequest, mockResponse);

      expect(userService.checkPhonenumberEmail).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_USER_026: Should handle error when checking phone number and email', async () => {
      mockRequest.query = { email: 'test@example.com' };

      userService.checkPhonenumberEmail.mockRejectedValue(new Error('Database error'));

      await userController.checkPhonenumberEmail(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });
});

