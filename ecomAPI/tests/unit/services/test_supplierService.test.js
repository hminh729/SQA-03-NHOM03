// Unit tests for supplierService.
// Each test has an explicit TC_XXX comment to match the teacher requirement.

// Mock the database models before requiring the service
jest.mock('../../../src/models/index', () => ({
  Sequelize: {
    Op: {
      substring: 'LIKE',
    },
  },
  Supplier: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

const supplierService = require('../../../src/services/supplierService');
const db = require('../../../src/models/index');

describe('supplierService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC_001: Kiểm tra tạo nhà cung cấp mới thành công.
  test('TC_001 - createNewSupplier should create supplier successfully', async () => {
    const data = {
      name: 'Supplier A',
      address: 'Ha Noi',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
    };

    db.Supplier.create.mockResolvedValue({ id: 1, ...data });

    const result = await supplierService.createNewSupplier(data);

    expect(result.errCode).toBe(0);
    expect(result.errMessage).toBe('ok');
    expect(db.Supplier.create).toHaveBeenCalledWith(
      expect.objectContaining(data)
    );
  });

  // TC_002: Kiểm tra tạo nhà cung cấp khi thiếu name.
  test('TC_002 - createNewSupplier should fail when name is missing', async () => {
    const data = {
      address: 'Ha Noi',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
    };

    const result = await supplierService.createNewSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_003: Kiểm tra tạo nhà cung cấp khi thiếu address.
  test('TC_003 - createNewSupplier should fail when address is missing', async () => {
    const data = {
      name: 'Supplier A',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
    };

    const result = await supplierService.createNewSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_004: Kiểm tra tạo nhà cung cấp khi thiếu phonenumber.
  test('TC_004 - createNewSupplier should fail when phonenumber is missing', async () => {
    const data = {
      name: 'Supplier A',
      address: 'Ha Noi',
      email: 'suppliera@gmail.com',
    };

    const result = await supplierService.createNewSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_005: Kiểm tra tạo nhà cung cấp khi thiếu email.
  test('TC_005 - createNewSupplier should fail when email is missing', async () => {
    const data = {
      name: 'Supplier A',
      address: 'Ha Noi',
      phonenumber: '0900000001',
    };

    const result = await supplierService.createNewSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_006: Kiểm tra lấy chi tiết nhà cung cấp thành công.
  test('TC_006 - getDetailSupplierById should return supplier details', async () => {
    const mockSupplier = {
      id: 1,
      name: 'Supplier A',
      address: 'Ha Noi',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
    };

    db.Supplier.findOne.mockResolvedValue(mockSupplier);

    const result = await supplierService.getDetailSupplierById(1);

    expect(result.errCode).toBe(0);
    expect(result.data).toEqual(mockSupplier);
    expect(db.Supplier.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );
  });

  // TC_007: Kiểm tra lấy chi tiết nhà cung cấp khi thiếu id.
  test('TC_007 - getDetailSupplierById should fail when id is missing', async () => {
    const result = await supplierService.getDetailSupplierById(null);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_008: Kiểm tra lấy chi tiết nhà cung cấp khi supplier không tồn tại.
  test('TC_008 - getDetailSupplierById should return null when supplier not found', async () => {
    db.Supplier.findOne.mockResolvedValue(null);

    const result = await supplierService.getDetailSupplierById(999);

    expect(result.errCode).toBe(0);
    expect(result.data).toBeNull();
  });

  // TC_009: Kiểm tra lấy danh sách tất cả nhà cung cấp thành công.
  test('TC_009 - getAllSupplier should return supplier list', async () => {
    const mockSuppliers = [
      {
        id: 1,
        name: 'Supplier A',
        address: 'Ha Noi',
        phonenumber: '0900000001',
        email: 'suppliera@gmail.com',
      },
      {
        id: 2,
        name: 'Supplier B',
        address: 'Da Nang',
        phonenumber: '0900000002',
        email: 'supplierb@gmail.com',
      },
    ];

    db.Supplier.findAndCountAll.mockResolvedValue({
      rows: mockSuppliers,
      count: 2,
    });

    const result = await supplierService.getAllSupplier({
      page: 1,
      limit: 10,
      offset: 0,
      keyword: '',
    });

    expect(result.errCode).toBe(0);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.count).toBe(2);
  });

  // TC_010: Kiểm tra lấy danh sách nhà cung cấp khi danh sách trống.
  test('TC_010 - getAllSupplier should return empty list', async () => {
    db.Supplier.findAndCountAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    const result = await supplierService.getAllSupplier({
      page: 1,
      limit: 10,
      offset: 0,
      keyword: '',
    });

    expect(result.errCode).toBe(0);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.count).toBe(0);
  });

  // TC_011: Kiểm tra lấy danh sách nhà cung cấp với tìm kiếm.
  test('TC_011 - getAllSupplier should search by keyword', async () => {
    const mockSuppliers = [
      {
        id: 1,
        name: 'Supplier A',
        address: 'Ha Noi',
        phonenumber: '0900000001',
        email: 'suppliera@gmail.com',
      },
    ];

    db.Supplier.findAndCountAll.mockResolvedValue({
      rows: mockSuppliers,
      count: 1,
    });

    const result = await supplierService.getAllSupplier({
      page: 1,
      limit: 10,
      offset: 0,
      keyword: 'Supplier A',
    });

    expect(result.errCode).toBe(0);
    expect(result.data.length).toBe(1);
    expect(db.Supplier.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: expect.anything(),
        }),
      })
    );
  });

  // TC_012: Kiểm tra lấy danh sách nhà cung cấp với pagination.
  test('TC_012 - getAllSupplier should apply pagination', async () => {
    const mockSuppliers = [
      { id: 1, name: 'Supplier 1' },
      { id: 2, name: 'Supplier 2' },
    ];

    db.Supplier.findAndCountAll.mockResolvedValue({
      rows: mockSuppliers,
      count: 10,
    });

    const result = await supplierService.getAllSupplier({
      limit: 2,
      offset: 5,
      keyword: '',
    });

    expect(result.errCode).toBe(0);
    expect(result.data.length).toBe(2);
    expect(result.count).toBe(10);
    expect(db.Supplier.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 2,
        offset: 5,
      })
    );
  });

  // TC_013: Kiểm tra cập nhật nhà cung cấp thành công.
  test('TC_013 - updateSupplier should update supplier successfully', async () => {
    const mockSupplier = {
      id: 1,
      name: 'Supplier A',
      address: 'Ha Noi',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
      save: jest.fn(),
    };

    const data = {
      id: 1,
      name: 'Supplier A Updated',
      address: 'Ha Noi 2',
      phonenumber: '0900000002',
      email: 'suppliera.updated@gmail.com',
    };

    db.Supplier.findOne.mockResolvedValue(mockSupplier);

    const result = await supplierService.updateSupplier(data);

    expect(result.errCode).toBe(0);
    expect(result.errMessage).toBe('ok');
    expect(mockSupplier.name).toBe('Supplier A Updated');
    expect(mockSupplier.address).toBe('Ha Noi 2');
    expect(mockSupplier.phonenumber).toBe('0900000002');
    expect(mockSupplier.email).toBe('suppliera.updated@gmail.com');
    expect(mockSupplier.save).toHaveBeenCalled();
  });

  // TC_014: Kiểm tra cập nhật nhà cung cấp khi thiếu id.
  test('TC_014 - updateSupplier should fail when id is missing', async () => {
    const data = {
      name: 'Supplier A',
      address: 'Ha Noi',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
    };

    const result = await supplierService.updateSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_015: Kiểm tra cập nhật nhà cung cấp khi thiếu name.
  test('TC_015 - updateSupplier should fail when name is missing', async () => {
    const data = {
      id: 1,
      address: 'Ha Noi',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
    };

    const result = await supplierService.updateSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_016: Kiểm tra cập nhật nhà cung cấp khi thiếu address.
  test('TC_016 - updateSupplier should fail when address is missing', async () => {
    const data = {
      id: 1,
      name: 'Supplier A',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
    };

    const result = await supplierService.updateSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_017: Kiểm tra cập nhật nhà cung cấp khi thiếu phonenumber.
  test('TC_017 - updateSupplier should fail when phonenumber is missing', async () => {
    const data = {
      id: 1,
      name: 'Supplier A',
      address: 'Ha Noi',
      email: 'suppliera@gmail.com',
    };

    const result = await supplierService.updateSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_018: Kiểm tra cập nhật nhà cung cấp khi thiếu email.
  test('TC_018 - updateSupplier should fail when email is missing', async () => {
    const data = {
      id: 1,
      name: 'Supplier A',
      address: 'Ha Noi',
      phonenumber: '0900000001',
    };

    const result = await supplierService.updateSupplier(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_019: Kiểm tra cập nhật nhà cung cấp khi database throw error.
  test('TC_019 - updateSupplier should reject when database throws error', async () => {
    const data = {
      id: 1,
      name: 'Supplier A',
      address: 'Ha Noi',
      phonenumber: '0900000001',
      email: 'suppliera@gmail.com',
    };

    db.Supplier.findOne.mockRejectedValue(new Error('Database error'));

    try {
      await supplierService.updateSupplier(data);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });

  // TC_020: Kiểm tra xóa nhà cung cấp thành công.
  test('TC_020 - deleteSupplier should delete supplier successfully', async () => {
    const mockSupplier = {
      id: 5,
      name: 'Supplier A',
      address: 'Ha Noi',
    };

    db.Supplier.findOne.mockResolvedValue(mockSupplier);
    db.Supplier.destroy.mockResolvedValue(1);

    const result = await supplierService.deleteSupplier({ id: 5 });

    expect(result.errCode).toBe(0);
    expect(result.errMessage).toBe('ok');
    expect(db.Supplier.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } })
    );
  });

  // TC_021: Kiểm tra xóa nhà cung cấp khi thiếu id.
  test('TC_021 - deleteSupplier should fail when id is missing', async () => {
    const result = await supplierService.deleteSupplier({});

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_022: Kiểm tra xóa nhà cung cấp khi database throw error.
  test('TC_022 - deleteSupplier should reject when database throws error', async () => {
    db.Supplier.findOne.mockRejectedValue(new Error('Database error'));

    try {
      await supplierService.deleteSupplier({ id: 1 });
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });
});
