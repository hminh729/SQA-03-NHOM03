// Unit tests for productController.
// Each test case below is documented with an explicit TC_product_XXX comment to match the teacher requirement.

const mockProductService = {
  createNewProduct: jest.fn(),
  getAllProductAdmin: jest.fn(),
  getAllProductUser: jest.fn(),
  UnactiveProduct: jest.fn(),
  ActiveProduct: jest.fn(),
  getDetailProductById: jest.fn(),
  updateProduct: jest.fn(),
  getAllProductDetailById: jest.fn(),
  getAllProductDetailImageById: jest.fn(),
  createNewProductDetail: jest.fn(),
  updateProductDetail: jest.fn(),
  getDetailProductDetailById: jest.fn(),
  createNewProductDetailImage: jest.fn(),
  getDetailProductImageById: jest.fn(),
  updateProductDetailImage: jest.fn(),
  deleteProductDetailImage: jest.fn(),
  deleteProductDetail: jest.fn(),
  getAllProductDetailSizeById: jest.fn(),
  createNewProductDetailSize: jest.fn(),
  getDetailProductDetailSizeById: jest.fn(),
  updateProductDetailSize: jest.fn(),
  deleteProductDetailSize: jest.fn(),
  getProductFeature: jest.fn(),
  getProductNew: jest.fn(),
  getProductShopCart: jest.fn(),
  getProductRecommend: jest.fn(),
};

jest.mock('../../../src/services/productService', () => ({
  __esModule: true,
  default: mockProductService,
}));

