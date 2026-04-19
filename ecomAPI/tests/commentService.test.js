// Unit tests for commentService.js
const commentService = require('../src/services/commentService');
const db = require('../src/models/index');

// Mock the database
jest.mock('../src/models/index');

describe('CommentService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== REVIEW SẢN PHẨM ====================
  
  describe('createNewReview', () => {
    test('TC_COMMENT_001: Should create new review successfully', async () => {
      const mockData = {
        content: 'Great product!',
        productId: 1,
        userId: 1,
        star: 5,
        image: null
      };

      db.Comment = {
        create: jest.fn().mockResolvedValue({})
      };

      const result = await commentService.createNewReview(mockData);

      expect(db.Comment.create).toHaveBeenCalledWith({
        content: mockData.content,
        productId: mockData.productId,
        userId: mockData.userId,
        star: mockData.star,
        image: null
      });
      expect(result.errCode).toBe(0);
      expect(result.errMessage).toBe('ok');
    });

    test('TC_COMMENT_002: Should handle missing required parameters', async () => {
      const mockData = {
        content: '',
        productId: 1
      };

      const result = await commentService.createNewReview(mockData);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('getAllReviewByProductId', () => {
    test('TC_COMMENT_003: Should get all reviews by product ID successfully', async () => {
      const mockReviews = [
        {
          id: 1,
          content: 'Great!',
          productId: 1,
          userId: 1,
          star: 5,
          image: null
        }
      ];

      db.Comment = {
        findAll: jest.fn()
          .mockResolvedValueOnce(mockReviews)
          .mockResolvedValue([])
      };

      db.User = {
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          firstName: 'John',
          image: null
        })
      };

      const result = await commentService.getAllReviewByProductId(1);

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_COMMENT_004: Should handle missing product ID', async () => {
      const result = await commentService.getAllReviewByProductId(null);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('ReplyReview', () => {
    test('TC_COMMENT_005: Should reply to review successfully', async () => {
      const mockData = {
        content: 'Thank you!',
        productId: 1,
        userId: 2,
        parentId: 1
      };

      db.Comment = {
        create: jest.fn().mockResolvedValue({})
      };

      const result = await commentService.ReplyReview(mockData);

      expect(db.Comment.create).toHaveBeenCalledWith({
        content: mockData.content,
        productId: mockData.productId,
        userId: mockData.userId,
        parentId: mockData.parentId
      });
      expect(result.errCode).toBe(0);
    });

    test('TC_COMMENT_006: Should handle missing required parameters', async () => {
      const mockData = {
        content: 'Thank you!',
        productId: 1
      };

      const result = await commentService.ReplyReview(mockData);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('deleteReview', () => {
    test('TC_COMMENT_007: Should delete review successfully', async () => {
      db.Comment = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        destroy: jest.fn().mockResolvedValue(1)
      };

      const result = await commentService.deleteReview({ id: 1 });

      expect(db.Comment.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.errCode).toBe(0);
    });

    test('TC_COMMENT_008: Should handle review not found', async () => {
      db.Comment = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      const result = await commentService.deleteReview({ id: 999 });

      expect(result.errCode).toBe(2);
      expect(result.errMessage).toBe('Review not found !');
    });
  });

  // ==================== COMMENT BLOG ====================

  describe('createNewComment', () => {
    test('TC_COMMENT_009: Should create new blog comment successfully', async () => {
      const mockData = {
        content: 'Nice article!',
        blogId: 1,
        userId: 1,
        image: null
      };

      db.Comment = {
        create: jest.fn().mockResolvedValue({})
      };

      const result = await commentService.createNewComment(mockData);

      expect(db.Comment.create).toHaveBeenCalledWith({
        content: mockData.content,
        blogId: mockData.blogId,
        userId: mockData.userId,
        image: null
      });
      expect(result.errCode).toBe(0);
    });

    test('TC_COMMENT_010: Should handle missing required parameters', async () => {
      const mockData = {
        content: '',
        blogId: 1
      };

      const result = await commentService.createNewComment(mockData);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('getAllCommentByBlogId', () => {
    test('TC_COMMENT_011: Should get all comments by blog ID successfully', async () => {
      const mockComments = [
        {
          id: 1,
          content: 'Nice!',
          blogId: 1,
          userId: 1,
          image: null
        }
      ];

      db.Comment = {
        findAll: jest.fn()
          .mockResolvedValueOnce(mockComments)
          .mockResolvedValue([])
      };

      db.User = {
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          firstName: 'John',
          image: null
        })
      };

      const result = await commentService.getAllCommentByBlogId(1);

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_COMMENT_012: Should handle missing blog ID', async () => {
      const result = await commentService.getAllCommentByBlogId(null);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('ReplyComment', () => {
    test('TC_COMMENT_013: Should reply to blog comment successfully', async () => {
      const mockData = {
        content: 'Thank you!',
        blogId: 1,
        userId: 2,
        parentId: 1
      };

      db.Comment = {
        create: jest.fn().mockResolvedValue({})
      };

      const result = await commentService.ReplyComment(mockData);

      expect(db.Comment.create).toHaveBeenCalledWith({
        content: mockData.content,
        blogId: mockData.blogId,
        userId: mockData.userId,
        parentId: mockData.parentId
      });
      expect(result.errCode).toBe(0);
    });

    test('TC_COMMENT_014: Should handle missing required parameters', async () => {
      const mockData = {
        content: 'Thank you!',
        blogId: 1
      };

      const result = await commentService.ReplyComment(mockData);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('deleteComment', () => {
    test('TC_COMMENT_015: Should delete blog comment successfully', async () => {
      db.Comment = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        destroy: jest.fn().mockResolvedValue(1)
      };

      const result = await commentService.deleteComment({ id: 1 });

      expect(db.Comment.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.errCode).toBe(0);
    });

    test('TC_COMMENT_016: Should handle comment not found', async () => {
      db.Comment = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      const result = await commentService.deleteComment({ id: 999 });

      expect(result.errCode).toBe(2);
      expect(result.errMessage).toBe('Comment not found !');
    });
  });
});

