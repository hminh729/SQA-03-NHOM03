// Unit tests for typeshipService.
// Each test has an explicit TC_XXX comment to match the teacher requirement.

// Mock the database models before requiring the service
jest.mock('../../../src/models/index', () => ({
  Sequelize: {
    Op: {
      substring: 'LIKE',
    },
  },
  TypeShip: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

const typeshipService = require('../../../src/services/typeshipService');
const db = require('../../../src/models/index');

describe('typeshipService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC_001: Kiểm tra tạo kiểu vận chuyển mới thành công.
  test('TC_001 - createNewTypeShip should create typeship successfully', async () => {
    const data = {
      type: 'Express',
      price: 50000,
    };

    db.TypeShip.create.mockResolvedValue({ id: 1, ...data });

    const result = await typeshipService.createNewTypeShip(data);

    expect(result.errCode).toBe(0);
    expect(result.errMessage).toBe('ok');
    expect(db.TypeShip.create).toHaveBeenCalledWith(
      expect.objectContaining(data)
    );
  });

  // TC_002: Kiểm tra tạo kiểu vận chuyển khi thiếu type.
  test('TC_002 - createNewTypeShip should fail when type is missing', async () => {
    const data = {
      price: 50000,
    };

    const result = await typeshipService.createNewTypeShip(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_003: Kiểm tra tạo kiểu vận chuyển khi thiếu price.
  test('TC_003 - createNewTypeShip should fail when price is missing', async () => {
    const data = {
      type: 'Express',
    };

    const result = await typeshipService.createNewTypeShip(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_004: Kiểm tra lấy chi tiết kiểu vận chuyển thành công.
  test('TC_004 - getDetailTypeshipById should return typeship details', async () => {
    const mockTypeship = {
      id: 1,
      type: 'Express',
      price: 50000,
    };

    db.TypeShip.findOne.mockResolvedValue(mockTypeship);

    const result = await typeshipService.getDetailTypeshipById(1);

    expect(result.errCode).toBe(0);
    expect(result.data).toEqual(mockTypeship);
    expect(db.TypeShip.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );
  });

  // TC_005: Kiểm tra lấy chi tiết kiểu vận chuyển khi thiếu id.
  test('TC_005 - getDetailTypeshipById should fail when id is missing', async () => {
    const result = await typeshipService.getDetailTypeshipById(null);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_006: Kiểm tra lấy chi tiết kiểu vận chuyển khi không tồn tại.
  test('TC_006 - getDetailTypeshipById should return null when typeship not found', async () => {
    db.TypeShip.findOne.mockResolvedValue(null);

    const result = await typeshipService.getDetailTypeshipById(999);

    expect(result.errCode).toBe(0);
    expect(result.data).toBeNull();
  });

  // TC_007: Kiểm tra lấy danh sách tất cả kiểu vận chuyển thành công.
  test('TC_007 - getAllTypeship should return typeship list', async () => {
    const mockTypeships = [
      { id: 1, type: 'Express', price: 50000 },
      { id: 2, type: 'Standard', price: 30000 },
    ];

    db.TypeShip.findAndCountAll.mockResolvedValue({
      rows: mockTypeships,
      count: 2,
    });

    const result = await typeshipService.getAllTypeship({
      limit: 10,
      offset: 0,
      keyword: '',
    });

    expect(result.errCode).toBe(0);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.count).toBe(2);
  });

  // TC_008: Kiểm tra lấy danh sách kiểu vận chuyển khi danh sách trống.
  test('TC_008 - getAllTypeship should return empty list', async () => {
    db.TypeShip.findAndCountAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    const result = await typeshipService.getAllTypeship({
      limit: 10,
      offset: 0,
      keyword: '',
    });

    expect(result.errCode).toBe(0);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.count).toBe(0);
  });

  // TC_009: Kiểm tra lấy danh sách kiểu vận chuyển với tìm kiếm.
  test('TC_009 - getAllTypeship should search by keyword', async () => {
    const mockTypeships = [
      { id: 1, type: 'Express', price: 50000 },
    ];

    db.TypeShip.findAndCountAll.mockResolvedValue({
      rows: mockTypeships,
      count: 1,
    });

    const result = await typeshipService.getAllTypeship({
      limit: 10,
      offset: 0,
      keyword: 'Express',
    });

    expect(result.errCode).toBe(0);
    expect(result.data.length).toBe(1);
    expect(db.TypeShip.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          type: expect.anything(),
        }),
      })
    );
  });

  // TC_010: Kiểm tra lấy danh sách kiểu vận chuyển với pagination.
  test('TC_010 - getAllTypeship should apply pagination', async () => {
    const mockTypeships = [
      { id: 3, type: 'Typeship 3' },
      { id: 4, type: 'Typeship 4' },
    ];

    db.TypeShip.findAndCountAll.mockResolvedValue({
      rows: mockTypeships,
      count: 10,
    });

    const result = await typeshipService.getAllTypeship({
      limit: 2,
      offset: 10,
      keyword: '',
    });

    expect(result.errCode).toBe(0);
    expect(result.data.length).toBe(2);
    expect(result.count).toBe(10);
    expect(db.TypeShip.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 2,
        offset: 10,
      })
    );
  });

  // TC_011: Kiểm tra cập nhật kiểu vận chuyển thành công.
  test('TC_011 - updateTypeship should update typeship successfully', async () => {
    const mockTypeship = {
      id: 1,
      type: 'Express',
      price: 50000,
      save: jest.fn(),
    };

    const data = {
      id: 1,
      type: 'Express Plus',
      price: 75000,
    };

    db.TypeShip.findOne.mockResolvedValue(mockTypeship);

    const result = await typeshipService.updateTypeship(data);

    expect(result.errCode).toBe(0);
    expect(result.errMessage).toBe('ok');
    expect(mockTypeship.type).toBe('Express Plus');
    expect(mockTypeship.price).toBe(75000);
    expect(mockTypeship.save).toHaveBeenCalled();
  });

  // TC_012: Kiểm tra cập nhật kiểu vận chuyển khi thiếu id.
  test('TC_012 - updateTypeship should fail when id is missing', async () => {
    const data = {
      type: 'Express',
      price: 50000,
    };

    const result = await typeshipService.updateTypeship(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_013: Kiểm tra cập nhật kiểu vận chuyển khi thiếu type.
  test('TC_013 - updateTypeship should fail when type is missing', async () => {
    const data = {
      id: 1,
      price: 50000,
    };

    const result = await typeshipService.updateTypeship(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_014: Kiểm tra cập nhật kiểu vận chuyển khi thiếu price.
  test('TC_014 - updateTypeship should fail when price is missing', async () => {
    const data = {
      id: 1,
      type: 'Express',
    };

    const result = await typeshipService.updateTypeship(data);

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_015: Kiểm tra cập nhật kiểu vận chuyển khi database throw error.
  test('TC_015 - updateTypeship should reject when database throws error', async () => {
    const data = {
      id: 1,
      type: 'Express',
      price: 50000,
    };

    db.TypeShip.findOne.mockRejectedValue(new Error('Database error'));

    try {
      await typeshipService.updateTypeship(data);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });

  // TC_016: Kiểm tra xóa kiểu vận chuyển thành công.
  test('TC_016 - deleteTypeship should delete typeship successfully', async () => {
    const mockTypeship = {
      id: 1,
      type: 'Express',
      price: 50000,
    };

    db.TypeShip.findOne.mockResolvedValue(mockTypeship);
    db.TypeShip.destroy.mockResolvedValue(1);

    const result = await typeshipService.deleteTypeship({ id: 1 });

    expect(result.errCode).toBe(0);
    expect(result.errMessage).toBe('ok');
    expect(db.TypeShip.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );
  });

  // TC_017: Kiểm tra xóa kiểu vận chuyển khi thiếu id.
  test('TC_017 - deleteTypeship should fail when id is missing', async () => {
    const result = await typeshipService.deleteTypeship({});

    expect(result.errCode).toBe(1);
    expect(result.errMessage).toBe('Missing required parameter !');
  });

  // TC_018: Kiểm tra xóa kiểu vận chuyển khi database throw error.
  test('TC_018 - deleteTypeship should reject when database throws error', async () => {
    db.TypeShip.findOne.mockRejectedValue(new Error('Database error'));

    try {
      await typeshipService.deleteTypeship({ id: 1 });
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });
});
