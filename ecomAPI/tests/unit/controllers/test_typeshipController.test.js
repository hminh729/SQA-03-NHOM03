// Unit tests for typeshipController.js
const typeshipController = require('../../../src/controllers/typeshipController');
const typeshipService = require('../../../src/services/typeshipService');

jest.mock('../../../src/services/typeshipService');

describe('TypeshipController', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {}, query: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    });

    // ===================== createNewTypeShip =====================
    describe('createNewTypeShip', () => {
        // TC_TSC_001
        test('test_createNewTypeShip_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { type: 'Express', price: 30000 };
            typeshipService.createNewTypeShip.mockResolvedValue(mockResult);
            await typeshipController.createNewTypeShip(req, res);
            expect(typeshipService.createNewTypeShip).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_TSC_002
        test('test_createNewTypeShip_error', async () => {
            typeshipService.createNewTypeShip.mockRejectedValue(new Error('fail'));
            await typeshipController.createNewTypeShip(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getDetailTypeshipById =====================
    describe('getDetailTypeshipById', () => {
        // TC_TSC_003
        test('test_getDetailTypeshipById_success', async () => {
            const mockResult = { errCode: 0, data: { id: 1, type: 'Express' } };
            req.query = { id: 1 };
            typeshipService.getDetailTypeshipById.mockResolvedValue(mockResult);
            await typeshipController.getDetailTypeshipById(req, res);
            expect(typeshipService.getDetailTypeshipById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_TSC_004
        test('test_getDetailTypeshipById_error', async () => {
            req.query = { id: 999 };
            typeshipService.getDetailTypeshipById.mockRejectedValue(new Error('fail'));
            await typeshipController.getDetailTypeshipById(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getAllTypeship =====================
    describe('getAllTypeship', () => {
        // TC_TSC_005
        test('test_getAllTypeship_success', async () => {
            const mockResult = { errCode: 0, data: [{ id: 1 }, { id: 2 }] };
            req.query = { limit: 10, offset: 0 };
            typeshipService.getAllTypeship.mockResolvedValue(mockResult);
            await typeshipController.getAllTypeship(req, res);
            expect(typeshipService.getAllTypeship).toHaveBeenCalledWith(req.query);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_TSC_006
        test('test_getAllTypeship_error', async () => {
            typeshipService.getAllTypeship.mockRejectedValue(new Error('fail'));
            await typeshipController.getAllTypeship(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== updateTypeship =====================
    describe('updateTypeship', () => {
        // TC_TSC_007
        test('test_updateTypeship_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { id: 1, type: 'Express Plus', price: 35000 };
            typeshipService.updateTypeship.mockResolvedValue(mockResult);
            await typeshipController.updateTypeship(req, res);
            expect(typeshipService.updateTypeship).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_TSC_008
        test('test_updateTypeship_error', async () => {
            typeshipService.updateTypeship.mockRejectedValue(new Error('fail'));
            await typeshipController.updateTypeship(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== deleteTypeship =====================
    describe('deleteTypeship', () => {
        // TC_TSC_009
        test('test_deleteTypeship_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { id: 1 };
            typeshipService.deleteTypeship.mockResolvedValue(mockResult);
            await typeshipController.deleteTypeship(req, res);
            expect(typeshipService.deleteTypeship).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_TSC_010
        test('test_deleteTypeship_error', async () => {
            typeshipService.deleteTypeship.mockRejectedValue(new Error('fail'));
            await typeshipController.deleteTypeship(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });
});
