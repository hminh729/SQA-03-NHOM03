// Unit tests for shopCartController.
// Each test has an explicit TC_XXX comment to match the teacher requirement.

const mockShopCartService = {
  addShopCart: jest.fn(),
  getAllShopCartByUserId: jest.fn(),
  deleteItemShopCart: jest.fn(),
};

jest.mock('../../../src/services/shopCartService', () => ({
  __esModule: true,
  default: mockShopCartService,
}));

const shopCartController = require('../../../src/controllers/shopCartController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('shopCartController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // TC_001: Kiểm tra thêm sản phẩm vào giỏ hàng thành công.
  test('TC_001 - addShopCart should return service data on success', async () => {
    const req = {
      body: {
        userId: 1,
        productDetailSizeId: 5,
        quantity: 2,
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Add to cart successfully' };
    mockShopCartService.addShopCart.mockResolvedValue(serviceResult);

    await shopCartController.addShopCart(req, res);

    expect(mockShopCartService.addShopCart).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_002: Kiểm tra thêm sản phẩm vào giỏ hàng khi thiếu tham số bắt buộc.
  test('TC_002 - addShopCart should pass through missing parameter response', async () => {
    const req = { body: { userId: 1 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockShopCartService.addShopCart.mockResolvedValue(serviceResult);

    await shopCartController.addShopCart(req, res);

    expect(mockShopCartService.addShopCart).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_003: Kiểm tra thêm sản phẩm vào giỏ hàng khi sản phẩm không tồn tại.
  test('TC_003 - addShopCart should pass through product not found response', async () => {
    const req = {
      body: {
        userId: 1,
        productDetailSizeId: 999,
        quantity: 2,
      },
    };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Product not found',
    };
    mockShopCartService.addShopCart.mockResolvedValue(serviceResult);

    await shopCartController.addShopCart(req, res);

    expect(mockShopCartService.addShopCart).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_004: Kiểm tra thêm sản phẩm vào giỏ hàng khi có lỗi từ server.
  test('TC_004 - addShopCart should handle server error', async () => {
    const req = {
      body: {
        userId: 1,
        productDetailSizeId: 5,
        quantity: 2,
      },
    };
    const res = createMockRes();
    mockShopCartService.addShopCart.mockRejectedValue(new Error('Database error'));

    await shopCartController.addShopCart(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });

  // TC_005: Kiểm tra lấy danh sách giỏ hàng theo userId thành công.
  test('TC_005 - getAllShopCartByUserId should return service data on success', async () => {
    const req = { query: { id: 7 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 0,
      data: [
        { id: 1, productDetailSizeId: 5, quantity: 2 },
        { id: 2, productDetailSizeId: 6, quantity: 1 },
      ],
    };
    mockShopCartService.getAllShopCartByUserId.mockResolvedValue(serviceResult);

    await shopCartController.getAllShopCartByUserId(req, res);

    expect(mockShopCartService.getAllShopCartByUserId).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_006: Kiểm tra lấy danh sách giỏ hàng khi giỏ hàng trống.
  test('TC_006 - getAllShopCartByUserId should return empty cart', async () => {
    const req = { query: { id: 8 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [] };
    mockShopCartService.getAllShopCartByUserId.mockResolvedValue(serviceResult);

    await shopCartController.getAllShopCartByUserId(req, res);

    expect(mockShopCartService.getAllShopCartByUserId).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_007: Kiểm tra lấy danh sách giỏ hàng khi thiếu userId.
  test('TC_007 - getAllShopCartByUserId should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockShopCartService.getAllShopCartByUserId.mockResolvedValue(serviceResult);

    await shopCartController.getAllShopCartByUserId(req, res);

    expect(mockShopCartService.getAllShopCartByUserId).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_008: Kiểm tra lấy danh sách giỏ hàng khi user không tồn tại.
  test('TC_008 - getAllShopCartByUserId should pass through user not found response', async () => {
    const req = { query: { id: 999 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'User not found',
    };
    mockShopCartService.getAllShopCartByUserId.mockResolvedValue(serviceResult);

    await shopCartController.getAllShopCartByUserId(req, res);

    expect(mockShopCartService.getAllShopCartByUserId).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_009: Kiểm tra lấy danh sách giỏ hàng khi có lỗi từ server.
  test('TC_009 - getAllShopCartByUserId should handle server error', async () => {
    const req = { query: { id: 7 } };
    const res = createMockRes();
    mockShopCartService.getAllShopCartByUserId.mockRejectedValue(new Error('Database error'));

    await shopCartController.getAllShopCartByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });

  // TC_010: Kiểm tra xóa sản phẩm khỏi giỏ hàng thành công.
  test('TC_010 - deleteItemShopCart should return service data on success', async () => {
    const req = {
      body: {
        id: 10,
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Item deleted from cart' };
    mockShopCartService.deleteItemShopCart.mockResolvedValue(serviceResult);

    await shopCartController.deleteItemShopCart(req, res);

    expect(mockShopCartService.deleteItemShopCart).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_011: Kiểm tra xóa sản phẩm khỏi giỏ hàng khi item không tồn tại.
  test('TC_011 - deleteItemShopCart should pass through item not found response', async () => {
    const req = { body: { id: 999 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Item not found in cart',
    };
    mockShopCartService.deleteItemShopCart.mockResolvedValue(serviceResult);

    await shopCartController.deleteItemShopCart(req, res);

    expect(mockShopCartService.deleteItemShopCart).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_012: Kiểm tra xóa sản phẩm khỏi giỏ hàng khi thiếu tham số bắt buộc.
  test('TC_012 - deleteItemShopCart should pass through missing parameter response', async () => {
    const req = { body: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockShopCartService.deleteItemShopCart.mockResolvedValue(serviceResult);

    await shopCartController.deleteItemShopCart(req, res);

    expect(mockShopCartService.deleteItemShopCart).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_013: Kiểm tra xóa sản phẩm khỏi giỏ hàng khi có lỗi từ server.
  test('TC_013 - deleteItemShopCart should handle server error', async () => {
    const req = { body: { id: 10 } };
    const res = createMockRes();
    mockShopCartService.deleteItemShopCart.mockRejectedValue(new Error('Database error'));

    await shopCartController.deleteItemShopCart(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });
});
