// Unit tests for allcodeController.
// Each test has an explicit TC_XXX comment to match the teacher requirement.

const mockAllcodeService = {
  handleCreateNewAllCode: jest.fn(),
  getAllCodeService: jest.fn(),
  getAllCategoryBlog: jest.fn(),
  handleUpdateAllCode: jest.fn(),
  getDetailAllCodeById: jest.fn(),
  handleDeleteAllCode: jest.fn(),
  getListAllCodeService: jest.fn(),
};

jest.mock('../../../src/services/allcodeService', () => ({
  __esModule: true,
  default: mockAllcodeService,
}));

const allcodeController = require('../../../src/controllers/allcodeController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('allcodeController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // TC_001: Kiểm tra tạo allcode thành công.
  test('TC_001 - handleCreateNewAllCode should return service data', async () => {
    const req = {
      body: {
        type: 'STATUS',
        value: 'Active',
        code: 'S1',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockAllcodeService.handleCreateNewAllCode.mockResolvedValue(serviceResult);

    await allcodeController.handleCreateNewAllCode(req, res);

    expect(mockAllcodeService.handleCreateNewAllCode).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_002: Kiểm tra tạo allcode khi thiếu tham số bắt buộc.
  test('TC_002 - handleCreateNewAllCode should pass through missing parameter response', async () => {
    const req = { body: { type: 'STATUS' } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameters !',
    };
    mockAllcodeService.handleCreateNewAllCode.mockResolvedValue(serviceResult);

    await allcodeController.handleCreateNewAllCode(req, res);

    expect(mockAllcodeService.handleCreateNewAllCode).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_003: Kiểm tra lấy allcode theo type thành công.
  test('TC_003 - getAllCodeService should return service data', async () => {
    const req = { query: { type: 'STATUS' } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 1 }] };
    mockAllcodeService.getAllCodeService.mockResolvedValue(serviceResult);

    await allcodeController.getAllCodeService(req, res);

    expect(mockAllcodeService.getAllCodeService).toHaveBeenCalledWith(req.query.type);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_004: Kiểm tra lấy allcode theo type khi thiếu type.
  test('TC_004 - getAllCodeService should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameters !',
    };
    mockAllcodeService.getAllCodeService.mockResolvedValue(serviceResult);

    await allcodeController.getAllCodeService(req, res);

    expect(mockAllcodeService.getAllCodeService).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_005: Kiểm tra lấy danh mục blog thành công.
  test('TC_005 - getAllCategoryBlog should return service data', async () => {
    const req = { query: { type: 'BLOG_CATEGORY' } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ code: 'CAT1', countPost: 2 }] };
    mockAllcodeService.getAllCategoryBlog.mockResolvedValue(serviceResult);

    await allcodeController.getAllCategoryBlog(req, res);

    expect(mockAllcodeService.getAllCategoryBlog).toHaveBeenCalledWith(req.query.type);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_006: Kiểm tra lấy danh mục blog khi thiếu type.
  test('TC_006 - getAllCategoryBlog should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameters !',
    };
    mockAllcodeService.getAllCategoryBlog.mockResolvedValue(serviceResult);

    await allcodeController.getAllCategoryBlog(req, res);

    expect(mockAllcodeService.getAllCategoryBlog).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_007: Kiểm tra cập nhật allcode thành công.
  test('TC_007 - handleUpdateAllCode should return service data', async () => {
    const req = {
      body: {
        id: 1,
        value: 'Inactive',
        code: 'S2',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockAllcodeService.handleUpdateAllCode.mockResolvedValue(serviceResult);

    await allcodeController.handleUpdateAllCode(req, res);

    expect(mockAllcodeService.handleUpdateAllCode).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_008: Kiểm tra cập nhật allcode khi thiếu tham số bắt buộc.
  test('TC_008 - handleUpdateAllCode should pass through missing parameter response', async () => {
    const req = { body: { id: 1, value: 'Inactive' } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameters !',
    };
    mockAllcodeService.handleUpdateAllCode.mockResolvedValue(serviceResult);

    await allcodeController.handleUpdateAllCode(req, res);

    expect(mockAllcodeService.handleUpdateAllCode).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_009: Kiểm tra lấy chi tiết allcode theo id thành công.
  test('TC_009 - getDetailAllCodeById should return service data', async () => {
    const req = { query: { id: 10 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: { id: 10 } };
    mockAllcodeService.getDetailAllCodeById.mockResolvedValue(serviceResult);

    await allcodeController.getDetailAllCodeById(req, res);

    expect(mockAllcodeService.getDetailAllCodeById).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_010: Kiểm tra lấy chi tiết allcode khi thiếu id.
  test('TC_010 - getDetailAllCodeById should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameters !',
    };
    mockAllcodeService.getDetailAllCodeById.mockResolvedValue(serviceResult);

    await allcodeController.getDetailAllCodeById(req, res);

    expect(mockAllcodeService.getDetailAllCodeById).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_011: Kiểm tra xóa allcode thành công.
  test('TC_011 - handleDeleteAllCode should return service data', async () => {
    const req = { body: { id: 3 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, message: 'The allCode is deleted' };
    mockAllcodeService.handleDeleteAllCode.mockResolvedValue(serviceResult);

    await allcodeController.handleDeleteAllCode(req, res);

    expect(mockAllcodeService.handleDeleteAllCode).toHaveBeenCalledWith(req.body.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_012: Kiểm tra xóa allcode khi thiếu id.
  test('TC_012 - handleDeleteAllCode should pass through missing parameter response', async () => {
    const req = { body: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameters !',
    };
    mockAllcodeService.handleDeleteAllCode.mockResolvedValue(serviceResult);

    await allcodeController.handleDeleteAllCode(req, res);

    expect(mockAllcodeService.handleDeleteAllCode).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_013: Kiểm tra lấy danh sách allcode có phân trang và keyword thành công.
  test('TC_013 - getListAllCodeService should return service data', async () => {
    const req = { query: { type: 'STATUS', limit: 10, offset: 0, keyword: 'Act' } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 1 }], count: 1 };
    mockAllcodeService.getListAllCodeService.mockResolvedValue(serviceResult);

    await allcodeController.getListAllCodeService(req, res);

    expect(mockAllcodeService.getListAllCodeService).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_014: Kiểm tra controller trả lỗi server khi service throw exception.
  test('TC_014 - handleCreateNewAllCode should return generic server error on exception', async () => {
    const req = { body: { type: 'STATUS', value: 'Active', code: 'S1' } };
    const res = createMockRes();
    mockAllcodeService.handleCreateNewAllCode.mockRejectedValue(new Error('boom'));

    await allcodeController.handleCreateNewAllCode(req, res);

    expect(mockAllcodeService.handleCreateNewAllCode).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
    expect(consoleSpy).toHaveBeenCalled();
  });
});