const productController = require('../../../src/controllers/productController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const testCases = [
  // TC_product_001 - createNewProduct: happy case for creating a new product.
  { tc: 'TC_product_001', controllerFn: 'createNewProduct', serviceFn: 'createNewProduct', req: { body: { name: 'Table' } }, arg: { name: 'Table' } },
  // TC_product_003 - UnactiveProduct: happy case for marking a product inactive.
  { tc: 'TC_product_003', controllerFn: 'UnactiveProduct', serviceFn: 'UnactiveProduct', req: { body: { id: 1 } }, arg: { id: 1 } },
  // TC_product_005 - ActiveProduct: happy case for marking a product active.
  { tc: 'TC_product_005', controllerFn: 'ActiveProduct', serviceFn: 'ActiveProduct', req: { body: { id: 1 } }, arg: { id: 1 } },
  // TC_product_007 - updateProduct: happy case for updating master product data.
  { tc: 'TC_product_007', controllerFn: 'updateProduct', serviceFn: 'updateProduct', req: { body: { id: 2, name: 'Chair' } }, arg: { id: 2, name: 'Chair' } },
  // TC_product_011 - createNewProductDetail: happy case for creating product detail.
  { tc: 'TC_product_011', controllerFn: 'createNewProductDetail', serviceFn: 'createNewProductDetail', req: { body: { productId: 1 } }, arg: { productId: 1 } },
  // TC_product_013 - updateProductDetail: happy case for updating product detail.
  { tc: 'TC_product_013', controllerFn: 'updateProductDetail', serviceFn: 'updateProductDetail', req: { body: { id: 3 } }, arg: { id: 3 } },
  // TC_product_017 - createNewProductDetailImage: happy case for creating product image.
  { tc: 'TC_product_017', controllerFn: 'createNewProductDetailImage', serviceFn: 'createNewProductDetailImage', req: { body: { productdetailId: 1 } }, arg: { productdetailId: 1 } },
  // TC_product_021 - updateProductDetailImage: happy case for updating product image.
  { tc: 'TC_product_021', controllerFn: 'updateProductDetailImage', serviceFn: 'updateProductDetailImage', req: { body: { id: 4 } }, arg: { id: 4 } },
  // TC_product_023 - deleteProductDetailImage: happy case for deleting product image.
  { tc: 'TC_product_023', controllerFn: 'deleteProductDetailImage', serviceFn: 'deleteProductDetailImage', req: { body: { id: 4 } }, arg: { id: 4 } },
  // TC_product_025 - deleteProductDetail: happy case for deleting product detail.
  { tc: 'TC_product_025', controllerFn: 'deleteProductDetail', serviceFn: 'deleteProductDetail', req: { body: { id: 5 } }, arg: { id: 5 } },
  // TC_product_029 - createNewProductDetailSize: happy case for creating product detail size.
  { tc: 'TC_product_029', controllerFn: 'createNewProductDetailSize', serviceFn: 'createNewProductDetailSize', req: { body: { productdetailId: 1, sizeId: 'M' } }, arg: { productdetailId: 1, sizeId: 'M' } },
  // TC_product_033 - updateProductDetailSize: happy case for updating product detail size.
  { tc: 'TC_product_033', controllerFn: 'updateProductDetailSize', serviceFn: 'updateProductDetailSize', req: { body: { id: 9 } }, arg: { id: 9 } },
  // TC_product_035 - deleteProductDetailSize: happy case for deleting product detail size.
  { tc: 'TC_product_035', controllerFn: 'deleteProductDetailSize', serviceFn: 'deleteProductDetailSize', req: { body: { id: 10 } }, arg: { id: 10 } },

  // TC_product_037 - getAllProductAdmin: happy case for admin product listing.
  { tc: 'TC_product_037', controllerFn: 'getAllProductAdmin', serviceFn: 'getAllProductAdmin', req: { query: { page: 1, limit: 10 } }, arg: { page: 1, limit: 10 } },
  // TC_product_039 - getAllProductUser: happy case for user product listing.
  { tc: 'TC_product_039', controllerFn: 'getAllProductUser', serviceFn: 'getAllProductUser', req: { query: { categoryId: 'C1' } }, arg: { categoryId: 'C1' } },
  // TC_product_041 - getAllProductDetailById: happy case for listing details by product id.
  { tc: 'TC_product_041', controllerFn: 'getAllProductDetailById', serviceFn: 'getAllProductDetailById', req: { query: { productId: 2 } }, arg: { productId: 2 } },
  // TC_product_043 - getAllProductDetailImageById: happy case for listing images by detail id.
  { tc: 'TC_product_043', controllerFn: 'getAllProductDetailImageById', serviceFn: 'getAllProductDetailImageById', req: { query: { productdetailId: 2 } }, arg: { productdetailId: 2 } },
  // TC_product_049 - getAllProductDetailSizeById: happy case for listing sizes by detail id.
  { tc: 'TC_product_049', controllerFn: 'getAllProductDetailSizeById', serviceFn: 'getAllProductDetailSizeById', req: { query: { productdetailId: 2 } }, arg: { productdetailId: 2 } },
  // TC_product_055 - getProductShopCart: happy case for cart preview.
  { tc: 'TC_product_055', controllerFn: 'getProductShopCart', serviceFn: 'getProductShopCart', req: { query: { ids: '1,2,3' } }, arg: { ids: '1,2,3' } },
  // TC_product_057 - getProductRecommend: happy case for recommendation lookup.
  { tc: 'TC_product_057', controllerFn: 'getProductRecommend', serviceFn: 'getProductRecommend', req: { query: { userId: 10 } }, arg: { userId: 10 } },

  // TC_product_045 - getDetailProductById: happy case for product detail lookup.
  { tc: 'TC_product_045', controllerFn: 'getDetailProductById', serviceFn: 'getDetailProductById', req: { query: { id: 2 } }, arg: 2 },
  // TC_product_047 - getDetailProductDetailById: happy case for product-detail lookup.
  { tc: 'TC_product_047', controllerFn: 'getDetailProductDetailById', serviceFn: 'getDetailProductDetailById', req: { query: { id: 11 } }, arg: 11 },
  // TC_product_051 - getDetailProductImageById: happy case for image lookup.
  { tc: 'TC_product_051', controllerFn: 'getDetailProductImageById', serviceFn: 'getDetailProductImageById', req: { query: { id: 12 } }, arg: 12 },
  // TC_product_053 - getDetailProductDetailSizeById: happy case for size lookup.
  { tc: 'TC_product_053', controllerFn: 'getDetailProductDetailSizeById', serviceFn: 'getDetailProductDetailSizeById', req: { query: { id: 13 } }, arg: 13 },

  // TC_product_059 - getProductFeature: happy case for featured products.
  { tc: 'TC_product_059', controllerFn: 'getProductFeature', serviceFn: 'getProductFeature', req: { query: { limit: 8 } }, arg: 8 },
  // TC_product_061 - getProductNew: happy case for newest products.
  { tc: 'TC_product_061', controllerFn: 'getProductNew', serviceFn: 'getProductNew', req: { query: { limit: 5 } }, arg: 5 },
];

describe('productController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  testCases.forEach(({ tc, controllerFn, serviceFn, req, arg }) => {
    test(`${tc} - ${controllerFn} should return service data`, async () => {
      const res = createMockRes();
      const serviceResult = { errCode: 0, data: { ok: true } };
      mockProductService[serviceFn].mockResolvedValue(serviceResult);

      await productController[controllerFn](req, res);

      expect(mockProductService[serviceFn]).toHaveBeenCalledWith(arg);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    test(`${tc}_ERR - ${controllerFn} should return generic server error on exception`, async () => {
      const res = createMockRes();
      mockProductService[serviceFn].mockRejectedValue(new Error('boom'));

      await productController[controllerFn](req, res);

      expect(mockProductService[serviceFn]).toHaveBeenCalledWith(arg);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: 'Error from server',
      });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
