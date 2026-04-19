// Unit tests for typeshipController.js
const typeshipController = require('../src/controllers/typeshipController');
const typeshipService = require('../src/services/typeshipService');

jest.mock('../src/services/typeshipService');

describe('TypeshipController Tests', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    jest.clearAllMocks();

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

  describe('createNewTypeShip', () => {
    test('TC_TYPESHIP_001: Should create new typeship successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Typeship created successfully'
      };

      mockRequest.body = {
        type: 'Express',
        price: 30000
      };

      typeshipService.createNewTypeShip.mockResolvedValue(mockData);

      await typeshipController.createNewTypeShip(mockRequest, mockResponse);

      expect(typeshipService.createNewTypeShip).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_TYPESHIP_002: Should handle error when creating typeship', async () => {
      mockRequest.body = { type: '' };

      typeshipService.createNewTypeShip.mockRejectedValue(new Error('Create failed'));

      await typeshipController.createNewTypeShip(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  describe('getDetailTypeshipById', () => {
    test('TC_TYPESHIP_003: Should get typeship detail by ID successfully', async () => {
      const mockData = {
        errCode: 0,
        data: {
          id: 1,
          type: 'Express',
          price: 30000
        }
      };

      mockRequest.query = { id: 1 };

      typeshipService.getDetailTypeshipById.mockResolvedValue(mockData);

      await typeshipController.getDetailTypeshipById(mockRequest, mockResponse);

      expect(typeshipService.getDetailTypeshipById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_TYPESHIP_004: Should handle error when getting typeship detail', async () => {
      mockRequest.query = { id: 999 };

      typeshipService.getDetailTypeshipById.mockRejectedValue(new Error('Not found'));

      await typeshipController.getDetailTypeshipById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  describe('getAllTypeship', () => {
    test('TC_TYPESHIP_005: Should get all typeships successfully', async () => {
      const mockData = {
        errCode: 0,
        data: [
          { id: 1, type: 'Express', price: 30000 },
          { id: 2, type: 'Standard', price: 20000 }
        ]
      };

      mockRequest.query = { limit: 10, offset: 0 };

      typeshipService.getAllTypeship.mockResolvedValue(mockData);

      await typeshipController.getAllTypeship(mockRequest, mockResponse);

      expect(typeshipService.getAllTypeship).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_TYPESHIP_006: Should handle error when getting all typeships', async () => {
      mockRequest.query = {};

      typeshipService.getAllTypeship.mockRejectedValue(new Error('Database error'));

      await typeshipController.getAllTypeship(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  describe('updateTypeship', () => {
    test('TC_TYPESHIP_007: Should update typeship successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Typeship updated successfully'
      };

      mockRequest.body = {
        id: 1,
        type: 'Express Plus',
        price: 35000
      };

      typeshipService.updateTypeship.mockResolvedValue(mockData);

      await typeshipController.updateTypeship(mockRequest, mockResponse);

      expect(typeshipService.updateTypeship).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_TYPESHIP_008: Should handle error when updating typeship', async () => {
      mockRequest.body = { id: 999 };

      typeshipService.updateTypeship.mockRejectedValue(new Error('Update failed'));

      await typeshipController.updateTypeship(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  describe('deleteTypeship', () => {
    test('TC_TYPESHIP_009: Should delete typeship successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Typeship deleted successfully'
      };

      mockRequest.body = { id: 1 };

      typeshipService.deleteTypeship.mockResolvedValue(mockData);

      await typeshipController.deleteTypeship(mockRequest, mockResponse);

      expect(typeshipService.deleteTypeship).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_TYPESHIP_010: Should handle error when deleting typeship', async () => {
      mockRequest.body = { id: 999 };

      typeshipService.deleteTypeship.mockRejectedValue(new Error('Delete failed'));

      await typeshipController.deleteTypeship(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });
});

