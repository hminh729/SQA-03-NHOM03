// Unit tests for commentService.js
const commentService = require('../../../src/services/commentService');
const db = require('../../../src/models/index');

jest.mock('../../../src/models/index');

describe('CommentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ============ REVIEW SẢN PHẨM ============

    describe('createNewReview', () => {
        // TC_CS_001
        test('test_createNewReview_success', async () => {
            db.Comment = { create: jest.fn().mockResolvedValue({}) };
            const result = await commentService.createNewReview({
                content: 'Great!', productId: 1, userId: 1, star: 5
            });
            expect(result.errCode).toBe(0);
            expect(db.Comment.create).toHaveBeenCalledWith(expect.objectContaining({
                content: 'Great!', productId: 1, userId: 1, star: 5, image: null
            }));
        });

        // TC_CS_002
        test('test_createNewReview_missing_params', async () => {
            const result = await commentService.createNewReview({ content: '', productId: 1 });
            expect(result.errCode).toBe(1);
        });
    });

    describe('getAllReviewByProductId', () => {
        // TC_CS_003
        test('test_getAllReviewByProductId_success', async () => {
            db.Comment = { findAll: jest.fn().mockResolvedValue([]) };
            const result = await commentService.getAllReviewByProductId(1);
            expect(result.errCode).toBe(0);
            expect(result.data).toBeDefined();
        });

        // TC_CS_004
        test('test_getAllReviewByProductId_missing_id', async () => {
            const result = await commentService.getAllReviewByProductId(null);
            expect(result.errCode).toBe(1);
        });

        // TC_CS_005
        test('test_getAllReviewByProductId_with_data', async () => {
            const mockReview = { id: 1, content: 'Nice', productId: 1, userId: 1, star: 5, image: null };
            db.Comment = {
                findAll: jest.fn()
                    .mockResolvedValueOnce([mockReview])
                    .mockResolvedValue([])
            };
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 1, firstName: 'A', image: null }) };
            const result = await commentService.getAllReviewByProductId(1);
            expect(result.errCode).toBe(0);
            expect(result.data.length).toBe(1);
        });
    });

    describe('ReplyReview', () => {
        // TC_CS_006
        test('test_ReplyReview_success', async () => {
            db.Comment = { create: jest.fn().mockResolvedValue({}) };
            const result = await commentService.ReplyReview({
                content: 'Thanks', productId: 1, userId: 2, parentId: 1
            });
            expect(result.errCode).toBe(0);
        });

        // TC_CS_007
        test('test_ReplyReview_missing_params', async () => {
            const result = await commentService.ReplyReview({ content: 'Thanks', productId: 1 });
            expect(result.errCode).toBe(1);
        });
    });

    describe('deleteReview', () => {
        // TC_CS_008
        test('test_deleteReview_success', async () => {
            db.Comment = {
                findOne: jest.fn().mockResolvedValue({ id: 1 }),
                destroy: jest.fn().mockResolvedValue(1)
            };
            const result = await commentService.deleteReview({ id: 1 });
            expect(result.errCode).toBe(0);
        });

        // TC_CS_009
        test('test_deleteReview_not_found', async () => {
            db.Comment = { findOne: jest.fn().mockResolvedValue(null) };
            const result = await commentService.deleteReview({ id: 999 });
            expect(result.errCode).toBe(2);
        });

        // TC_CS_010
        test('test_deleteReview_missing_id', async () => {
            const result = await commentService.deleteReview({});
            expect(result.errCode).toBe(1);
        });
    });

    // ============ COMMENT BLOG ============

    describe('createNewComment', () => {
        // TC_CS_011
        test('test_createNewComment_success', async () => {
            db.Comment = { create: jest.fn().mockResolvedValue({}) };
            const result = await commentService.createNewComment({
                content: 'Nice article', blogId: 1, userId: 1
            });
            expect(result.errCode).toBe(0);
        });

        // TC_CS_012
        test('test_createNewComment_missing_params', async () => {
            const result = await commentService.createNewComment({ content: '', blogId: 1 });
            expect(result.errCode).toBe(1);
        });
    });

    describe('getAllCommentByBlogId', () => {
        // TC_CS_013
        test('test_getAllCommentByBlogId_success', async () => {
            db.Comment = { findAll: jest.fn().mockResolvedValue([]) };
            const result = await commentService.getAllCommentByBlogId(1);
            expect(result.errCode).toBe(0);
        });

        // TC_CS_014
        test('test_getAllCommentByBlogId_missing_id', async () => {
            const result = await commentService.getAllCommentByBlogId(null);
            expect(result.errCode).toBe(1);
        });
    });

    describe('ReplyComment', () => {
        // TC_CS_015
        test('test_ReplyComment_success', async () => {
            db.Comment = { create: jest.fn().mockResolvedValue({}) };
            const result = await commentService.ReplyComment({
                content: 'Reply', blogId: 1, userId: 2, parentId: 1
            });
            expect(result.errCode).toBe(0);
        });

        // TC_CS_016
        test('test_ReplyComment_missing_params', async () => {
            const result = await commentService.ReplyComment({ content: 'Reply', blogId: 1 });
            expect(result.errCode).toBe(1);
        });
    });

    describe('deleteComment', () => {
        // TC_CS_017
        test('test_deleteComment_success', async () => {
            db.Comment = {
                findOne: jest.fn().mockResolvedValue({ id: 1 }),
                destroy: jest.fn().mockResolvedValue(1)
            };
            const result = await commentService.deleteComment({ id: 1 });
            expect(result.errCode).toBe(0);
        });

        // TC_CS_018
        test('test_deleteComment_not_found', async () => {
            db.Comment = { findOne: jest.fn().mockResolvedValue(null) };
            const result = await commentService.deleteComment({ id: 999 });
            expect(result.errCode).toBe(2);
        });

        // TC_CS_019
        test('test_deleteComment_missing_id', async () => {
            const result = await commentService.deleteComment({});
            expect(result.errCode).toBe(1);
        });
    });
});
