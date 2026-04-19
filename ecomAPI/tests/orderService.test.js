// Unit tests for orderService.js
const orderService = require('../src/services/orderService');
const db = require('../src/models/index');

jest.mock('../src/models/index');
jest.mock('paypal-rest-sdk');

describe('OrderService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewOrder', () => {
    test('TC_ORDER_001: Should create new order successfully', async () => {
      const mockData = {
        addressUserId: 1,
        typeShipId: 1,
        isPaymentOnlien: false,
        note: 'Test order',
        userId: 1,
        arrDataShopCart: [
          { productId: 1, quantity: 2 }
        ]
      };

      db.OrderProduct = {
        create: jest.fn().mockResolvedValue({
          dataValues: { id: 1 }
        })
      };

      db.OrderDetail = {
        bulkCreate: jest.fn().mockResolvedValue([])
      };

      db.ShopCart = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        destroy: jest.fn().mockResolvedValue(1)
      };

      db.ProductDetailSize = {
        findOne: jest.fn().mockResolvedValue({
          save: jest.fn().mockResolvedValue({})
        })
      };

      const result = await orderService.createNewOrder(mockData);

      expect(result.errCode).toBe(0);
      expect(result.errMessage).toBe('ok');
      expect(db.OrderProduct.create).toHaveBeenCalled();
    });

    test('TC_ORDER_002: Should handle missing required parameters', async () => {
      const mockData = {
        addressUserId: null,
        typeShipId: 1
      };

      const result = await orderService.createNewOrder(mockData);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('updateStatusOrderShipper', () => {
    test('TC_ORDER_003: Should update order status successfully', async () => {
      const mockData = {
        id: 1,
        statusId: 'S4'
      };

      db.OrderProduct = {
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          statusId: 'S3',
          save: jest.fn().mockResolvedValue({})
        })
      };

      const result = await orderService.updateStatusOrderShipper(mockData);

      expect(result.errCode).toBe(0);
    });

    test('TC_ORDER_004: Should prevent shipper from marking delivered', async () => {
      const mockData = {
        id: 1,
        statusId: 'S6'
      };

      const result = await orderService.updateStatusOrderShipper(mockData);

      expect(result.errCode).toBe(2);
      expect(result.errMessage).toContain('Shipper cannot finalize delivery');
    });

    test('TC_ORDER_005: Should handle missing required parameters', async () => {
      const mockData = {
        id: null,
        statusId: 'S4'
      };

      const result = await orderService.updateStatusOrderShipper(mockData);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('updateStatusOrder', () => {
    test('TC_ORDER_006: Should update order status by admin successfully', async () => {
      const mockData = {
        id: 1,
        statusId: 'S5'
      };

      db.OrderProduct = {
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          statusId: 'S4',
          save: jest.fn().mockResolvedValue({})
        })
      };

      const result = await orderService.updateStatusOrder(mockData);

      expect(result.errCode).toBe(0);
    });
  });

  describe('getAllOrders', () => {
    test('TC_ORDER_007: Should get all orders successfully', async () => {
      const mockOrders = [
        { id: 1, statusId: 'S3' },
        { id: 2, statusId: 'S4' }
      ];

      db.OrderProduct = {
        findAndCountAll: jest.fn().mockResolvedValue({
          rows: mockOrders,
          count: 2
        })
      };

      const result = await orderService.getAllOrders({ limit: 10, offset: 0 });

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_ORDER_008: Should handle database error', async () => {
      db.OrderProduct = {
        findAndCountAll: jest.fn().mockRejectedValue(new Error('DB Error'))
      };

      await expect(orderService.getAllOrders({})).rejects.toThrow();
    });
  });

  describe('getDetailOrderById', () => {
    test('TC_ORDER_009: Should get order detail by ID successfully', async () => {
      const mockOrder = {
        id: 1,
        statusId: 'S3',
        addressUserId: 1,
        image: null,
        voucherData: { typeVoucherId: 1 }
      };

      db.OrderProduct = {
        findOne: jest.fn().mockResolvedValue(mockOrder)
      };

      db.TypeVoucher = {
        findOne: jest.fn().mockResolvedValue({})
      };

      db.OrderDetail = {
        findAll: jest.fn().mockResolvedValue([])
      };

      db.AddressUser = {
        findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1 })
      };

      db.User = {
        findOne: jest.fn().mockResolvedValue({ id: 1 })
      };

      const result = await orderService.getDetailOrderById(1);

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_ORDER_010: Should handle missing order ID', async () => {
      const result = await orderService.getDetailOrderById(null);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('getAllOrdersByUser', () => {
    test('TC_ORDER_011: Should get all orders by user successfully', async () => {
      db.AddressUser = {
        findAll: jest.fn().mockResolvedValue([])
      };

      const result = await orderService.getAllOrdersByUser(1);

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_ORDER_012: Should handle missing user ID', async () => {
      const result = await orderService.getAllOrdersByUser(null);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('confirmOrder', () => {
    test('TC_ORDER_013: Should confirm order successfully', async () => {
      const mockData = {
        shipperId: 1,
        orderId: 1,
        statusId: 'S4'
      };

      db.OrderProduct = {
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          statusId: 'S3',
          save: jest.fn().mockResolvedValue({})
        })
      };

      const result = await orderService.confirmOrder(mockData);

      expect(result.errCode).toBe(0);
      expect(result.errMessage).toBe('ok');
    });

    test('TC_ORDER_014: Should handle missing shipperId', async () => {
      const result = await orderService.confirmOrder({ orderId: 1, statusId: 'S4' });

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });

  describe('getAllOrdersByShipper', () => {
    test('TC_ORDER_015: Should get all orders by shipper successfully', async () => {
      const mockOrders = [];

      db.OrderProduct = {
        findAll: jest.fn().mockResolvedValue(mockOrders)
      };

      const result = await orderService.getAllOrdersByShipper({ shipperId: 1 });

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_ORDER_016: Should get available orders for shipper', async () => {
      db.OrderProduct = {
        findAll: jest.fn().mockResolvedValue([])
      };

      const result = await orderService.getAllOrdersByShipper({ status: 'available' });

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_ORDER_017: Should get working orders for shipper', async () => {
      db.OrderProduct = {
        findAll: jest.fn().mockResolvedValue([])
      };

      const result = await orderService.getAllOrdersByShipper({ status: 'working', shipperId: 1 });

      expect(result.errCode).toBe(0);
    });

    test('TC_ORDER_018: Should get done orders for shipper', async () => {
      db.OrderProduct = {
        findAll: jest.fn().mockResolvedValue([])
      };

      const result = await orderService.getAllOrdersByShipper({ status: 'done', shipperId: 1 });

      expect(result.errCode).toBe(0);
    });
  });

  describe('updateImageOrder', () => {
    test('TC_ORDER_019: Should update order image successfully', async () => {
      const mockData = {
        id: 1,
        image: 'base64imagedata'
      };

      db.OrderProduct = {
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          save: jest.fn().mockResolvedValue({})
        })
      };

      const result = await orderService.updateImageOrder(mockData);

      expect(result.errCode).toBe(0);
    });

    test('TC_ORDER_020: Should handle missing order ID', async () => {
      const result = await orderService.updateImageOrder({ image: 'test' });

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });
  });
});






