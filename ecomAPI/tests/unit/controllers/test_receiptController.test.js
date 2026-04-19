// Unit tests for receiptController.
// Each test has an explicit TC_receipt_XXX comment to match the teacher requirement.

const mockReceiptService = {
  createNewReceipt: jest.fn(),
  getDetailReceiptById: jest.fn(),
  getAllReceipt: jest.fn(),
  updateReceipt: jest.fn(),
  deleteReceipt: jest.fn(),
  createNewReceiptDetail: jest.fn(),
};

jest.mock('../../../src/services/receiptService', () => ({
  __esModule: true,
  default: mockReceiptService,
}));

const receiptController = require('../../../src/controllers/receiptController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('receiptController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // TC_receipt_001: Kiểm tra tạo phiếu nhập thành công.
  test('TC_receipt_001 - createNewReceipt should return service data', async () => {
    const req = {
      body: {
        userId: 1,
        supplierId: 2,
        productDetailSizeId: 3,
        quantity: 5,
        price: 100000,
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockReceiptService.createNewReceipt.mockResolvedValue(serviceResult);

    await receiptController.createNewReceipt(req, res);

    expect(mockReceiptService.createNewReceipt).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_002: Kiểm tra tạo phiếu nhập khi thiếu tham số bắt buộc.
  test('TC_receipt_002 - createNewReceipt should pass through missing parameter response', async () => {
    const req = { body: { userId: 1 } };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockReceiptService.createNewReceipt.mockResolvedValue(serviceResult);

    await receiptController.createNewReceipt(req, res);

    expect(mockReceiptService.createNewReceipt).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_003: Kiểm tra lấy chi tiết phiếu nhập theo id thành công.
  test('TC_receipt_003 - getDetailReceiptById should return service data', async () => {
    const req = { query: { id: 10 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: { id: 10, receiptDetail: [] } };
    mockReceiptService.getDetailReceiptById.mockResolvedValue(serviceResult);

    await receiptController.getDetailReceiptById(req, res);

    expect(mockReceiptService.getDetailReceiptById).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_004: Kiểm tra lấy chi tiết phiếu nhập khi thiếu id.
  test('TC_receipt_004 - getDetailReceiptById should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockReceiptService.getDetailReceiptById.mockResolvedValue(serviceResult);

    await receiptController.getDetailReceiptById(req, res);

    expect(mockReceiptService.getDetailReceiptById).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_005: Kiểm tra lấy danh sách phiếu nhập thành công.
  test('TC_receipt_005 - getAllReceipt should return service data', async () => {
    const req = { query: { limit: 10, offset: 0 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 1 }], count: 1 };
    mockReceiptService.getAllReceipt.mockResolvedValue(serviceResult);

    await receiptController.getAllReceipt(req, res);

    expect(mockReceiptService.getAllReceipt).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_006: Kiểm tra lấy danh sách phiếu nhập với query rỗng (edge case).
  test('TC_receipt_006 - getAllReceipt should handle empty query object', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [], count: 0 };
    mockReceiptService.getAllReceipt.mockResolvedValue(serviceResult);

    await receiptController.getAllReceipt(req, res);

    expect(mockReceiptService.getAllReceipt).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_007: Kiểm tra cập nhật phiếu nhập thành công.
  test('TC_receipt_007 - updateReceipt should return service data', async () => {
    const req = { body: { id: 1, date: '2026-04-19', supplierId: 3 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockReceiptService.updateReceipt.mockResolvedValue(serviceResult);

    await receiptController.updateReceipt(req, res);

    expect(mockReceiptService.updateReceipt).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_008: Kiểm tra cập nhật phiếu nhập khi thiếu tham số bắt buộc.
  test('TC_receipt_008 - updateReceipt should pass through missing parameter response', async () => {
    const req = { body: { id: 1 } };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockReceiptService.updateReceipt.mockResolvedValue(serviceResult);

    await receiptController.updateReceipt(req, res);

    expect(mockReceiptService.updateReceipt).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_009: Kiểm tra xóa phiếu nhập thành công.
  test('TC_receipt_009 - deleteReceipt should return service data', async () => {
    const req = { body: { id: 5 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockReceiptService.deleteReceipt.mockResolvedValue(serviceResult);

    await receiptController.deleteReceipt(req, res);

    expect(mockReceiptService.deleteReceipt).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_010: Kiểm tra xóa phiếu nhập khi thiếu id.
  test('TC_receipt_010 - deleteReceipt should pass through missing parameter response', async () => {
    const req = { body: {} };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockReceiptService.deleteReceipt.mockResolvedValue(serviceResult);

    await receiptController.deleteReceipt(req, res);

    expect(mockReceiptService.deleteReceipt).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_011: Kiểm tra tạo chi tiết phiếu nhập thành công.
  test('TC_receipt_011 - createNewReceiptDetail should return service data', async () => {
    const req = {
      body: {
        receiptId: 1,
        productDetailSizeId: 2,
        quantity: 10,
        price: 50000,
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockReceiptService.createNewReceiptDetail.mockResolvedValue(serviceResult);

    await receiptController.createNewReceiptDetail(req, res);

    expect(mockReceiptService.createNewReceiptDetail).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_012: Kiểm tra tạo chi tiết phiếu nhập khi thiếu tham số bắt buộc.
  test('TC_receipt_012 - createNewReceiptDetail should pass through missing parameter response', async () => {
    const req = { body: { receiptId: 1 } };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameter !' };
    mockReceiptService.createNewReceiptDetail.mockResolvedValue(serviceResult);

    await receiptController.createNewReceiptDetail(req, res);

    expect(mockReceiptService.createNewReceiptDetail).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_receipt_013: Kiểm tra controller trả lỗi server khi service throw exception.
  test('TC_receipt_013 - createNewReceipt should return generic server error on exception', async () => {
    const req = { body: { userId: 1 } };
    const res = createMockRes();
    mockReceiptService.createNewReceipt.mockRejectedValue(new Error('boom'));

    await receiptController.createNewReceipt(req, res);

    expect(mockReceiptService.createNewReceipt).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
    expect(consoleSpy).toHaveBeenCalled();
  });
});
