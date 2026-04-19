// Unit tests for supplierController.
// Each test has an explicit TC_XXX comment to match the teacher requirement.

const mockSupplierService = {
  createNewSupplier: jest.fn(),
  getDetailSupplierById: jest.fn(),
  getAllSupplier: jest.fn(),
  updateSupplier: jest.fn(),
  deleteSupplier: jest.fn(),
};

jest.mock('../../../src/services/supplierService', () => ({
  __esModule: true,
  default: mockSupplierService,
}));

const supplierController = require('../../../src/controllers/supplierController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('supplierController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // TC_001: Kiểm tra tạo nhà cung cấp mới thành công.
  test('TC_001 - createNewSupplier should return service data on success', async () => {
    const req = {
      body: {
        name: 'Supplier A',
        address: 'Ha Noi',
        phone: '0900000001',
        email: 'suppliera@gmail.com',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Supplier created successfully' };
    mockSupplierService.createNewSupplier.mockResolvedValue(serviceResult);

    await supplierController.createNewSupplier(req, res);

    expect(mockSupplierService.createNewSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_002: Kiểm tra tạo nhà cung cấp mới khi thiếu tham số bắt buộc.
  test('TC_002 - createNewSupplier should pass through missing parameter response', async () => {
    const req = { body: { name: 'Supplier A' } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockSupplierService.createNewSupplier.mockResolvedValue(serviceResult);

    await supplierController.createNewSupplier(req, res);

    expect(mockSupplierService.createNewSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_003: Kiểm tra tạo nhà cung cấp mới khi tên already exists.
  test('TC_003 - createNewSupplier should pass through duplicate name response', async () => {
    const req = {
      body: {
        name: 'Supplier A',
        address: 'Ha Noi',
        phone: '0900000001',
        email: 'suppliera@gmail.com',
      },
    };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Supplier name already exists',
    };
    mockSupplierService.createNewSupplier.mockResolvedValue(serviceResult);

    await supplierController.createNewSupplier(req, res);

    expect(mockSupplierService.createNewSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_004: Kiểm tra tạo nhà cung cấp mới khi có lỗi từ server.
  test('TC_004 - createNewSupplier should handle server error', async () => {
    const req = {
      body: {
        name: 'Supplier A',
        address: 'Ha Noi',
        phone: '0900000001',
        email: 'suppliera@gmail.com',
      },
    };
    const res = createMockRes();
    mockSupplierService.createNewSupplier.mockRejectedValue(new Error('Database error'));

    await supplierController.createNewSupplier(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });

  // TC_005: Kiểm tra lấy chi tiết nhà cung cấp theo id thành công.
  test('TC_005 - getDetailSupplierById should return service data on success', async () => {
    const req = { query: { id: 1 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 0,
      data: { id: 1, name: 'Supplier A', address: 'Ha Noi' },
    };
    mockSupplierService.getDetailSupplierById.mockResolvedValue(serviceResult);

    await supplierController.getDetailSupplierById(req, res);

    expect(mockSupplierService.getDetailSupplierById).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_006: Kiểm tra lấy chi tiết nhà cung cấp khi supplier không tồn tại.
  test('TC_006 - getDetailSupplierById should pass through supplier not found response', async () => {
    const req = { query: { id: 999 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Supplier not found',
    };
    mockSupplierService.getDetailSupplierById.mockResolvedValue(serviceResult);

    await supplierController.getDetailSupplierById(req, res);

    expect(mockSupplierService.getDetailSupplierById).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_007: Kiểm tra lấy chi tiết nhà cung cấp khi thiếu id.
  test('TC_007 - getDetailSupplierById should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockSupplierService.getDetailSupplierById.mockResolvedValue(serviceResult);

    await supplierController.getDetailSupplierById(req, res);

    expect(mockSupplierService.getDetailSupplierById).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_008: Kiểm tra lấy chi tiết nhà cung cấp khi có lỗi từ server.
  test('TC_008 - getDetailSupplierById should handle server error', async () => {
    const req = { query: { id: 1 } };
    const res = createMockRes();
    mockSupplierService.getDetailSupplierById.mockRejectedValue(new Error('Database error'));

    await supplierController.getDetailSupplierById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });

  // TC_009: Kiểm tra lấy danh sách tất cả nhà cung cấp thành công.
  test('TC_009 - getAllSupplier should return service data on success', async () => {
    const req = { query: { page: 1, limit: 10 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 0,
      data: [
        { id: 1, name: 'Supplier A', address: 'Ha Noi' },
        { id: 2, name: 'Supplier B', address: 'Da Nang' },
      ],
    };
    mockSupplierService.getAllSupplier.mockResolvedValue(serviceResult);

    await supplierController.getAllSupplier(req, res);

    expect(mockSupplierService.getAllSupplier).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_010: Kiểm tra lấy danh sách nhà cung cấp khi danh sách trống.
  test('TC_010 - getAllSupplier should return empty list', async () => {
    const req = { query: { page: 1, limit: 10 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [] };
    mockSupplierService.getAllSupplier.mockResolvedValue(serviceResult);

    await supplierController.getAllSupplier(req, res);

    expect(mockSupplierService.getAllSupplier).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_011: Kiểm tra lấy danh sách nhà cung cấp khi page không hợp lệ.
  test('TC_011 - getAllSupplier should pass through invalid page response', async () => {
    const req = { query: { page: -1, limit: 10 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Invalid page number',
    };
    mockSupplierService.getAllSupplier.mockResolvedValue(serviceResult);

    await supplierController.getAllSupplier(req, res);

    expect(mockSupplierService.getAllSupplier).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_012: Kiểm tra lấy danh sách nhà cung cấp khi có lỗi từ server.
  test('TC_012 - getAllSupplier should handle server error', async () => {
    const req = { query: { page: 1, limit: 10 } };
    const res = createMockRes();
    mockSupplierService.getAllSupplier.mockRejectedValue(new Error('Database error'));

    await supplierController.getAllSupplier(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });

  // TC_013: Kiểm tra cập nhật nhà cung cấp thành công.
  test('TC_013 - updateSupplier should return service data on success', async () => {
    const req = {
      body: {
        id: 1,
        name: 'Supplier A Updated',
        address: 'Ha Noi 2',
        phone: '0900000002',
        email: 'suppliera.updated@gmail.com',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Supplier updated successfully' };
    mockSupplierService.updateSupplier.mockResolvedValue(serviceResult);

    await supplierController.updateSupplier(req, res);

    expect(mockSupplierService.updateSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_014: Kiểm tra cập nhật nhà cung cấp khi supplier không tồn tại.
  test('TC_014 - updateSupplier should pass through supplier not found response', async () => {
    const req = {
      body: {
        id: 999,
        name: 'Supplier Updated',
        address: 'Ha Noi',
      },
    };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Supplier not found',
    };
    mockSupplierService.updateSupplier.mockResolvedValue(serviceResult);

    await supplierController.updateSupplier(req, res);

    expect(mockSupplierService.updateSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_015: Kiểm tra cập nhật nhà cung cấp khi thiếu tham số bắt buộc.
  test('TC_015 - updateSupplier should pass through missing parameter response', async () => {
    const req = { body: { id: 1 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockSupplierService.updateSupplier.mockResolvedValue(serviceResult);

    await supplierController.updateSupplier(req, res);

    expect(mockSupplierService.updateSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_016: Kiểm tra cập nhật nhà cung cấp khi có lỗi từ server.
  test('TC_016 - updateSupplier should handle server error', async () => {
    const req = {
      body: {
        id: 1,
        name: 'Supplier A Updated',
        address: 'Ha Noi 2',
      },
    };
    const res = createMockRes();
    mockSupplierService.updateSupplier.mockRejectedValue(new Error('Database error'));

    await supplierController.updateSupplier(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });

  // TC_017: Kiểm tra xóa nhà cung cấp thành công.
  test('TC_017 - deleteSupplier should return service data on success', async () => {
    const req = {
      body: {
        id: 5,
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Supplier deleted successfully' };
    mockSupplierService.deleteSupplier.mockResolvedValue(serviceResult);

    await supplierController.deleteSupplier(req, res);

    expect(mockSupplierService.deleteSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_018: Kiểm tra xóa nhà cung cấp khi supplier không tồn tại.
  test('TC_018 - deleteSupplier should pass through supplier not found response', async () => {
    const req = { body: { id: 999 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Supplier not found',
    };
    mockSupplierService.deleteSupplier.mockResolvedValue(serviceResult);

    await supplierController.deleteSupplier(req, res);

    expect(mockSupplierService.deleteSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_019: Kiểm tra xóa nhà cung cấp khi thiếu id.
  test('TC_019 - deleteSupplier should pass through missing parameter response', async () => {
    const req = { body: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockSupplierService.deleteSupplier.mockResolvedValue(serviceResult);

    await supplierController.deleteSupplier(req, res);

    expect(mockSupplierService.deleteSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_020: Kiểm tra xóa nhà cung cấp khi có lỗi từ server.
  test('TC_020 - deleteSupplier should handle server error', async () => {
    const req = { body: { id: 5 } };
    const res = createMockRes();
    mockSupplierService.deleteSupplier.mockRejectedValue(new Error('Database error'));

    await supplierController.deleteSupplier(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });
});
