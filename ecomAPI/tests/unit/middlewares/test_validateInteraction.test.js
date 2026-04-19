// Unit tests for validateInteraction middleware.
// Each test has an explicit TC_middleware_validateInteraction_XXX comment.

const { validateLogInteraction } = require('../../../src/middlewares/validateInteraction');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('validateInteraction middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC_middleware_validateInteraction_001: Trả 400 khi thiếu userId/productId/actionCode.
  test('TC_middleware_validateInteraction_001 - should return 400 when required fields are missing', () => {
    const req = { body: { userId: 1, productId: null, actionCode: null } };
    const res = createMockRes();
    const next = jest.fn();

    validateLogInteraction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Thiếu userId, productId hoặc actionCode',
    });
    expect(next).not.toHaveBeenCalled();
  });

  // TC_middleware_validateInteraction_002: Trả 400 khi actionCode không hợp lệ.
  test('TC_middleware_validateInteraction_002 - should return 400 when actionCode is invalid', () => {
    const req = { body: { userId: 1, productId: 2, actionCode: 'like', device: 'mobile' } };
    const res = createMockRes();
    const next = jest.fn();

    validateLogInteraction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'actionCode không hợp lệ. Chỉ chấp nhận: view, cart, purchase',
    });
    expect(next).not.toHaveBeenCalled();
  });

  // TC_middleware_validateInteraction_003: Gọi next khi dữ liệu hợp lệ (view).
  test('TC_middleware_validateInteraction_003 - should call next for valid payload (view)', () => {
    const req = { body: { userId: 1, productId: 2, actionCode: 'view', device: 'desktop' } };
    const res = createMockRes();
    const next = jest.fn();

    validateLogInteraction(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  // TC_middleware_validateInteraction_004: Gọi next cho actionCode hợp lệ khác (cart/purchase).
  test('TC_middleware_validateInteraction_004 - should call next for valid payload (cart)', () => {
    const req = { body: { userId: 10, productId: 20, actionCode: 'cart' } };
    const res = createMockRes();
    const next = jest.fn();

    validateLogInteraction(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
