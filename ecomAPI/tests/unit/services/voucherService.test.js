/**
 * VOUCHER SERVICE TEST SUITE
 * =============================
 * Module: ecomAPI/src/services/voucherService.js
 */

import voucherService from "../src/services/voucherService";
import db from "../src/models/index";

// Mock the database models
jest.mock("../src/models/index", () => ({
  TypeVoucher: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  Voucher: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  VoucherUsed: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  Allcode: {
    findOne: jest.fn(),
    findAll: jest.fn(),
  }
}));

describe("=== VOUCHER SERVICE TEST SUITE ===", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //==================TYPE VOUCHER====================//
  describe("Type Voucher Service", () => {
    test("createNewTypeVoucher success", async () => {
      const data = { typeVoucher: 'P', value: 10, maxValue: 100, minValue: 50 };
      db.TypeVoucher.create.mockResolvedValue(data);
      const result = await voucherService.createNewTypeVoucher(data);
      expect(result.errCode).toBe(0);
      expect(db.TypeVoucher.create).toHaveBeenCalled();
    });

    test("createNewTypeVoucher missing params", async () => {
      const result = await voucherService.createNewTypeVoucher({ value: 10 });
      expect(result.errCode).toBe(1);
    });

    test("getDetailTypeVoucherById success", async () => {
      db.TypeVoucher.findOne.mockResolvedValue({ id: 1 });
      const result = await voucherService.getDetailTypeVoucherById(1);
      expect(result.errCode).toBe(0);
      expect(result.data.id).toBe(1);
    });

    test("getAllTypeVoucher success", async () => {
      db.TypeVoucher.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
      const result = await voucherService.getAllTypeVoucher({ limit: 10, offset: 0 });
      expect(result.errCode).toBe(0);
      expect(db.TypeVoucher.findAndCountAll).toHaveBeenCalled();
    });

    test("updateTypeVoucher success", async () => {
      const mockTypeVoucher = { id: 1, save: jest.fn() };
      db.TypeVoucher.findOne.mockResolvedValue(mockTypeVoucher);
      const data = { id: 1, typeVoucher: 'P', value: 20, maxValue: 200, minValue: 100 };
      const result = await voucherService.updateTypeVoucher(data);
      expect(mockTypeVoucher.value).toBe(20);
      expect(mockTypeVoucher.save).toHaveBeenCalled();
      expect(result.errCode).toBe(0);
    });

    test("deleteTypeVoucher success", async () => {
      db.TypeVoucher.findOne.mockResolvedValue({ id: 1 });
      db.TypeVoucher.destroy.mockResolvedValue(1);
      const result = await voucherService.deleteTypeVoucher({ id: 1 });
      expect(result.errCode).toBe(0);
    });
  });

  //=======================VOUCHER===================
  describe("Voucher Service", () => {
    test("createNewVoucher success", async () => {
      const data = { fromDate: '2023-01-01', toDate: '2023-01-31', typeVoucherId: 1, amount: 100, codeVoucher: 'V10' };
      db.Voucher.create.mockResolvedValue(data);
      const result = await voucherService.createNewVoucher(data);
      expect(result.errCode).toBe(0);
      expect(db.Voucher.create).toHaveBeenCalled();
    });

    test("getAllVoucher success", async () => {
      db.Voucher.findAndCountAll.mockResolvedValue({
        rows: [{ id: 1 }],
        count: 1
      });
      db.VoucherUsed.findAll.mockResolvedValue([{ id: 10 }]);
      const result = await voucherService.getAllVoucher({ limit: 10, offset: 0 });
      expect(result.errCode).toBe(0);
      expect(result.data[0].usedAmount).toBe(1);
    });

    test("saveUserVoucher success", async () => {
      db.VoucherUsed.findOne.mockResolvedValue(null);
      db.VoucherUsed.create.mockResolvedValue({ voucherId: 1, userId: 1 });
      const mockVoucher = { id: 1, save: jest.fn() };
      db.Voucher.findOne.mockResolvedValue(mockVoucher);
      
      const result = await voucherService.saveUserVoucher({ voucherId: 1, userId: 1 });
      expect(result.errCode).toBe(0);
      expect(db.VoucherUsed.create).toHaveBeenCalled();
    });

    test("getAllVoucherByUserId success", async () => {
      db.VoucherUsed.findAndCountAll.mockResolvedValue({
        rows: [{ id: 1, voucherId: 5 }],
        count: 1
      });
      db.Voucher.findOne.mockResolvedValue({ id: 5 });
      db.VoucherUsed.findAll.mockResolvedValue([]);
      
      const result = await voucherService.getAllVoucherByUserId({ id: 1 });
      expect(result.errCode).toBe(0);
      expect(result.data[0].voucherData.id).toBe(5);
    });
  });
});
