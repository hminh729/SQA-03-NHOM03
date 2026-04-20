/**
 * BANNER SERVICE TEST SUITE
 * =============================
 * Module: ecomAPI/src/services/bannerService.js
 */

import bannerService from "../../../src/services/bannerService";
import db from "../../../src/models/index";

// Mock the database models
jest.mock("../../../src/models/index", () => ({
  Banner: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
  },
}));

describe("=== BANNER SERVICE TEST SUITE ===", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewBanner", () => {
    test("Should create banner successfully", async () => {
      const data = { name: "B", description: "D", image: "I" };
      db.Banner.create.mockResolvedValue(data);
      const result = await bannerService.createNewBanner(data);
      expect(result.errCode).toBe(0);
      expect(db.Banner.create).toHaveBeenCalledWith({
        ...data,
        statusId: "S1",
      });
    });

    test("Should return error if missing parameters", async () => {
      const result = await bannerService.createNewBanner({ name: "B" });
      expect(result.errCode).toBe(1);
    });
  });

  describe("getDetailBanner", () => {
    test("Should get banner and convert image", async () => {
      const base64Image = Buffer.from("test").toString("base64");
      db.Banner.findOne.mockResolvedValue({ id: 1, image: base64Image });
      const result = await bannerService.getDetailBanner(1);
      expect(result.errCode).toBe(0);
      expect(result.data.image).toBe("test");
    });

    test("Should return error if missing id", async () => {
      const result = await bannerService.getDetailBanner(null);
      expect(result.errCode).toBe(1);
    });
  });

  describe("getAllBanner", () => {
    test("Should get all active banners with image mapping", async () => {
      const base64Image = Buffer.from("test").toString("base64");
      db.Banner.findAndCountAll.mockResolvedValue({
        rows: [{ id: 1, image: base64Image }],
        count: 1,
      });
      const result = await bannerService.getAllBanner({
        limit: 10,
        offset: 0,
        keyword: "",
      });
      expect(result.errCode).toBe(0);
      expect(result.data[0].image).toBe("test");
    });
  });

  describe("updateBanner", () => {
    test("Should update banner successfully", async () => {
      const mockBanner = { id: 1, save: jest.fn() };
      db.Banner.findOne.mockResolvedValue(mockBanner);
      const result = await bannerService.updateBanner({
        id: 1,
        name: "N",
        description: "D",
        image: "I",
      });
      expect(mockBanner.name).toBe("N");
      expect(mockBanner.save).toHaveBeenCalled();
      expect(result.errCode).toBe(0);
    });
  });

  describe("deleteBanner", () => {
    test("Should delete banner successfully", async () => {
      db.Banner.findOne.mockResolvedValue({ id: 1 });
      db.Banner.destroy.mockResolvedValue(1);
      const result = await bannerService.deleteBanner({ id: 1 });
      expect(result.errCode).toBe(0);
    });
  });
});
