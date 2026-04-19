/**
 * VOUCHER CONTROLLER TEST SUITE
 * =============================
 * Module: ecomAPI/src/controllers/voucherController.js
 * Test Framework: Jest
 */

import voucherController from "../src/controllers/voucherController";
import voucherService from "../src/services/voucherService";

// Mock the service layer
jest.mock("../src/services/voucherService");

describe("=== VOUCHER CONTROLLER TEST SUITE ===", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  // ==========================TYPE VOUCHER=====================//
  describe("Type Voucher Tests", () => {
    test("createNewTypeVoucher success", async () => {
      voucherService.createNewTypeVoucher.mockResolvedValue({ errCode: 0 });
      await voucherController.createNewTypeVoucher(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0 });
    });

    test("createNewTypeVoucher error", async () => {
      voucherService.createNewTypeVoucher.mockRejectedValue(new Error());
      await voucherController.createNewTypeVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
    });

    test("getDetailTypeVoucherById success", async () => {
      mockRequest.query.id = 1;
      voucherService.getDetailTypeVoucherById.mockResolvedValue({ errCode: 0, data: {} });
      await voucherController.getDetailTypeVoucherById(mockRequest, mockResponse);
      expect(voucherService.getDetailTypeVoucherById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0, data: {} });
    });

    test("getAllTypeVoucher success", async () => {
      voucherService.getAllTypeVoucher.mockResolvedValue({ errCode: 0, data: [] });
      await voucherController.getAllTypeVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0, data: [] });
    });

    test("updateTypeVoucher success", async () => {
      voucherService.updateTypeVoucher.mockResolvedValue({ errCode: 0 });
      await voucherController.updateTypeVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0 });
    });

    test("deleteTypeVoucher success", async () => {
      voucherService.deleteTypeVoucher.mockResolvedValue({ errCode: 0 });
      await voucherController.deleteTypeVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0 });
    });

    test("getSelectTypeVoucher success", async () => {
      voucherService.getSelectTypeVoucher.mockResolvedValue({ errCode: 0, data: [] });
      await voucherController.getSelectTypeVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0, data: [] });
    });
  });

  // ==========================VOUCHER=====================//
  describe("Voucher Tests", () => {
    test("createNewVoucher success", async () => {
      voucherService.createNewVoucher.mockResolvedValue({ errCode: 0 });
      await voucherController.createNewVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0 });
    });

    test("getDetailVoucherById success", async () => {
      mockRequest.query.id = 1;
      voucherService.getDetailVoucherById.mockResolvedValue({ errCode: 0, data: {} });
      await voucherController.getDetailVoucherById(mockRequest, mockResponse);
      expect(voucherService.getDetailVoucherById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0, data: {} });
    });

    test("getAllVoucher success", async () => {
      voucherService.getAllVoucher.mockResolvedValue({ errCode: 0, data: [] });
      await voucherController.getAllVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0, data: [] });
    });

    test("updateVoucher success", async () => {
      voucherService.updateVoucher.mockResolvedValue({ errCode: 0 });
      await voucherController.updateVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0 });
    });

    test("deleteVoucher success", async () => {
      voucherService.deleteVoucher.mockResolvedValue({ errCode: 0 });
      await voucherController.deleteVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0 });
    });

    test("saveUserVoucher success", async () => {
      voucherService.saveUserVoucher.mockResolvedValue({ errCode: 0 });
      await voucherController.saveUserVoucher(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0 });
    });

    test("getAllVoucherByUserId success", async () => {
      voucherService.getAllVoucherByUserId.mockResolvedValue({ errCode: 0, data: [] });
      await voucherController.getAllVoucherByUserId(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ errCode: 0, data: [] });
    });
  });
});
