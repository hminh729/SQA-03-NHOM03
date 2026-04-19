// Unit tests for recommendationController.
// Each test has an explicit TC_recommendation_XXX comment to match the teacher requirement.

const mockRecommendationService = {
  initForUser: jest.fn(),
  getCachedForUser: jest.fn(),
  clearForUser: jest.fn(),
};

const mockDb = {
  Sequelize: {
    Op: {
      in: 'in',
    },
  },
  Product: {
    findOne: jest.fn(),
  },
  ModelRun: {
    findAll: jest.fn(),
  },
  Recommendation: {
    findAll: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
  },
  Interaction: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
};

jest.mock('../../../src/services/recommendationService', () => ({
  __esModule: true,
  default: mockRecommendationService,
}));

jest.mock('../../../src/models', () => ({
  __esModule: true,
  default: mockDb,
}));

const recommendationController = require('../../../src/controllers/recommendationController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('recommendationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC_recommendation_001: Khởi tạo recommendation thành công cho user hiện tại.
  test('TC_recommendation_001 - initForCurrentUser should initialize recommendations', async () => {
    const req = { user: { id: 7 }, query: { limit: '5' } };
    const res = createMockRes();
    mockRecommendationService.initForUser.mockResolvedValue(undefined);

    await recommendationController.initForCurrentUser(req, res);

    expect(mockRecommendationService.initForUser).toHaveBeenCalledWith(7, 5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ errCode: 0, message: 'initialized' });
  });

  // TC_recommendation_002: Khởi tạo recommendation trả lỗi server khi service throw.
  test('TC_recommendation_002 - initForCurrentUser should return generic error on exception', async () => {
    const req = { user: { id: 7 }, query: {} };
    const res = createMockRes();
    mockRecommendationService.initForUser.mockRejectedValue(new Error('boom'));

    await recommendationController.initForCurrentUser(req, res);

    expect(mockRecommendationService.initForUser).toHaveBeenCalledWith(7, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
  });

  // TC_recommendation_003: Lấy danh sách recommendation và hydrate product thành công.
  test('TC_recommendation_003 - listForCurrentUser should return hydrated recommendations', async () => {
    const req = { user: { id: 9 }, query: { limit: '2' } };
    const res = createMockRes();
    const recs = [
      { productId: 1, score: 0.9, modelName: 'LNCM' },
      { productId: 2, score: 0.8, modelName: 'LNCM' },
    ];

    mockRecommendationService.getCachedForUser.mockResolvedValue(recs);
    mockDb.Product.findOne
      .mockResolvedValueOnce({ id: 1, name: 'P1' })
      .mockResolvedValueOnce({ id: 2, name: 'P2' });

    await recommendationController.listForCurrentUser(req, res);

    expect(mockRecommendationService.getCachedForUser).toHaveBeenCalledWith(9, 2);
    expect(mockDb.Product.findOne).toHaveBeenNthCalledWith(1, { where: { id: 1 } });
    expect(mockDb.Product.findOne).toHaveBeenNthCalledWith(2, { where: { id: 2 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: 0,
      data: [
        { product: { id: 1, name: 'P1' }, score: 0.9, modelName: 'LNCM' },
        { product: { id: 2, name: 'P2' }, score: 0.8, modelName: 'LNCM' },
      ],
    });
  });

  // TC_recommendation_004: Bỏ qua recommendation nếu product không tồn tại (edge case).
  test('TC_recommendation_004 - listForCurrentUser should skip missing product records', async () => {
    const req = { user: { id: 9 }, query: {} };
    const res = createMockRes();
    const recs = [{ productId: 1, score: 0.7, modelName: 'BMF' }];

    mockRecommendationService.getCachedForUser.mockResolvedValue(recs);
    mockDb.Product.findOne.mockResolvedValue(null);

    await recommendationController.listForCurrentUser(req, res);

    expect(mockRecommendationService.getCachedForUser).toHaveBeenCalledWith(9, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ errCode: 0, data: [] });
  });

  // TC_recommendation_005: listForCurrentUser trả lỗi server khi service throw.
  test('TC_recommendation_005 - listForCurrentUser should return generic error on exception', async () => {
    const req = { user: { id: 9 }, query: {} };
    const res = createMockRes();
    mockRecommendationService.getCachedForUser.mockRejectedValue(new Error('db fail'));

    await recommendationController.listForCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
  });

  // TC_recommendation_006: Render dashboard thành công với dữ liệu đã hydrate.
  test('TC_recommendation_006 - dashboardPage should render dashboard view', async () => {
    const req = { user: { id: 3 } };
    const res = createMockRes();

    mockDb.ModelRun.findAll.mockResolvedValue([
      { id: 1, recommendationsJson: JSON.stringify([{ productId: 10, score: 0.5 }]), createdAt: '2026-01-01' },
    ]);
    mockDb.Recommendation.findAll.mockResolvedValue([
      { id: 2, productId: 10, score: 0.5, modelName: 'LNCM' },
    ]);

    mockDb.Product.findOne.mockResolvedValue({ id: 10, name: 'Product 10', brandId: 'B1' });
    mockDb.User.findOne.mockResolvedValue({ id: 3, genderId: 'M' });
    mockDb.Interaction.findAll.mockResolvedValue([]);
    mockDb.Interaction.findOne.mockResolvedValue({ device_type: 'mobile' });

    await recommendationController.dashboardPage(req, res);

    expect(res.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(res.set).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    expect(res.set).toHaveBeenCalledWith('Vary', 'Origin');
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mock.calls[0][0]).toBe('recommend_dashboard');
    expect(res.render.mock.calls[0][1]).toHaveProperty('userId', 3);
    expect(res.render.mock.calls[0][1]).toHaveProperty('bestModelName', 'LNCM');
  });

  // TC_recommendation_007: Dashboard vẫn render khi recommendationsJson parse lỗi (edge case).
  test('TC_recommendation_007 - dashboardPage should keep original run when recommendationsJson parse fails', async () => {
    const req = { user: { id: 4 } };
    const res = createMockRes();

    mockDb.ModelRun.findAll.mockResolvedValue([{ id: 11, recommendationsJson: 'INVALID_JSON' }]);
    mockDb.Recommendation.findAll.mockResolvedValue([]);
    mockDb.User.findOne.mockResolvedValue({ id: 4, genderId: 'FE' });
    mockDb.Interaction.findAll.mockResolvedValue([]);
    mockDb.Interaction.findOne.mockResolvedValue(null);

    await recommendationController.dashboardPage(req, res);

    expect(res.render).toHaveBeenCalled();
    expect(res.render.mock.calls[0][1]).toHaveProperty('countRuns', 1);
  });

  // TC_recommendation_008: Dashboard trả 500 khi có exception.
  test('TC_recommendation_008 - dashboardPage should return 500 and send message on exception', async () => {
    const req = { user: { id: 5 } };
    const res = createMockRes();

    mockDb.ModelRun.findAll.mockRejectedValue(new Error('query fail'));

    await recommendationController.dashboardPage(req, res);

    expect(res.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal Error: query fail');
  });

  // TC_recommendation_009: Xóa recommendation cache thành công cho user hiện tại.
  test('TC_recommendation_009 - clearForCurrentUser should clear cache', async () => {
    const req = { user: { id: 12 } };
    const res = createMockRes();
    mockRecommendationService.clearForUser.mockResolvedValue(undefined);

    await recommendationController.clearForCurrentUser(req, res);

    expect(mockRecommendationService.clearForUser).toHaveBeenCalledWith(12);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ errCode: 0, message: 'cleared' });
  });

  // TC_recommendation_010: clearForCurrentUser trả lỗi server khi service throw.
  test('TC_recommendation_010 - clearForCurrentUser should return generic error on exception', async () => {
    const req = { user: { id: 12 } };
    const res = createMockRes();
    mockRecommendationService.clearForUser.mockRejectedValue(new Error('cannot clear'));

    await recommendationController.clearForCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
  });
});
