/**
 * ORDER SERVICE TEST SUITE
 * =============================
 * Module: ecomAPI/src/services/orderService.js
 */

import orderService from "../src/services/orderService";
import db from "../src/models/index";
import paypal from "paypal-rest-sdk";

// Mock the database models
jest.mock("../src/models/index", () => ({
  OrderProduct: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  OrderDetail: {
    create: jest.fn(),
    findAll: jest.fn(),
    bulkCreate: jest.fn(),
  },
  ShopCart: {
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
  ProductDetailSize: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
  VoucherUsed: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
  TypeShip: { findOne: jest.fn() },
  Voucher: { findOne: jest.fn() },
  Allcode: { findOne: jest.fn() },
  User: { findOne: jest.fn() },
  TypeVoucher: { findOne: jest.fn() },
  ProductDetail: { findOne: jest.fn() },
  Product: { findOne: jest.fn() },
  ProductImage: { findAll: jest.fn() },
  AddressUser: { findOne: jest.fn() },
}));

// Mock paypal-rest-sdk
jest.mock("paypal-rest-sdk", () => ({
  configure: jest.fn(),
  payment: {
    create: jest.fn(),
    execute: jest.fn(),
  },
}));

describe("=== ORDER SERVICE TEST SUITE ===", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewOrder", () => {
    test("Should create order and clear shop cart successfully", async () => {
      const data = {
        addressUserId: 1,
        typeShipId: 1,
        userId: 1,
        arrDataShopCart: [{ productId: 10, quantity: 1 }],
        voucherId: 5,
        isPaymentOnlien: 0,
        note: 'ship fast'
      };

      db.OrderProduct.create.mockResolvedValue({ dataValues: { id: 1 } });
      db.OrderDetail.bulkCreate.mockResolvedValue({});
      db.ShopCart.findOne.mockResolvedValue({ id: 100 });
      db.ShopCart.destroy.mockResolvedValue(1);
      
      const mockProductSize = { id: 10, stock: 5, save: jest.fn() };
      db.ProductDetailSize.findOne.mockResolvedValue(mockProductSize);
      
      const mockVoucherUsed = { id: 50, status: 0, save: jest.fn() };
      db.VoucherUsed.findOne.mockResolvedValue(mockVoucherUsed);

      const result = await orderService.createNewOrder(data);
      expect(result.errCode).toBe(0);
      expect(db.OrderProduct.create).toHaveBeenCalled();
      expect(db.OrderDetail.bulkCreate).toHaveBeenCalled();
      expect(mockVoucherUsed.status).toBe(1);
      expect(mockVoucherUsed.save).toHaveBeenCalled();
    });

    test("Should return error if missing params", async () => {
      const result = await orderService.createNewOrder({ addressUserId: 1 });
      expect(result.errCode).toBe(1);
    });
  });

  describe("updateStatusOrderShipper", () => {
    test("Should block shipper from S6 (Delivered)", async () => {
      const result = await orderService.updateStatusOrderShipper({ id: 1, statusId: 'S6' });
      expect(result.errCode).toBe(2);
    });

    test("Should assign shipper and update status to S5", async () => {
      const mockOrder = { id: 1, statusId: 'S3', shipperId: null, save: jest.fn() };
      db.OrderProduct.findOne.mockResolvedValue(mockOrder);
      
      const result = await orderService.updateStatusOrderShipper({ id: 1, statusId: 'S5', shipperId: 777 });
      expect(result.errCode).toBe(0);
      expect(mockOrder.shipperId).toBe(777);
      expect(mockOrder.statusId).toBe('S5');
    });
  });

  describe("getDetailOrderById", () => {
    test("Should return inclusive order details", async () => {
      const base64Image = Buffer.from('test').toString('base64');
      db.OrderProduct.findOne.mockResolvedValue({
        id: 1,
        addressUserId: 10,
        voucherData: { typeVoucherId: 5 }
      });
      db.TypeVoucher.findOne.mockResolvedValue({ id: 5 });
      db.OrderDetail.findAll.mockResolvedValue([{ productId: 100 }]);
      db.AddressUser.findOne.mockResolvedValue({ id: 10, userId: 20 });
      db.User.findOne.mockResolvedValue({ id: 20 });
      db.ProductDetailSize.findOne.mockResolvedValue({ id: 100, productdetailId: 200 });
      db.ProductDetail.findOne.mockResolvedValue({ id: 200, productId: 300 });
      db.Product.findOne.mockResolvedValue({ id: 300 });
      db.ProductImage.findAll.mockResolvedValue([{ image: base64Image }]);

      const result = await orderService.getDetailOrderById(1);
      expect(result.errCode).toBe(0);
      expect(result.data.orderDetail[0].productImage[0].image).toBe('test');
    });
  });

  describe("paymentOrder (PayPal)", () => {
    test("Should create paypal payment and return link", async () => {
      const data = {
        total: 100,
        result: [{ productId: 1, realPrice: 23000, quantity: 1 }] // Assuming EXCHANGE_RATES.USD is 23000
      };
      
      db.ProductDetailSize.findOne.mockResolvedValue({ id: 1, productdetailId: 1, sizeData: { value: 'M' } });
      db.ProductDetail.findOne.mockResolvedValue({ id: 1, nameDetail: 'Red' });
      db.Product.findOne.mockResolvedValue({ id: 1, name: 'T-Shirt' });

      paypal.payment.create.mockImplementation((json, callback) => {
        callback(null, { links: [{}, { href: 'http://paypal.link' }] });
      });

      const result = await orderService.paymentOrder(data);
      expect(result.errCode).toBe(0);
      expect(result.link).toBe('http://paypal.link');
    });
  });
});
