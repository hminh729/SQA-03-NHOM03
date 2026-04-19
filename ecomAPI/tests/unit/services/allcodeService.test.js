/**
 * ALLCODE SERVICE TEST SUITE
 * =============================
 * Module: ecomAPI/src/services/allcodeService.js
 */

import allcodeService from "../src/services/allcodeService";
import db from "../src/models/index";

// Mock the database models
jest.mock("../src/models/index", () => ({
  Allcode: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  Blog: {
    findAll: jest.fn(),
  }
}));

describe("=== ALLCODE SERVICE TEST SUITE ===", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleCreateNewAllCode", () => {
    test("Should create new AllCode successfully", async () => {
      const data = { type: 'T', value: 'V', code: 'C' };
      db.Allcode.findOne.mockResolvedValue(null);
      db.Allcode.create.mockResolvedValue(data);
      
      const result = await allcodeService.handleCreateNewAllCode(data);
      expect(result.errCode).toBe(0);
      expect(db.Allcode.create).toHaveBeenCalled();
    });

    test("Should return error if code exists", async () => {
      db.Allcode.findOne.mockResolvedValue({ id: 1 });
      const result = await allcodeService.handleCreateNewAllCode({ type: 'T', value: 'V', code: 'C' });
      expect(result.errCode).toBe(2);
    });
  });

  describe("getAllCodeService", () => {
    test("Should return all codes of type", async () => {
      db.Allcode.findAll.mockResolvedValue([{ id: 1 }]);
      const result = await allcodeService.getAllCodeService('ROLE');
      expect(result.errCode).toBe(0);
      expect(result.data).toHaveLength(1);
    });
  });

  describe("handleUpdateAllCode", () => {
    test("Should update successfully", async () => {
      const mockRecord = { id: 1, value: '', code: '', save: jest.fn() };
      db.Allcode.findOne.mockResolvedValue(mockRecord);
      const result = await allcodeService.handleUpdateAllCode({ id: 1, value: 'V', code: 'C' });
      expect(mockRecord.value).toBe('V');
      expect(result.errCode).toBe(0);
    });
  });

  describe("handleDeleteAllCode", () => {
    test("Should delete successfully", async () => {
      db.Allcode.findOne.mockResolvedValue({ id: 1 });
      db.Allcode.destroy.mockResolvedValue(1);
      const result = await allcodeService.handleDeleteAllCode(1);
      expect(result.errCode).toBe(0);
    });
  });

  describe("getListAllCodeService", () => {
    test("Should get paginated list", async () => {
      db.Allcode.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
      const result = await allcodeService.getListAllCodeService({ type: 'T', limit: 10, offset: 0, keyword: '' });
      expect(result.errCode).toBe(0);
      expect(db.Allcode.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe("getAllCategoryBlog", () => {
    test("Should get all category blogs with post counts", async () => {
      db.Allcode.findAll.mockResolvedValue([{ code: 'C1' }, { code: 'C2' }]);
      db.Blog.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      
      const result = await allcodeService.getAllCategoryBlog('BLOG');
      expect(result.errCode).toBe(0);
      expect(result.data[0].countPost).toBe(2);
    });
  });
});
