// Unit tests for commentController.
// Each test has an explicit TC_comment_XXX comment to match the teacher requirement.

const mockCommentService = {
  createNewReview: jest.fn(),
  getAllReviewByProductId: jest.fn(),
  ReplyReview: jest.fn(),
  deleteReview: jest.fn(),
  createNewComment: jest.fn(),
  getAllCommentByBlogId: jest.fn(),
  ReplyComment: jest.fn(),
  deleteComment: jest.fn(),
};

jest.mock('../../../src/services/commentService', () => ({
  __esModule: true,
  default: mockCommentService,
}));

const commentController = require('../../../src/controllers/commentController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('commentController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // TC_comment_001: Kiểm tra tạo review sản phẩm thành công.
  test('TC_comment_001 - createNewReview should return service data', async () => {
    const req = { body: { content: 'Good', productId: 1, userId: 2, star: 5 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockCommentService.createNewReview.mockResolvedValue(serviceResult);

    await commentController.createNewReview(req, res);

    expect(mockCommentService.createNewReview).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_002: Kiểm tra tạo review khi thiếu tham số bắt buộc.
  test('TC_comment_002 - createNewReview should pass through missing parameter response', async () => {
    const req = { body: { content: 'Good' } };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockCommentService.createNewReview.mockResolvedValue(serviceResult);

    await commentController.createNewReview(req, res);

    expect(mockCommentService.createNewReview).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_003: Kiểm tra lấy danh sách review theo productId thành công.
  test('TC_comment_003 - getAllReviewByProductId should return service data', async () => {
    const req = { query: { id: 10 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 1 }] };
    mockCommentService.getAllReviewByProductId.mockResolvedValue(serviceResult);

    await commentController.getAllReviewByProductId(req, res);

    expect(mockCommentService.getAllReviewByProductId).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_004: Kiểm tra lấy review khi thiếu productId.
  test('TC_comment_004 - getAllReviewByProductId should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockCommentService.getAllReviewByProductId.mockResolvedValue(serviceResult);

    await commentController.getAllReviewByProductId(req, res);

    expect(mockCommentService.getAllReviewByProductId).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_005: Kiểm tra reply review thành công.
  test('TC_comment_005 - ReplyReview should return service data', async () => {
    const req = { body: { content: 'Thanks', productId: 1, userId: 3, parentId: 99 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockCommentService.ReplyReview.mockResolvedValue(serviceResult);

    await commentController.ReplyReview(req, res);

    expect(mockCommentService.ReplyReview).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_006: Kiểm tra reply review khi thiếu tham số.
  test('TC_comment_006 - ReplyReview should pass through missing parameter response', async () => {
    const req = { body: { content: 'Thanks' } };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockCommentService.ReplyReview.mockResolvedValue(serviceResult);

    await commentController.ReplyReview(req, res);

    expect(mockCommentService.ReplyReview).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_007: Kiểm tra xóa review thành công.
  test('TC_comment_007 - deleteReview should return service data', async () => {
    const req = { body: { id: 5 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockCommentService.deleteReview.mockResolvedValue(serviceResult);

    await commentController.deleteReview(req, res);

    expect(mockCommentService.deleteReview).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_008: Kiểm tra xóa review khi không tồn tại.
  test('TC_comment_008 - deleteReview should pass through not found response', async () => {
    const req = { body: { id: 999 } };
    const res = createMockRes();
    const serviceResult = { errCode: 2, errMessage: 'Review not found !' };
    mockCommentService.deleteReview.mockResolvedValue(serviceResult);

    await commentController.deleteReview(req, res);

    expect(mockCommentService.deleteReview).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_009: Kiểm tra tạo comment blog thành công.
  test('TC_comment_009 - createNewComment should return service data', async () => {
    const req = { body: { content: 'Nice post', blogId: 1, userId: 2 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockCommentService.createNewComment.mockResolvedValue(serviceResult);

    await commentController.createNewComment(req, res);

    expect(mockCommentService.createNewComment).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_010: Kiểm tra tạo comment blog khi thiếu tham số.
  test('TC_comment_010 - createNewComment should pass through missing parameter response', async () => {
    const req = { body: { content: 'Nice post' } };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockCommentService.createNewComment.mockResolvedValue(serviceResult);

    await commentController.createNewComment(req, res);

    expect(mockCommentService.createNewComment).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_011: Kiểm tra lấy comment theo blogId thành công.
  test('TC_comment_011 - getAllCommentByBlogId should return service data', async () => {
    const req = { query: { id: 8 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 1 }] };
    mockCommentService.getAllCommentByBlogId.mockResolvedValue(serviceResult);

    await commentController.getAllCommentByBlogId(req, res);

    expect(mockCommentService.getAllCommentByBlogId).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_012: Kiểm tra lấy comment theo blogId khi thiếu id.
  test('TC_comment_012 - getAllCommentByBlogId should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockCommentService.getAllCommentByBlogId.mockResolvedValue(serviceResult);

    await commentController.getAllCommentByBlogId(req, res);

    expect(mockCommentService.getAllCommentByBlogId).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_013: Kiểm tra reply comment blog thành công.
  test('TC_comment_013 - ReplyComment should return service data', async () => {
    const req = { body: { content: 'Reply', blogId: 1, userId: 4, parentId: 20 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockCommentService.ReplyComment.mockResolvedValue(serviceResult);

    await commentController.ReplyComment(req, res);

    expect(mockCommentService.ReplyComment).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_014: Kiểm tra reply comment blog khi thiếu tham số.
  test('TC_comment_014 - ReplyComment should pass through missing parameter response', async () => {
    const req = { body: { content: 'Reply' } };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockCommentService.ReplyComment.mockResolvedValue(serviceResult);

    await commentController.ReplyComment(req, res);

    expect(mockCommentService.ReplyComment).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_015: Kiểm tra xóa comment blog thành công.
  test('TC_comment_015 - deleteComment should return service data', async () => {
    const req = { body: { id: 12 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockCommentService.deleteComment.mockResolvedValue(serviceResult);

    await commentController.deleteComment(req, res);

    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_016: Kiểm tra xóa comment blog khi không tồn tại.
  test('TC_comment_016 - deleteComment should pass through not found response', async () => {
    const req = { body: { id: 777 } };
    const res = createMockRes();
    const serviceResult = { errCode: 2, errMessage: 'Comment not found !' };
    mockCommentService.deleteComment.mockResolvedValue(serviceResult);

    await commentController.deleteComment(req, res);

    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_comment_017: Kiểm tra controller trả lỗi server khi service throw exception.
  test('TC_comment_017 - createNewReview should return generic server error on exception', async () => {
    const req = { body: { content: 'Good', productId: 1, userId: 2, star: 5 } };
    const res = createMockRes();
    mockCommentService.createNewReview.mockRejectedValue(new Error('boom'));

    await commentController.createNewReview(req, res);

    expect(mockCommentService.createNewReview).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
    expect(consoleSpy).toHaveBeenCalled();
  });
});
