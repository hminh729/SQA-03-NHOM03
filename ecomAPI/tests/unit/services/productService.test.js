/**
 * PRODUCT SERVICE TEST SUITE
 * =============================
 * Module: ecomAPI/src/services/productService.js
 */

import productService from "../src/services/productService";
import db from "../src/models/index";

// Mock the database models
jest.mock("../src/models/index", () => ({
  Sequelize: {
    Op: {
      substring: "substring",
      in: "in",
      notIn: "notIn",
      or: "or",
    },
    INTEGER: "INTEGER",
    STRING: "STRING",
    FLOAT: "FLOAT",
    TEXT: "TEXT",
    DATE: "DATE",
    NOW: "NOW",
  },
  sequelize: {
    getQueryInterface: jest.fn().mockReturnValue({
      describeTable: jest.fn().mockResolvedValue({}),
      createTable: jest.fn().mockResolvedValue({}),
    }),
    transaction: jest.fn().mockResolvedValue({
      commit: jest.fn(),
      rollback: jest.fn(),
    }),
  },
  Product: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  ProductDetail: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findAndCountAll: jest.fn(),
    destroy: jest.fn(),
  },
  ProductImage: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findAndCountAll: jest.fn(),
    destroy: jest.fn(),
  },
  ProductDetailSize: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findAndCountAll: jest.fn(),
    destroy: jest.fn(),
  },
  Allcode: {
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  ReceiptDetail: { findAll: jest.fn() },
  OrderDetail: { findAll: jest.fn() },
  OrderProduct: { findOne: jest.fn() },
  Comment: { findAll: jest.fn() },
  Recommendation: { destroy: jest.fn(), bulkCreate: jest.fn(), findAll: jest.fn() },
  ModelRun: { destroy: jest.fn(), bulkCreate: jest.fn() },
  Interaction: { findAll: jest.fn(), findOne: jest.fn() },
}));

describe("=== PRODUCT SERVICE TEST SUITE ===", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewProduct", () => {
    test("Should create product and details successfully", async () => {
      const data = { 
        categoryId: 1, brandId: 1, image: 'img', nameDetail: 'Detail',
        name: 'Product', contentHTML: 'html', contentMarkdown: 'md',
        madeby: 'VN', material: 'Cotton', originalPrice: 100, discountPrice: 80
      };
      db.Product.create.mockResolvedValue({ id: 1 });
      db.ProductDetail.create.mockResolvedValue({ id: 10 });
      db.ProductImage.create.mockResolvedValue({});
      db.ProductDetailSize.create.mockResolvedValue({});

      const result = await productService.createNewProduct(data);
      expect(result.errCode).toBe(0);
      expect(db.Product.create).toHaveBeenCalled();
      expect(db.ProductDetail.create).toHaveBeenCalled();
    });

    test("Should return error if missing params", async () => {
      const result = await productService.createNewProduct({ name: 'P' });
      expect(result.errCode).toBe(1);
    });
  });

  describe("getAllProductAdmin", () => {
    test("Should return all products for admin with image conversion", async () => {
      const base64Image = Buffer.from('test').toString('base64');
      db.Product.findAndCountAll.mockResolvedValue({
        rows: [{ id: 1, name: 'P1' }],
        count: 1
      });
      db.ProductDetail.findAll.mockResolvedValue([{ id: 10, discountPrice: 50 }]);
      db.ProductDetailSize.findAll.mockResolvedValue([{ id: 100 }]);
      db.ProductImage.findAll.mockResolvedValue([{ image: base64Image }]);

      const result = await productService.getAllProductAdmin({ limit: 10, offset: 0, keyword: '' });
      expect(result.errCode).toBe(0);
      expect(result.data[0].productDetail[0].productImage[0].image).toBe('test');
    });
  });

  describe("getDetailProductById", () => {
    test("Should return detailed product information", async () => {
      const base64Image = Buffer.from('test').toString('base64');
      const mockProductRes = { id: 1, name: 'P', view: 0 };
      const mockProduct = { ...mockProductRes, save: jest.fn() };
      
      db.Product.findOne.mockResolvedValueOnce(mockProductRes); // for 'res'
      db.Product.findOne.mockResolvedValueOnce(mockProduct);    // for 'product' to increment view
      db.ProductDetail.findAll.mockResolvedValue([{ id: 10 }]);
      db.ProductImage.findAll.mockResolvedValue([{ image: base64Image }]);
      db.ProductDetailSize.findAll.mockResolvedValue([{ id: 100 }]);
      db.ReceiptDetail.findAll.mockResolvedValue([]);
      db.OrderDetail.findAll.mockResolvedValue([]);

      const result = await productService.getDetailProductById(1);
      expect(result.errCode).toBe(0);
      expect(mockProduct.view).toBe(1);
      expect(mockProduct.save).toHaveBeenCalled();
    });
  });

  describe("updateProduct", () => {
    test("Should update product data successfully", async () => {
      const mockProduct = { id: 1, save: jest.fn() };
      db.Product.findOne.mockResolvedValue(mockProduct);
      const data = { id: 1, categoryId: 2, brandId: 2, name: 'New Name' };
      
      const result = await productService.updateProduct(data);
      expect(result.errCode).toBe(0);
      expect(mockProduct.name).toBe('New Name');
      expect(mockProduct.save).toHaveBeenCalled();
    });
  });

  describe("deleteProductDetail", () => {
    test("Should delete detail and associated images/sizes", async () => {
      db.ProductDetail.findOne.mockResolvedValue({ id: 10 });
      db.ProductDetail.destroy.mockResolvedValue(1);
      db.ProductImage.findOne.mockResolvedValue({ id: 100 });
      db.ProductImage.destroy.mockResolvedValue(1);
      db.ProductDetailSize.findOne.mockResolvedValue({ id: 1000 });
      db.ProductDetailSize.destroy.mockResolvedValue(1);

      const result = await productService.deleteProductDetail({ id: 10 });
      expect(result.errCode).toBe(0);
      expect(db.ProductDetail.destroy).toHaveBeenCalled();
    });
  });
});
