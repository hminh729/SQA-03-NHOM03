/**
 * STATISTIC CONTROLLER TEST SUITE
 * =============================
 * Module: ecomAPI/src/controllers/statisticController.js
 * Test Framework: Jest
 *
 * DESCRIPTION:
 * Unit tests for Statistic Controller covering all reporting operations:
 * - getCountCardStatistic
 * - getCountStatusOrder
 * - getStatisticByMonth
 * - getStatisticByDay
 * - getStatisticOverturn
 * - getStatisticProfit
 * - getStatisticStockProduct
 */

import statisticController from "../../../src/controllers/statisticController";
import statisticService from "../../../src/services/statisticService";

// Mock the service layer to isolate controller testing
jest.mock("../../../src/services/statisticService");

describe("=== STATISTIC CONTROLLER TEST SUITE ===", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      query: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  // =====================================================
  // TEST SUITE 1: getCountCardStatistic() tests
  // =====================================================
  describe("TEST SUITE 1: getCountCardStatistic() Function", () => {
    test("TC_001: Should successfully get count card statistic", async () => {
      const mockQuery = { from: "2023-01-01", to: "2023-12-31" };
      mockRequest.query = mockQuery;

      const mockServiceResponse = {
        errCode: 0,
        data: { count: 100 },
      };
      statisticService.getCountCardStatistic.mockResolvedValue(
        mockServiceResponse,
      );

      await statisticController.getCountCardStatistic(
        mockRequest,
        mockResponse,
      );

      expect(statisticService.getCountCardStatistic).toHaveBeenCalledWith(
        mockQuery,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    test("TC_002: Should handle error in getCountCardStatistic", async () => {
      statisticService.getCountCardStatistic.mockRejectedValue(
        new Error("Service Error"),
      );

      await statisticController.getCountCardStatistic(
        mockRequest,
        mockResponse,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 2: getCountStatusOrder() tests
  // =====================================================
  describe("TEST SUITE 2: getCountStatusOrder() Function", () => {
    test("TC_003: Should successfully get count status order", async () => {
      const mockQuery = { statusId: "S1" };
      mockRequest.query = mockQuery;

      const mockServiceResponse = {
        errCode: 0,
        data: [{ count: 10, statusId: "S1" }],
      };
      statisticService.getCountStatusOrder.mockResolvedValue(
        mockServiceResponse,
      );

      await statisticController.getCountStatusOrder(mockRequest, mockResponse);

      expect(statisticService.getCountStatusOrder).toHaveBeenCalledWith(
        mockQuery,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    test("TC_004: Should handle error in getCountStatusOrder", async () => {
      statisticService.getCountStatusOrder.mockRejectedValue(
        new Error("Service Error"),
      );

      await statisticController.getCountStatusOrder(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 3: getStatisticByMonth() tests
  // =====================================================
  describe("TEST SUITE 3: getStatisticByMonth() Function", () => {
    test("TC_005: Should successfully get statistic by month", async () => {
      const mockQuery = { year: "2023" };
      mockRequest.query = mockQuery;

      const mockServiceResponse = {
        errCode: 0,
        data: [{ month: 1, total: 1000 }],
      };
      statisticService.getStatisticByMonth.mockResolvedValue(
        mockServiceResponse,
      );

      await statisticController.getStatisticByMonth(mockRequest, mockResponse);

      expect(statisticService.getStatisticByMonth).toHaveBeenCalledWith(
        mockQuery,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    test("TC_006: Should handle error in getStatisticByMonth", async () => {
      statisticService.getStatisticByMonth.mockRejectedValue(
        new Error("Service Error"),
      );

      await statisticController.getStatisticByMonth(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 4: getStatisticByDay() tests
  // =====================================================
  describe("TEST SUITE 4: getStatisticByDay() Function", () => {
    test("TC_007: Should successfully get statistic by day", async () => {
      const mockQuery = { month: "01", year: "2023" };
      mockRequest.query = mockQuery;

      const mockServiceResponse = {
        errCode: 0,
        data: [{ day: 1, total: 100 }],
      };
      statisticService.getStatisticByDay.mockResolvedValue(mockServiceResponse);

      await statisticController.getStatisticByDay(mockRequest, mockResponse);

      expect(statisticService.getStatisticByDay).toHaveBeenCalledWith(
        mockQuery,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    test("TC_008: Should handle error in getStatisticByDay", async () => {
      statisticService.getStatisticByDay.mockRejectedValue(
        new Error("Service Error"),
      );

      await statisticController.getStatisticByDay(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 5: getStatisticOverturn() tests
  // =====================================================
  describe("TEST SUITE 5: getStatisticOverturn() Function", () => {
    test("TC_009: Should successfully get statistic overturn", async () => {
      const mockQuery = { month: "01" };
      mockRequest.query = mockQuery;

      const mockServiceResponse = {
        errCode: 0,
        data: { overturn: 5000 },
      };
      statisticService.getStatisticOverturn.mockResolvedValue(
        mockServiceResponse,
      );

      await statisticController.getStatisticOverturn(mockRequest, mockResponse);

      expect(statisticService.getStatisticOverturn).toHaveBeenCalledWith(
        mockQuery,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    test("TC_010: Should handle error in getStatisticOverturn", async () => {
      statisticService.getStatisticOverturn.mockRejectedValue(
        new Error("Service Error"),
      );

      await statisticController.getStatisticOverturn(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 6: getStatisticProfit() tests
  // =====================================================
  describe("TEST SUITE 6: getStatisticProfit() Function", () => {
    test("TC_011: Should successfully get statistic profit", async () => {
      const mockQuery = { month: "01" };
      mockRequest.query = mockQuery;

      const mockServiceResponse = {
        errCode: 0,
        data: { profit: 2000 },
      };
      statisticService.getStatisticProfit.mockResolvedValue(
        mockServiceResponse,
      );

      await statisticController.getStatisticProfit(mockRequest, mockResponse);

      expect(statisticService.getStatisticProfit).toHaveBeenCalledWith(
        mockQuery,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    test("TC_012: Should handle error in getStatisticProfit", async () => {
      statisticService.getStatisticProfit.mockRejectedValue(
        new Error("Service Error"),
      );

      await statisticController.getStatisticProfit(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 7: getStatisticStockProduct() tests
  // =====================================================
  describe("TEST SUITE 7: getStatisticStockProduct() Function", () => {
    test("TC_013: Should successfully get statistic stock product", async () => {
      const mockQuery = { limit: 10 };
      mockRequest.query = mockQuery;

      const mockServiceResponse = {
        errCode: 0,
        data: [{ productId: 1, stock: 50 }],
      };
      statisticService.getStatisticStockProduct.mockResolvedValue(
        mockServiceResponse,
      );

      await statisticController.getStatisticStockProduct(
        mockRequest,
        mockResponse,
      );

      expect(statisticService.getStatisticStockProduct).toHaveBeenCalledWith(
        mockQuery,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    test("TC_014: Should handle error in getStatisticStockProduct", async () => {
      statisticService.getStatisticStockProduct.mockRejectedValue(
        new Error("Service Error"),
      );

      await statisticController.getStatisticStockProduct(
        mockRequest,
        mockResponse,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });
});
