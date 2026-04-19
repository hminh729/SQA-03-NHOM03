// Unit tests for messageService.js
const messageService = require('../src/services/messageService');
const db = require('../src/models/index');

jest.mock('../src/models/index');

describe('MessageService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewRoom', () => {
    test('TC_MESSAGE_001: Should create new room successfully', async () => {
      const mockAdmin = { id: 999, email: 'chat@gmail.com' };
      
      db.User = {
        findOne: jest.fn().mockResolvedValue(mockAdmin)
      };
      
      db.RoomMessage = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 1 })
      };

      const result = await messageService.createNewRoom({ userId1: 1 });

      expect(result.errCode).toBe(0);
      expect(result.errMessage).toBe('ok');
    });

    test('TC_MESSAGE_002: Should handle missing userId1', async () => {
      const result = await messageService.createNewRoom({});

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameters !');
    });

    test('TC_MESSAGE_003: Should handle existing room', async () => {
      db.User = {
        findOne: jest.fn().mockResolvedValue({ id: 999 })
      };
      
      db.RoomMessage = {
        findOne: jest.fn().mockResolvedValue({ id: 1 })
      };

      const result = await messageService.createNewRoom({ userId1: 1 });

      expect(result.errCode).toBe(2);
      expect(result.errMessage).toBe('Da Co Phong');
    });
  });

  describe('sendMessage', () => {
    test('TC_MESSAGE_004: Should send message successfully', async () => {
      db.Message = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 1 })
      };

      const result = await messageService.sendMessage({
        userId: 1,
        roomId: 1,
        text: 'Hello world'
      });

      expect(result.errCode).toBe(0);
      expect(result.errMessage).toBe('ok');
    });

    test('TC_MESSAGE_005: Should handle missing parameters', async () => {
      const result = await messageService.sendMessage({
        userId: 1,
        text: ''
      });

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameters !');
    });

    test('TC_MESSAGE_006: Should deduplicate recent messages', async () => {
      db.Message = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 1 })
      };

      await messageService.sendMessage({
        userId: 1,
        roomId: 1,
        text: 'Test message'
      });

      const result = await messageService.sendMessage({
        userId: 1,
        roomId: 1,
        text: 'Test message'
      });

      expect(result.deduped).toBe(true);
    });
  });

  describe('loadMessage', () => {
    test('TC_MESSAGE_007: Should load messages successfully', async () => {
      const mockMessages = [
        { id: 1, text: 'Hello', userId: 1, roomId: 1 }
      ];

      db.Message = {
        update: jest.fn().mockResolvedValue([1]),
        findAll: jest.fn().mockResolvedValue(mockMessages)
      };

      db.User = {
        findOne: jest.fn().mockResolvedValue({ id: 1, image: null })
      };

      const result = await messageService.loadMessage({
        roomId: 1,
        userId: 1
      });

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_MESSAGE_008: Should handle missing roomId', async () => {
      const result = await messageService.loadMessage({ userId: 1 });

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameters !');
    });
  });

  describe('listRoomOfUser', () => {
    test('TC_MESSAGE_009: Should list user rooms successfully', async () => {
      const mockRooms = [
        { id: 1, userOne: 1, userTwo: 999 }
      ];

      db.RoomMessage = {
        findAll: jest.fn().mockResolvedValue(mockRooms)
      };

      db.Message = {
        findAll: jest.fn().mockResolvedValue([])
      };

      db.User = {
        findOne: jest.fn().mockResolvedValue({ id: 1, image: null })
      };

      const result = await messageService.listRoomOfUser(1);

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });

    test('TC_MESSAGE_010: Should handle missing userId', async () => {
      const result = await messageService.listRoomOfUser(null);

      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameters !');
    });
  });

  describe('listRoomOfAdmin', () => {
    test('TC_MESSAGE_011: Should list admin rooms successfully', async () => {
      const mockAdmin = { id: 999, email: 'chat@gmail.com' };
      const mockRooms = [
        { id: 1, userOne: 1, userTwo: 999 }
      ];

      db.User = {
        findOne: jest.fn().mockResolvedValue(mockAdmin)
      };

      db.RoomMessage = {
        findAll: jest.fn().mockResolvedValue(mockRooms)
      };

      db.Message = {
        findAll: jest.fn().mockResolvedValue([])
      };

      const result = await messageService.listRoomOfAdmin();

      expect(result.errCode).toBe(0);
      expect(result.data).toBeDefined();
    });
  });
});

