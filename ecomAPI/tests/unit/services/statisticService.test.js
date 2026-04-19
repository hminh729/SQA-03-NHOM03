/**
 * STATISTIC SERVICE TEST SUITE
 * =============================
 * Module: ecomAPI/src/services/statisticService.js
 */

import statisticService from "../src/services/statisticService";
import db from "../src/models/index";
import moment from "moment";

// Mock the database models
jest.mock("../src/models/index", () => ({
  User: { count: jest.fn() },
  Product: { count: jest.fn(), findOne: jest.fn() },
  Comment: { count: jest.fn() },
  OrderProduct: { 
    count: jest.fn(), 
    findAll: jest.fn(),
  },
  Allcode: { findAll: jest.fn() },
  OrderDetail: { findAll: jest.fn() },
  TypeVoucher: { findOne: jest.fn() },
  ReceiptDetail: { findAll: jest.fn() },
  ProductDetailSize: { findAndCountAll: jest.fn() },
  ProductDetail: { findOne: jest.fn() },
}));

describe("=== STATISTIC SERVICE TEST SUITE ===", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCountCardStatistic", () => {
    test("Should return counts for user, product, review, order", async () => {
      db.User.count.mockResolvedValue(10);
      db.Product.count.mockResolvedValue(20);
      db.Comment.count.mockResolvedValue(30);
      db.OrderProduct.count.mockResolvedValue(40);

      const result = await statisticService.getCountCardStatistic();
      expect(result.errCode).toBe(0);
      expect(result.data.countUser).toBe(10);
      expect(result.data.countOrder).toBe(40);
    });
  });

  describe("getCountStatusOrder", () => {
    test("Should return error if missing dates", async () => {
      const result = await statisticService.getCountStatusOrder({});
      expect(result.errCode).toBe(1);
    });

    test("Should return order status counts by day", async () => {
      const data = { 
        oneDate: '2023-01-01', 
        twoDate: '2023-01-05', 
        type: 'day' 
      };
      db.Allcode.findAll.mockResolvedValue([
        { value: 'Delivered', code: 'S6' },
        { value: 'Cancelled', code: 'S7' }
      ]);
      db.OrderProduct.findAll.mockResolvedValue([
        { statusId: 'S6', updatedAt: '2023-01-02' },
        { statusId: 'S7', updatedAt: '2023-01-03' }
      ]);

      const result = await statisticService.getCountStatusOrder(data);
      expect(result.errCode).toBe(0);
      expect(result.data.arrayValue).toContain(1);
    });
  });

  describe("getStatisticByMonth", () => {
    test("Should return revenue by month", async () => {
      const data = { year: '2023' };
      db.OrderProduct.findAll.mockResolvedValue([
        { 
          id: 1, 
          statusId: 'S6', 
          updatedAt: '2023-01-15', 
          typeShipId: 1,
          typeShipData: { price: 5 },
          voucherId: null,
          voucherData: {}
        }
      ]);
      db.OrderDetail.findAll.mockResolvedValue([
        { orderId: 1, realPrice: 100, quantity: 2 }
      ]);
      db.TypeVoucher.findOne.mockResolvedValue(null);

      const result = await statisticService.getStatisticByMonth(data);
      expect(result.errCode).toBe(0);
      expect(result.data.arrayMonthValue[0]).toBe(205); // (100*2) + 5
    });
  });

  describe("getStatisticByDay", () => {
    test("Should return revenue by day", async () => {
      const data = { month: '1', year: '2023' };
      db.OrderProduct.findAll.mockResolvedValue([
        { 
          id: 1, 
          updatedAt: '2023-01-01', 
          typeShipId: 1,
          typeShipData: { price: 5 },
          voucherId: null,
          voucherData: {}
        }
      ]);
      db.OrderDetail.findAll.mockResolvedValue([
        { orderId: 1, realPrice: 50, quantity: 1 }
      ]);

      const result = await statisticService.getStatisticByDay(data);
      expect(result.errCode).toBe(0);
      expect(result.data.arrayDayValue[0]).toBe(55); // 50 + 5
    });
  });

  describe("getStatisticProfit", () => {
    test("Should calculate profit correctly", async () => {
      const data = { type: 'month', oneDate: '2023-01-01' };
      db.OrderProduct.findAll.mockResolvedValue([
        { 
          id: 1, 
          updatedAt: '2023-01-10', 
          typeShipData: { price: 10 },
          voucherId: null,
          voucherData: { typeVoucherId: 1 }
        }
      ]);
      db.OrderDetail.findAll.mockResolvedValue([{ orderId: 1, productId: 1, realPrice: 100, quantity: 1 }]);
      db.TypeVoucher.findOne.mockResolvedValue({ typeVoucher: 'percent', value: 0 });
      db.ReceiptDetail.findAll.mockResolvedValue([{ quantity: 10, price: 60 }]);

      const result = await statisticService.getStatisticProfit(data);
      expect(result.errCode).toBe(0);
      // totalpriceProduct = 100 + 10 = 110
      // importPrice = 60
      // profitPrice = 110 - 60 = 50
      expect(result.data[0].profitPrice).toBe(50);
    });
  });
});
