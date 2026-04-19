// Unit tests for messageController.
// Each test has an explicit TC_message_XXX comment to match the teacher requirement.

const mockMessageService = {
  createNewRoom: jest.fn(),
  sendMessage: jest.fn(),
  loadMessage: jest.fn(),
  listRoomOfUser: jest.fn(),
  listRoomOfAdmin: jest.fn(),
};

jest.mock('../../../src/services/messageService', () => ({
  __esModule: true,
  default: mockMessageService,
}));

const messageController = require('../../../src/controllers/messageController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('messageController', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // TC_message_001: Kiểm tra tạo room chat thành công.
  test('TC_message_001 - createNewRoom should return service data', async () => {
    const req = { body: { userId1: 5 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockMessageService.createNewRoom.mockResolvedValue(serviceResult);

    await messageController.createNewRoom(req, res);

    expect(mockMessageService.createNewRoom).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_002: Kiểm tra tạo room chat khi thiếu tham số bắt buộc.
  test('TC_message_002 - createNewRoom should pass through missing parameter response', async () => {
    const req = { body: {} };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameters !' };
    mockMessageService.createNewRoom.mockResolvedValue(serviceResult);

    await messageController.createNewRoom(req, res);

    expect(mockMessageService.createNewRoom).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_003: Kiểm tra gửi message thành công.
  test('TC_message_003 - sendMessage should return service data', async () => {
    const req = { body: { userId: 2, roomId: 10, text: 'hello' } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok' };
    mockMessageService.sendMessage.mockResolvedValue(serviceResult);

    await messageController.sendMessage(req, res);

    expect(mockMessageService.sendMessage).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_004: Kiểm tra gửi message khi message bị dedupe (edge case).
  test('TC_message_004 - sendMessage should pass through deduped response', async () => {
    const req = { body: { userId: 2, roomId: 10, text: 'hello' } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, errMessage: 'ok', deduped: true };
    mockMessageService.sendMessage.mockResolvedValue(serviceResult);

    await messageController.sendMessage(req, res);

    expect(mockMessageService.sendMessage).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_005: Kiểm tra tải lịch sử message theo roomId thành công.
  test('TC_message_005 - loadMessage should return service data', async () => {
    const req = { query: { roomId: 10, userId: 2 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 1, text: 'hello' }] };
    mockMessageService.loadMessage.mockResolvedValue(serviceResult);

    await messageController.loadMessage(req, res);

    expect(mockMessageService.loadMessage).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_006: Kiểm tra tải lịch sử message khi thiếu roomId.
  test('TC_message_006 - loadMessage should pass through missing parameter response', async () => {
    const req = { query: { userId: 2 } };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameters !' };
    mockMessageService.loadMessage.mockResolvedValue(serviceResult);

    await messageController.loadMessage(req, res);

    expect(mockMessageService.loadMessage).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_007: Kiểm tra lấy danh sách room của user thành công.
  test('TC_message_007 - listRoomOfUser should return service data', async () => {
    const req = { query: { userId: 7 } };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 100 }] };
    mockMessageService.listRoomOfUser.mockResolvedValue(serviceResult);

    await messageController.listRoomOfUser(req, res);

    expect(mockMessageService.listRoomOfUser).toHaveBeenCalledWith(req.query.userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_008: Kiểm tra lấy danh sách room của user khi thiếu userId.
  test('TC_message_008 - listRoomOfUser should pass through missing parameter response', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = { errCode: 1, errMessage: 'Missing required parameters !' };
    mockMessageService.listRoomOfUser.mockResolvedValue(serviceResult);

    await messageController.listRoomOfUser(req, res);

    expect(mockMessageService.listRoomOfUser).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_009: Kiểm tra lấy danh sách room của admin thành công.
  test('TC_message_009 - listRoomOfAdmin should return service data', async () => {
    const req = { query: {} };
    const res = createMockRes();
    const serviceResult = { errCode: 0, data: [{ id: 200 }] };
    mockMessageService.listRoomOfAdmin.mockResolvedValue(serviceResult);

    await messageController.listRoomOfAdmin(req, res);

    expect(mockMessageService.listRoomOfAdmin).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResult);
  });

  // TC_message_010: Kiểm tra controller trả lỗi server khi service throw exception.
  test('TC_message_010 - sendMessage should return generic server error on exception', async () => {
    const req = { body: { userId: 2, roomId: 10, text: 'hello' } };
    const res = createMockRes();
    mockMessageService.sendMessage.mockRejectedValue(new Error('boom'));

    await messageController.sendMessage(req, res);

    expect(mockMessageService.sendMessage).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      errCode: -1,
      errMessage: 'Error from server',
    });
    expect(consoleSpy).toHaveBeenCalled();
  });
});
