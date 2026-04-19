// Unit tests for orderController.
// Each test has an explicit TC_XXX comment to match the teacher requirement.

const mockOrderService = {
  createNewOrder: jest.fn(),
  getAllOrders: jest.fn(),
  getDetailOrderById: jest.fn(),
  updateStatusOrder: jest.fn(),
  updateStatusOrderShipper: jest.fn(),
  getAllOrdersByUser: jest.fn(),
  paymentOrder: jest.fn(),
  paymentOrderSuccess: jest.fn(),
  paymentOrderVnpaySuccess: jest.fn(),
  confirmOrder: jest.fn(),
  getAllOrdersByShipper: jest.fn(),
  paymentOrderVnpay: jest.fn(),
  confirmOrderVnpay: jest.fn(),
  updateImageOrder: jest.fn(),
};

jest.mock('../../../src/services/orderService', () => ({
  __esModule: true,
  default: mockOrderService,
}));

const orderController = require('../../../src/controllers/orderController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('orderController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // TC_001: Kiểm tra tạo đơn hàng mới thành công.
  test('TC_001 - createNewOrder should return service data on success', async () => {
    const req = {
      body: {
        userId: 1,
        shipAddressId: 5,
        shipTypeId: 1,
        totalPrice: 500000,
        paymentType: 'COD',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Order created successfully' };
    mockOrderService.createNewOrder.mockResolvedValue(serviceResult);

    await orderController.createNewOrder(req, res);

    expect(mockOrderService.createNewOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_002: Kiểm tra tạo đơn hàng mới khi thiếu tham số bắt buộc.
  test('TC_002 - createNewOrder should pass through missing parameter response', async () => {
    const req = { body: { userId: 1 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockOrderService.createNewOrder.mockResolvedValue(serviceResult);

    await orderController.createNewOrder(req, res);

    expect(mockOrderService.createNewOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_003: Kiểm tra tạo đơn hàng mới khi giỏ hàng trống.
  test('TC_003 - createNewOrder should pass through empty cart response', async () => {
    const req = {
      body: {
        userId: 1,
        shipAddressId: 5,
        shipTypeId: 1,
      },
    };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Cart is empty',
    };
    mockOrderService.createNewOrder.mockResolvedValue(serviceResult);

    await orderController.createNewOrder(req, res);

    expect(mockOrderService.createNewOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_004: Kiểm tra tạo đơn hàng mới khi có lỗi từ server.
  test('TC_004 - createNewOrder should handle server error', async () => {
    const req = {
      body: {
        userId: 1,
        shipAddressId: 5,
        shipTypeId: 1,
        totalPrice: 500000,
      },
    };
    const res = createMockRes();
    mockOrderService.createNewOrder.mockRejectedValue(new Error('Database error'));

    await orderController.createNewOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });

  // TC_005: Kiểm tra lấy danh sách tất cả đơn hàng thành công.
  test('TC_005 - getAllOrders should return service data on success', async () => {
    const req = { query: { page: 1, limit: 10 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 0,
      data: [
        { id: 1, userId: 1, totalPrice: 500000, status: 'Pending' },
        { id: 2, userId: 2, totalPrice: 350000, status: 'Confirmed' },
      ],
    };
    mockOrderService.getAllOrders.mockResolvedValue(serviceResult);

    await orderController.getAllOrders(req, res);

    expect(mockOrderService.getAllOrders).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_006: Kiểm tra lấy danh sách đơn hàng khi danh sách trống.
  test('TC_006 - getAllOrders should return empty list', async () => {
    const req = { query: { page: 1, limit: 10 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [] };
    mockOrderService.getAllOrders.mockResolvedValue(serviceResult);

    await orderController.getAllOrders(req, res);

    expect(mockOrderService.getAllOrders).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_007: Kiểm tra lấy danh sách đơn hàng khi có lỗi từ server.
  test('TC_007 - getAllOrders should handle server error', async () => {
    const req = { query: { page: 1, limit: 10 } };
    const res = createMockRes();
    mockOrderService.getAllOrders.mockRejectedValue(new Error('Database error'));

    await orderController.getAllOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });

  // TC_008: Kiểm tra lấy chi tiết đơn hàng theo id thành công.
  test('TC_008 - getDetailOrderById should return service data on success', async () => {
    const req = { query: { id: 1 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 0,
      data: { id: 1, userId: 1, totalPrice: 500000, status: 'Pending' },
    };
    mockOrderService.getDetailOrderById.mockResolvedValue(serviceResult);

    await orderController.getDetailOrderById(req, res);

    expect(mockOrderService.getDetailOrderById).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_009: Kiểm tra lấy chi tiết đơn hàng khi order không tồn tại.
  test('TC_009 - getDetailOrderById should pass through order not found response', async () => {
    const req = { query: { id: 999 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Order not found',
    };
    mockOrderService.getDetailOrderById.mockResolvedValue(serviceResult);

    await orderController.getDetailOrderById(req, res);

    expect(mockOrderService.getDetailOrderById).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_010: Kiểm tra lấy chi tiết đơn hàng khi thiếu id.
  test('TC_010 - getDetailOrderById should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockOrderService.getDetailOrderById.mockResolvedValue(serviceResult);

    await orderController.getDetailOrderById(req, res);

    expect(mockOrderService.getDetailOrderById).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_011: Kiểm tra cập nhật trạng thái đơn hàng thành công.
  test('TC_011 - updateStatusOrder should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
        status: 'Confirmed',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Order status updated' };
    mockOrderService.updateStatusOrder.mockResolvedValue(serviceResult);

    await orderController.updateStatusOrder(req, res);

    expect(mockOrderService.updateStatusOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_012: Kiểm tra cập nhật trạng thái đơn hàng khi order không tồn tại.
  test('TC_012 - updateStatusOrder should pass through order not found response', async () => {
    const req = {
      body: {
        orderId: 999,
        status: 'Confirmed',
      },
    };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Order not found',
    };
    mockOrderService.updateStatusOrder.mockResolvedValue(serviceResult);

    await orderController.updateStatusOrder(req, res);

    expect(mockOrderService.updateStatusOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_013: Kiểm tra cập nhật trạng thái đơn hàng (shipper) thành công.
  test('TC_013 - updateStatusOrderShipper should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
        status: 'Shipping',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Shipper status updated' };
    mockOrderService.updateStatusOrderShipper.mockResolvedValue(serviceResult);

    await orderController.updateStatusOrderShipper(req, res);

    expect(mockOrderService.updateStatusOrderShipper).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_014: Kiểm tra lấy danh sách đơn hàng theo user thành công.
  test('TC_014 - getAllOrdersByUser should return service data on success', async () => {
    const req = { query: { userId: 1 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 0,
      data: [
        { id: 1, userId: 1, status: 'Pending' },
        { id: 2, userId: 1, status: 'Confirmed' },
      ],
    };
    mockOrderService.getAllOrdersByUser.mockResolvedValue(serviceResult);

    await orderController.getAllOrdersByUser(req, res);

    expect(mockOrderService.getAllOrdersByUser).toHaveBeenCalledWith(req.query.userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_015: Kiểm tra lấy danh sách đơn hàng theo user khi user không có đơn.
  test('TC_015 - getAllOrdersByUser should return empty list', async () => {
    const req = { query: { userId: 999 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [] };
    mockOrderService.getAllOrdersByUser.mockResolvedValue(serviceResult);

    await orderController.getAllOrdersByUser(req, res);

    expect(mockOrderService.getAllOrdersByUser).toHaveBeenCalledWith(req.query.userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_016: Kiểm tra payment order thành công.
  test('TC_016 - paymentOrder should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
        paymentType: 'PayPal',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: { url: 'https://paypal.com' } };
    mockOrderService.paymentOrder.mockResolvedValue(serviceResult);

    await orderController.paymentOrder(req, res);

    expect(mockOrderService.paymentOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_017: Kiểm tra payment order success thành công.
  test('TC_017 - paymentOrderSuccess should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
        transactionId: 'TRX_12345',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Payment successful' };
    mockOrderService.paymentOrderSuccess.mockResolvedValue(serviceResult);

    await orderController.paymentOrderSuccess(req, res);

    expect(mockOrderService.paymentOrderSuccess).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_018: Kiểm tra payment order VNPay success thành công.
  test('TC_018 - paymentOrderVnpaySuccess should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
        vnpayTransactionNo: 'VNP_12345',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'VNPay payment successful' };
    mockOrderService.paymentOrderVnpaySuccess.mockResolvedValue(serviceResult);

    await orderController.paymentOrderVnpaySuccess(req, res);

    expect(mockOrderService.paymentOrderVnpaySuccess).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_019: Kiểm tra confirm order thành công.
  test('TC_019 - confirmOrder should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Order confirmed' };
    mockOrderService.confirmOrder.mockResolvedValue(serviceResult);

    await orderController.confirmOrder(req, res);

    expect(mockOrderService.confirmOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_020: Kiểm tra confirm order khi order không tồn tại.
  test('TC_020 - confirmOrder should pass through order not found response', async () => {
    const req = {
      body: {
        orderId: 999,
      },
    };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Order not found',
    };
    mockOrderService.confirmOrder.mockResolvedValue(serviceResult);

    await orderController.confirmOrder(req, res);

    expect(mockOrderService.confirmOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_021: Kiểm tra lấy danh sách đơn hàng theo shipper thành công.
  test('TC_021 - getAllOrdersByShipper should return service data on success', async () => {
    const req = { query: { shipperId: 1 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 0,
      data: [
        { id: 1, shipperId: 1, status: 'Shipping' },
        { id: 2, shipperId: 1, status: 'Delivered' },
      ],
    };
    mockOrderService.getAllOrdersByShipper.mockResolvedValue(serviceResult);

    await orderController.getAllOrdersByShipper(req, res);

    expect(mockOrderService.getAllOrdersByShipper).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_022: Kiểm tra payment order VNPay thành công.
  test('TC_022 - paymentOrderVnpay should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
        amount: 500000,
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: { url: 'https://vnpay.com' } };
    mockOrderService.paymentOrderVnpay.mockResolvedValue(serviceResult);

    await orderController.paymentOrderVnpay(req, res);

    expect(mockOrderService.paymentOrderVnpay).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_023: Kiểm tra confirm order VNPay thành công.
  test('TC_023 - confirmOrderVnpay should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
        vnpayTransactionNo: 'VNP_12345',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'VNPay order confirmed' };
    mockOrderService.confirmOrderVnpay.mockResolvedValue(serviceResult);

    await orderController.confirmOrderVnpay(req, res);

    expect(mockOrderService.confirmOrderVnpay).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_024: Kiểm tra cập nhật hình ảnh đơn hàng thành công.
  test('TC_024 - updateImageOrder should return service data on success', async () => {
    const req = {
      body: {
        orderId: 1,
        image: 'order_image.jpg',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'Order image updated' };
    mockOrderService.updateImageOrder.mockResolvedValue(serviceResult);

    await orderController.updateImageOrder(req, res);

    expect(mockOrderService.updateImageOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_025: Kiểm tra cập nhật hình ảnh đơn hàng khi order không tồn tại.
  test('TC_025 - updateImageOrder should pass through order not found response', async () => {
    const req = {
      body: {
        orderId: 999,
        image: 'order_image.jpg',
      },
    };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Order not found',
    };
    mockOrderService.updateImageOrder.mockResolvedValue(serviceResult);

    await orderController.updateImageOrder(req, res);

    expect(mockOrderService.updateImageOrder).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_026: Kiểm tra cập nhật hình ảnh đơn hàng khi có lỗi từ server.
  test('TC_026 - updateImageOrder should handle server error', async () => {
    const req = {
      body: {
        orderId: 1,
        image: 'order_image.jpg',
      },
    };
    const res = createMockRes();
    mockOrderService.updateImageOrder.mockRejectedValue(new Error('Database error'));

    await orderController.updateImageOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
  });
});
