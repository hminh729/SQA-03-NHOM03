// Unit tests for addressUserController.
// Each test has an explicit TC_XXX comment to match the teacher requirement.

const mockAddressUserService = {
  createNewAddressUser: jest.fn(),
  getAllAddressUserByUserId: jest.fn(),
  deleteAddressUser: jest.fn(),
  editAddressUser: jest.fn(),
  getDetailAddressUserById: jest.fn(),
};

jest.mock('../../../src/services/addressUserService', () => ({
  __esModule: true,
  default: mockAddressUserService,
}));

const addressUserController = require('../../../src/controllers/addressUserController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('addressUserController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // TC_001: Kiểm tra tạo địa chỉ người dùng thành công.
  test('TC_001 - createNewAddressUser should return service data', async () => {
    const req = {
      body: {
        userId: 1,
        shipName: 'Nguyen Van A',
        shipAdress: 'Ha Noi',
        shipEmail: 'a@gmail.com',
        shipPhonenumber: '0900000000',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockAddressUserService.createNewAddressUser.mockResolvedValue(serviceResult);

    await addressUserController.createNewAddressUser(req, res);

    expect(mockAddressUserService.createNewAddressUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_002: Kiểm tra tạo địa chỉ người dùng khi service báo thiếu tham số.
  test('TC_002 - createNewAddressUser should pass through validation response', async () => {
    const req = { body: { shipName: 'Nguyen Van A' } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockAddressUserService.createNewAddressUser.mockResolvedValue(serviceResult);

    await addressUserController.createNewAddressUser(req, res);

    expect(mockAddressUserService.createNewAddressUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_003: Kiểm tra lấy danh sách địa chỉ theo userId thành công.
  test('TC_003 - getAllAddressUserByUserId should return service data', async () => {
    const req = { query: { userId: 7 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 1 }] };
    mockAddressUserService.getAllAddressUserByUserId.mockResolvedValue(serviceResult);

    await addressUserController.getAllAddressUserByUserId(req, res);

    expect(mockAddressUserService.getAllAddressUserByUserId).toHaveBeenCalledWith(req.query.userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_004: Kiểm tra lấy danh sách địa chỉ khi thiếu userId.
  test('TC_004 - getAllAddressUserByUserId should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockAddressUserService.getAllAddressUserByUserId.mockResolvedValue(serviceResult);

    await addressUserController.getAllAddressUserByUserId(req, res);

    expect(mockAddressUserService.getAllAddressUserByUserId).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_005: Kiểm tra xóa địa chỉ người dùng thành công.
  test('TC_005 - deleteAddressUser should return service data', async () => {
    const req = { body: { id: 10 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockAddressUserService.deleteAddressUser.mockResolvedValue(serviceResult);

    await addressUserController.deleteAddressUser(req, res);

    expect(mockAddressUserService.deleteAddressUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_006: Kiểm tra xóa địa chỉ người dùng khi service báo không tìm thấy.
  test('TC_006 - deleteAddressUser should pass through not found response', async () => {
    const req = { body: { id: 999 } };
    const res = createMockRes();
    const serviceResult = {
      errCode: -1,
      errMessage: 'Địa chỉ user không tìm thấy',
    };
    mockAddressUserService.deleteAddressUser.mockResolvedValue(serviceResult);

    await addressUserController.deleteAddressUser(req, res);

    expect(mockAddressUserService.deleteAddressUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_007: Kiểm tra cập nhật địa chỉ người dùng thành công.
  test('TC_007 - editAddressUser should return service data', async () => {
    const req = {
      body: {
        id: 1,
        shipName: 'Nguyen Van B',
        shipAdress: 'Da Nang',
        shipEmail: 'b@gmail.com',
        shipPhonenumber: '0911111111',
      },
    };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockAddressUserService.editAddressUser.mockResolvedValue(serviceResult);

    await addressUserController.editAddressUser(req, res);

    expect(mockAddressUserService.editAddressUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_008: Kiểm tra cập nhật địa chỉ người dùng khi thiếu tham số bắt buộc.
  test('TC_008 - editAddressUser should pass through missing parameter response', async () => {
    const req = { body: { id: 1, shipName: 'Nguyen Van B' } };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockAddressUserService.editAddressUser.mockResolvedValue(serviceResult);

    await addressUserController.editAddressUser(req, res);

    expect(mockAddressUserService.editAddressUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_009: Kiểm tra lấy chi tiết địa chỉ người dùng thành công.
  test('TC_009 - getDetailAddressUserById should return service data', async () => {
    const req = { query: { id: 5 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: { id: 5 } };
    mockAddressUserService.getDetailAddressUserById.mockResolvedValue(serviceResult);

    await addressUserController.getDetailAddressUserById(req, res);

    expect(mockAddressUserService.getDetailAddressUserById).toHaveBeenCalledWith(req.query.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_010: Kiểm tra lấy chi tiết địa chỉ người dùng khi thiếu id.
  test('TC_010 - getDetailAddressUserById should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = {
      errCode: 1,
      errMessage: 'Missing required parameter !',
    };
    mockAddressUserService.getDetailAddressUserById.mockResolvedValue(serviceResult);

    await addressUserController.getDetailAddressUserById(req, res);

    expect(mockAddressUserService.getDetailAddressUserById).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_011: Kiểm tra controller trả lỗi server khi service throw exception.
  test('TC_011 - createNewAddressUser should return generic server error on exception', async () => {
    const req = { body: { userId: 1 } };
    const res = createMockRes();
    mockAddressUserService.createNewAddressUser.mockRejectedValue(new Error('boom'));

    await addressUserController.createNewAddressUser(req, res);

    expect(mockAddressUserService.createNewAddressUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
    expect(consoleSpy).toHaveBeenCalled();
  });
});
