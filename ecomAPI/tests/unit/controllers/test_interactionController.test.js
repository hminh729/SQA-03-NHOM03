// Unit tests for interactionController.
// Each test has an explicit TC_interaction_XXX comment to match the teacher requirement.

const mockInteractionService = {
  logInteraction: jest.fn(),
  getUserInteractions: jest.fn(),
  getAllInteractions: jest.fn(),
  deleteInteraction: jest.fn(),
};

const mockRecommendationService = {
  initForUser: jest.fn(),
};

jest.mock('../../../src/services/interactionService.js', () => ({
  __esModule: true,
  ...mockInteractionService,
}));

jest.mock('../../../src/services/recommendationService', () => ({
  __esModule: true,
  default: mockRecommendationService,
}));

const interactionController = require('../../../src/controllers/interactionController.js');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('interactionController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC_interaction_001: Kiểm tra log interaction thành công và gọi cập nhật recommendation.
  test('TC_interaction_001 - logInteractionController should return data and call recommendation update', async () => {
    const req = {
      body: {
        userId: 1,
        productId: 10,
        actionCode: 'VIEW',
        device: 'mobile',
      },
    };
    const res = createMockRes();
    const record = { id: 100, userId: 1, productId: 10 };

    mockInteractionService.logInteraction.mockResolvedValue(record);
    mockRecommendationService.initForUser.mockResolvedValue(undefined);

    await interactionController.logInteractionController(req, res);

    expect(mockInteractionService.logInteraction).toHaveBeenCalledWith(1, 10, 'VIEW', 'mobile');
    expect(mockRecommendationService.initForUser).toHaveBeenCalledWith(1, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: record });
  });

  // TC_interaction_002: Kiểm tra log interaction vẫn thành công khi recommendation lỗi (non-blocking).
  test('TC_interaction_002 - logInteractionController should ignore recommendation error and still return success', async () => {
    const req = {
      body: { userId: 2, productId: 20, actionCode: 'LIKE', device: 'desktop' },
    };
    const res = createMockRes();
    const record = { id: 101, userId: 2, productId: 20 };

    mockInteractionService.logInteraction.mockResolvedValue(record);
    mockRecommendationService.initForUser.mockRejectedValue(new Error('reco fail'));

    await interactionController.logInteractionController(req, res);

    expect(mockInteractionService.logInteraction).toHaveBeenCalledWith(2, 20, 'LIKE', 'desktop');
    expect(mockRecommendationService.initForUser).toHaveBeenCalledWith(2, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: record });
  });

  // TC_interaction_003: Kiểm tra log interaction trả lỗi 500 khi service throw.
  test('TC_interaction_003 - logInteractionController should return 500 on service exception', async () => {
    const req = {
      body: { userId: 1, productId: 10, actionCode: 'VIEW', device: 'mobile' },
    };
    const res = createMockRes();

    mockInteractionService.logInteraction.mockRejectedValue(new Error('bad request'));

    await interactionController.logInteractionController(req, res);

    expect(mockRecommendationService.initForUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'bad request' });
  });

  // TC_interaction_004: Kiểm tra lấy interaction theo user với action filter thành công.
  test('TC_interaction_004 - getUserInteractionsController should return filtered interactions', async () => {
    const req = {
      params: { userId: '1' },
      query: { action: 'VIEW' },
    };
    const res = createMockRes();
    const interactions = [{ id: 1 }];

    mockInteractionService.getUserInteractions.mockResolvedValue(interactions);

    await interactionController.getUserInteractionsController(req, res);

    expect(mockInteractionService.getUserInteractions).toHaveBeenCalledWith('1', 'VIEW');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: interactions });
  });

  // TC_interaction_005: Kiểm tra lấy interaction theo user khi không có action filter (edge case).
  test('TC_interaction_005 - getUserInteractionsController should pass null action when query.action is missing', async () => {
    const req = {
      params: { userId: '2' },
      query: {},
    };
    const res = createMockRes();
    const interactions = [];

    mockInteractionService.getUserInteractions.mockResolvedValue(interactions);

    await interactionController.getUserInteractionsController(req, res);

    expect(mockInteractionService.getUserInteractions).toHaveBeenCalledWith('2', null);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: interactions });
  });

  // TC_interaction_006: Kiểm tra getUserInteractionsController trả lỗi 500 khi service throw.
  test('TC_interaction_006 - getUserInteractionsController should return 500 on service exception', async () => {
    const req = {
      params: { userId: '3' },
      query: { action: 'BUY' },
    };
    const res = createMockRes();

    mockInteractionService.getUserInteractions.mockRejectedValue(new Error('db error'));

    await interactionController.getUserInteractionsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'db error' });
  });

  // TC_interaction_007: Kiểm tra lấy toàn bộ interaction với action filter thành công.
  test('TC_interaction_007 - getAllInteractionsController should return filtered interactions', async () => {
    const req = { query: { action: 'CART' } };
    const res = createMockRes();
    const interactions = [{ id: 11 }];

    mockInteractionService.getAllInteractions.mockResolvedValue(interactions);

    await interactionController.getAllInteractionsController(req, res);

    expect(mockInteractionService.getAllInteractions).toHaveBeenCalledWith('CART');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: interactions });
  });

  // TC_interaction_008: Kiểm tra lấy toàn bộ interaction khi không có action filter (edge case).
  test('TC_interaction_008 - getAllInteractionsController should pass null action when query.action is missing', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const interactions = [{ id: 12 }];

    mockInteractionService.getAllInteractions.mockResolvedValue(interactions);

    await interactionController.getAllInteractionsController(req, res);

    expect(mockInteractionService.getAllInteractions).toHaveBeenCalledWith(null);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: interactions });
  });

  // TC_interaction_009: Kiểm tra getAllInteractionsController trả lỗi 500 khi service throw.
  test('TC_interaction_009 - getAllInteractionsController should return 500 on service exception', async () => {
    const req = { query: { action: 'VIEW' } };
    const res = createMockRes();

    mockInteractionService.getAllInteractions.mockRejectedValue(new Error('server down'));

    await interactionController.getAllInteractionsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'server down' });
  });

  // TC_interaction_010: Kiểm tra xóa interaction thành công.
  test('TC_interaction_010 - deleteInteractionController should return success message', async () => {
    const req = { body: { userId: 9, productId: 90 } };
    const res = createMockRes();

    mockInteractionService.deleteInteraction.mockResolvedValue(1);

    await interactionController.deleteInteractionController(req, res);

    expect(mockInteractionService.deleteInteraction).toHaveBeenCalledWith(9, 90);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Interaction deleted' });
  });

  // TC_interaction_011: Kiểm tra deleteInteractionController trả lỗi 500 khi service throw.
  test('TC_interaction_011 - deleteInteractionController should return 500 on service exception', async () => {
    const req = { body: { userId: 9, productId: 91 } };
    const res = createMockRes();

    mockInteractionService.deleteInteraction.mockRejectedValue(new Error('delete failed'));

    await interactionController.deleteInteractionController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'delete failed' });
  });
});
