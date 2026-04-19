// Unit tests for jwtVerify middleware.
// Each test has an explicit TC_middleware_jwtVerify_XXX comment.

const mockJwt = {
  verify: jest.fn(),
};

const mockDb = {
  User: {
    findOne: jest.fn(),
  },
};

jest.mock('jsonwebtoken', () => mockJwt);
jest.mock('../../../src/models/index', () => ({
  __esModule: true,
  default: mockDb,
}));

const middlewareControllers = require('../../../src/middlewares/jwtVerify');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const flushAsync = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('jwtVerify middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC_middleware_jwtVerify_001: verifyTokenUser trả 401 khi thiếu token.
  test('TC_middleware_jwtVerify_001 - verifyTokenUser should return 401 without authorization header', async () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = jest.fn();

    middlewareControllers.verifyTokenUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "You're not authentication!",
      refresh: true,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // TC_middleware_jwtVerify_002: verifyTokenUser trả 403 khi token không hợp lệ.
  test('TC_middleware_jwtVerify_002 - verifyTokenUser should return 403 when token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer token-1' } };
    const res = createMockRes();
    const next = jest.fn();

    mockJwt.verify.mockImplementation((token, secret, cb) => cb(new Error('invalid'), null));

    middlewareControllers.verifyTokenUser(req, res, next);
    await flushAsync();

    expect(mockJwt.verify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      errMessage: 'Token is not valid!',
      refresh: true,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // TC_middleware_jwtVerify_003: verifyTokenUser trả 404 khi không tìm thấy user.
  test('TC_middleware_jwtVerify_003 - verifyTokenUser should return 404 when user does not exist', async () => {
    const req = { headers: { authorization: 'Bearer token-2' } };
    const res = createMockRes();
    const next = jest.fn();

    mockJwt.verify.mockImplementation((token, secret, cb) => cb(null, { sub: 9 }));
    mockDb.User.findOne.mockResolvedValue(null);

    middlewareControllers.verifyTokenUser(req, res, next);
    await flushAsync();

    expect(mockDb.User.findOne).toHaveBeenCalledWith({ where: { id: 9 } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      errMessage: 'User is not exits',
      refresh: true,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // TC_middleware_jwtVerify_004: verifyTokenUser gọi next khi token hợp lệ và user tồn tại.
  test('TC_middleware_jwtVerify_004 - verifyTokenUser should attach req.user and call next', async () => {
    const req = { headers: { authorization: 'Bearer token-3' } };
    const res = createMockRes();
    const next = jest.fn();
    const user = { id: 5, roleId: 'R2' };

    mockJwt.verify.mockImplementation((token, secret, cb) => cb(null, { sub: 5 }));
    mockDb.User.findOne.mockResolvedValue(user);

    middlewareControllers.verifyTokenUser(req, res, next);
    await flushAsync();

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalledWith(4);
  });

  // TC_middleware_jwtVerify_005: verifyTokenAdmin cho phép role R4.
  test('TC_middleware_jwtVerify_005 - verifyTokenAdmin should allow admin role R4', async () => {
    const req = { headers: { authorization: 'Bearer token-admin' } };
    const res = createMockRes();
    const next = jest.fn();
    const user = { id: 1, roleId: 'R4' };

    mockJwt.verify.mockImplementation((token, secret, cb) => cb(null, { sub: 1 }));
    mockDb.User.findOne.mockResolvedValue(user);

    middlewareControllers.verifyTokenAdmin(req, res, next);
    await flushAsync();

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledTimes(1);
  });

  // TC_middleware_jwtVerify_006: verifyTokenAdmin từ chối role không đủ quyền.
  test('TC_middleware_jwtVerify_006 - verifyTokenAdmin should return 404 for unauthorized role', async () => {
    const req = { headers: { authorization: 'Bearer token-role' } };
    const res = createMockRes();
    const next = jest.fn();

    mockJwt.verify.mockImplementation((token, secret, cb) => cb(null, { sub: 2 }));
    mockDb.User.findOne.mockResolvedValue({ id: 2, roleId: 'R2' });

    middlewareControllers.verifyTokenAdmin(req, res, next);
    await flushAsync();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      errMessage: 'Bạn không có đủ quyền',
      refresh: true,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // TC_middleware_jwtVerify_007: verifyTokenAdmin trả 401 khi thiếu token.
  test('TC_middleware_jwtVerify_007 - verifyTokenAdmin should return 401 without token', async () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = jest.fn();

    middlewareControllers.verifyTokenAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      errMessage: "You're not authentication!",
      refresh: true,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // TC_middleware_jwtVerify_008: verifyTokenShipper cho phép role R3.
  test('TC_middleware_jwtVerify_008 - verifyTokenShipper should allow shipper role R3', async () => {
    const req = { headers: { authorization: 'Bearer token-shipper' } };
    const res = createMockRes();
    const next = jest.fn();

    mockJwt.verify.mockImplementation((token, secret, cb) => cb(null, { sub: 3 }));
    mockDb.User.findOne.mockResolvedValue({ id: 3, roleId: 'R3' });

    middlewareControllers.verifyTokenShipper(req, res, next);
    await flushAsync();

    expect(next).toHaveBeenCalledTimes(1);
  });

  // TC_middleware_jwtVerify_009: verifyTokenShipper từ chối role không đủ quyền.
  test('TC_middleware_jwtVerify_009 - verifyTokenShipper should return 404 for non-shipper role', async () => {
    const req = { headers: { authorization: 'Bearer token-user' } };
    const res = createMockRes();
    const next = jest.fn();

    mockJwt.verify.mockImplementation((token, secret, cb) => cb(null, { sub: 4 }));
    mockDb.User.findOne.mockResolvedValue({ id: 4, roleId: 'R2' });

    middlewareControllers.verifyTokenShipper(req, res, next);
    await flushAsync();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      errMessage: 'Bạn không có đủ quyền',
      refresh: true,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // TC_middleware_jwtVerify_010: verifyTokenShipper trả 401 khi thiếu token.
  test('TC_middleware_jwtVerify_010 - verifyTokenShipper should return 401 without token', async () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = jest.fn();

    middlewareControllers.verifyTokenShipper(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      errMessage: "You're not authentication!",
      refresh: true,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
