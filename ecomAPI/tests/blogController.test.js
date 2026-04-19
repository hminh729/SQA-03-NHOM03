// Unit tests for blogController.js
const blogController = require('../src/controllers/blogController');
const blogService = require('../src/services/blogService');

// Mock the blogService module
jest.mock('../src/services/blogService');

describe('BlogController Tests', () => {
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

  // TC_BLOG_001-002: Test createNewBlog
  describe('createNewBlog', () => {
    test('TC_BLOG_001: Should create new blog successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Blog created successfully',
        blog: {
          id: 1,
          title: 'Test Blog',
          content: 'Test Content'
        }
      };
      
      mockRequest.body = {
        title: 'Test Blog',
        content: 'Test Content',
        authorId: 1
      };

      blogService.createNewBlog.mockResolvedValue(mockData);

      await blogController.createNewBlog(mockRequest, mockResponse);

      expect(blogService.createNewBlog).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_BLOG_002: Should handle error when creating blog', async () => {
      mockRequest.body = {
        title: '',
        content: ''
      };

      blogService.createNewBlog.mockRejectedValue(new Error('Missing required fields'));

      await blogController.createNewBlog(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_BLOG_003-004: Test getDetailBlogById
  describe('getDetailBlogById', () => {
    test('TC_BLOG_003: Should get blog detail by ID successfully', async () => {
      const mockData = {
        errCode: 0,
        data: {
          id: 1,
          title: 'Test Blog',
          content: 'Test Content',
          author: 'John Doe'
        }
      };
      
      mockRequest.query = { id: 1 };

      blogService.getDetailBlogById.mockResolvedValue(mockData);

      await blogController.getDetailBlogById(mockRequest, mockResponse);

      expect(blogService.getDetailBlogById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_BLOG_004: Should handle error when blog ID not found', async () => {
      mockRequest.query = { id: 999 };

      blogService.getDetailBlogById.mockRejectedValue(new Error('Blog not found'));

      await blogController.getDetailBlogById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_BLOG_005-006: Test getAllBlog
  describe('getAllBlog', () => {
    test('TC_BLOG_005: Should get all blogs successfully', async () => {
      const mockData = {
        errCode: 0,
        data: [
          { id: 1, title: 'Blog 1', content: 'Content 1' },
          { id: 2, title: 'Blog 2', content: 'Content 2' }
        ],
        count: 2
      };
      
      mockRequest.query = {
        limit: 10,
        offset: 0
      };

      blogService.getAllBlog.mockResolvedValue(mockData);

      await blogController.getAllBlog(mockRequest, mockResponse);

      expect(blogService.getAllBlog).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_BLOG_006: Should handle error when getting all blogs', async () => {
      mockRequest.query = {};

      blogService.getAllBlog.mockRejectedValue(new Error('Database error'));

      await blogController.getAllBlog(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_BLOG_007-008: Test updateBlog
  describe('updateBlog', () => {
    test('TC_BLOG_007: Should update blog successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Blog updated successfully'
      };
      
      mockRequest.body = {
        id: 1,
        title: 'Updated Title',
        content: 'Updated Content'
      };

      blogService.updateBlog.mockResolvedValue(mockData);

      await blogController.updateBlog(mockRequest, mockResponse);

      expect(blogService.updateBlog).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_BLOG_008: Should handle error when updating blog', async () => {
      mockRequest.body = { id: 999 };

      blogService.updateBlog.mockRejectedValue(new Error('Blog not found'));

      await blogController.updateBlog(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_BLOG_009-010: Test deleteBlog
  describe('deleteBlog', () => {
    test('TC_BLOG_009: Should delete blog successfully', async () => {
      const mockData = {
        errCode: 0,
        message: 'Blog deleted successfully'
      };
      
      mockRequest.body = { id: 1 };

      blogService.deleteBlog.mockResolvedValue(mockData);

      await blogController.deleteBlog(mockRequest, mockResponse);

      expect(blogService.deleteBlog).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_BLOG_010: Should handle error when deleting blog', async () => {
      mockRequest.body = { id: 999 };

      blogService.deleteBlog.mockRejectedValue(new Error('Blog not found'));

      await blogController.deleteBlog(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_BLOG_011-012: Test getFeatureBlog
  describe('getFeatureBlog', () => {
    test('TC_BLOG_011: Should get feature blogs successfully', async () => {
      const mockData = {
        errCode: 0,
        data: [
          { id: 1, title: 'Featured Blog 1', isFeatured: true },
          { id: 2, title: 'Featured Blog 2', isFeatured: true }
        ]
      };
      
      mockRequest.query = { limit: 5 };

      blogService.getFeatureBlog.mockResolvedValue(mockData);

      await blogController.getFeatureBlog(mockRequest, mockResponse);

      expect(blogService.getFeatureBlog).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_BLOG_012: Should handle error when getting feature blogs', async () => {
      mockRequest.query = {};

      blogService.getFeatureBlog.mockRejectedValue(new Error('Database error'));

      await blogController.getFeatureBlog(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });

  // TC_BLOG_013-014: Test getNewBlog
  describe('getNewBlog', () => {
    test('TC_BLOG_013: Should get new blogs successfully', async () => {
      const mockData = {
        errCode: 0,
        data: [
          { id: 5, title: 'Newest Blog 1', createdAt: '2026-04-19' },
          { id: 4, title: 'Newest Blog 2', createdAt: '2026-04-18' }
        ]
      };
      
      mockRequest.query = { limit: 5 };

      blogService.getNewBlog.mockResolvedValue(mockData);

      await blogController.getNewBlog(mockRequest, mockResponse);

      expect(blogService.getNewBlog).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('TC_BLOG_014: Should handle error when getting new blogs', async () => {
      mockRequest.query = {};

      blogService.getNewBlog.mockRejectedValue(new Error('Database error'));

      await blogController.getNewBlog(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server'
      });
    });
  });
});

