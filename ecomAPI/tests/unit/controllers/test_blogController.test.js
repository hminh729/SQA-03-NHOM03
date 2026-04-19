// Unit tests for blogController.js
const blogController = require('../../../src/controllers/blogController');
const blogService = require('../../../src/services/blogService');

jest.mock('../../../src/services/blogService');

describe('BlogController', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {}, query: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    });

    // ===================== createNewBlog =====================
    describe('createNewBlog', () => {
        // TC_BC_001
        test('test_createNewBlog_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { title: 'Test', content: 'Content', subjectId: 1 };
            blogService.createNewBlog.mockResolvedValue(mockResult);
            await blogController.createNewBlog(req, res);
            expect(blogService.createNewBlog).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_BC_002
        test('test_createNewBlog_error', async () => {
            blogService.createNewBlog.mockRejectedValue(new Error('fail'));
            await blogController.createNewBlog(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getDetailBlogById =====================
    describe('getDetailBlogById', () => {
        // TC_BC_003
        test('test_getDetailBlogById_success', async () => {
            const mockResult = { errCode: 0, data: { id: 1, title: 'Blog' } };
            req.query = { id: 1 };
            blogService.getDetailBlogById.mockResolvedValue(mockResult);
            await blogController.getDetailBlogById(req, res);
            expect(blogService.getDetailBlogById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_BC_004
        test('test_getDetailBlogById_error', async () => {
            req.query = { id: 999 };
            blogService.getDetailBlogById.mockRejectedValue(new Error('fail'));
            await blogController.getDetailBlogById(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getAllBlog =====================
    describe('getAllBlog', () => {
        // TC_BC_005
        test('test_getAllBlog_success', async () => {
            const mockResult = { errCode: 0, data: [], count: 0 };
            req.query = { limit: 10, offset: 0 };
            blogService.getAllBlog.mockResolvedValue(mockResult);
            await blogController.getAllBlog(req, res);
            expect(blogService.getAllBlog).toHaveBeenCalledWith(req.query);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_BC_006
        test('test_getAllBlog_error', async () => {
            blogService.getAllBlog.mockRejectedValue(new Error('fail'));
            await blogController.getAllBlog(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== updateBlog =====================
    describe('updateBlog', () => {
        // TC_BC_007
        test('test_updateBlog_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { id: 1, title: 'Updated' };
            blogService.updateBlog.mockResolvedValue(mockResult);
            await blogController.updateBlog(req, res);
            expect(blogService.updateBlog).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_BC_008
        test('test_updateBlog_error', async () => {
            blogService.updateBlog.mockRejectedValue(new Error('fail'));
            await blogController.updateBlog(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== deleteBlog =====================
    describe('deleteBlog', () => {
        // TC_BC_009
        test('test_deleteBlog_success', async () => {
            const mockResult = { errCode: 0, errMessage: 'ok' };
            req.body = { id: 1 };
            blogService.deleteBlog.mockResolvedValue(mockResult);
            await blogController.deleteBlog(req, res);
            expect(blogService.deleteBlog).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_BC_010
        test('test_deleteBlog_error', async () => {
            blogService.deleteBlog.mockRejectedValue(new Error('fail'));
            await blogController.deleteBlog(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getFeatureBlog =====================
    describe('getFeatureBlog', () => {
        // TC_BC_011
        test('test_getFeatureBlog_success', async () => {
            const mockResult = { errCode: 0, data: [] };
            req.query = { limit: 5 };
            blogService.getFeatureBlog.mockResolvedValue(mockResult);
            await blogController.getFeatureBlog(req, res);
            expect(blogService.getFeatureBlog).toHaveBeenCalledWith(req.query);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_BC_012
        test('test_getFeatureBlog_error', async () => {
            blogService.getFeatureBlog.mockRejectedValue(new Error('fail'));
            await blogController.getFeatureBlog(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    // ===================== getNewBlog =====================
    describe('getNewBlog', () => {
        // TC_BC_013
        test('test_getNewBlog_success', async () => {
            const mockResult = { errCode: 0, data: [] };
            req.query = { limit: 5 };
            blogService.getNewBlog.mockResolvedValue(mockResult);
            await blogController.getNewBlog(req, res);
            expect(blogService.getNewBlog).toHaveBeenCalledWith(req.query);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_BC_014
        test('test_getNewBlog_error', async () => {
            blogService.getNewBlog.mockRejectedValue(new Error('fail'));
            await blogController.getNewBlog(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });
});
