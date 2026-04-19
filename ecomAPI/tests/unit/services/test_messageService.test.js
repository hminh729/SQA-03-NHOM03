// Unit tests for messageService.js
const messageService = require('../../../src/services/messageService');
const db = require('../../../src/models/index');

jest.mock('../../../src/models/index');

describe('MessageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ===================== createNewRoom =====================
    describe('createNewRoom', () => {
        // TC_MS_001
        test('test_createNewRoom_success', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 999, email: 'chat@gmail.com' }) };
            db.RoomMessage = {
                findOne: jest.fn().mockResolvedValue(null),
                create: jest.fn().mockResolvedValue({ id: 1 })
            };
            const result = await messageService.createNewRoom({ userId1: 1 });
            expect(result.errCode).toBe(0);
        });

        // TC_MS_002
        test('test_createNewRoom_missing_userId', async () => {
            const result = await messageService.createNewRoom({});
            expect(result.errCode).toBe(1);
            expect(result.errMessage).toBe('Missing required parameters !');
        });

        // TC_MS_003
        test('test_createNewRoom_already_exists', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 999 }) };
            db.RoomMessage = { findOne: jest.fn().mockResolvedValue({ id: 1 }) };
            const result = await messageService.createNewRoom({ userId1: 1 });
            expect(result.errCode).toBe(2);
            expect(result.errMessage).toBe('Da Co Phong');
        });

        // TC_MS_004
        test('test_createNewRoom_admin_not_found', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue(null) };
            db.RoomMessage = { findOne: jest.fn().mockResolvedValue(null) };
            const result = await messageService.createNewRoom({ userId1: 1 });
            expect(result.errCode).toBe(3);
        });
    });

    // ===================== sendMessage =====================
    describe('sendMessage', () => {
        // TC_MS_005
        test('test_sendMessage_success', async () => {
            db.Message = {
                findOne: jest.fn().mockResolvedValue(null),
                create: jest.fn().mockResolvedValue({ id: 1 })
            };
            const result = await messageService.sendMessage({ userId: 1, roomId: 1, text: 'Hello' });
            expect(result.errCode).toBe(0);
        });

        // TC_MS_006
        test('test_sendMessage_missing_params', async () => {
            const result = await messageService.sendMessage({ userId: 1, roomId: 1, text: '' });
            expect(result.errCode).toBe(1);
        });

        // TC_MS_007
        test('test_sendMessage_missing_userId', async () => {
            const result = await messageService.sendMessage({ roomId: 1, text: 'Hello' });
            expect(result.errCode).toBe(1);
        });

        // TC_MS_008
        test('test_sendMessage_db_deduplicate', async () => {
            db.Message = {
                findOne: jest.fn().mockResolvedValue({ id: 1, text: 'Dup' }),
                create: jest.fn()
            };
            const result = await messageService.sendMessage({ userId: 99, roomId: 99, text: 'UniqueDedup' });
            expect(result.errCode).toBe(0);
            expect(result.deduped).toBe(true);
        });
    });

    // ===================== loadMessage =====================
    describe('loadMessage', () => {
        // TC_MS_009
        test('test_loadMessage_success', async () => {
            db.Message = {
                update: jest.fn().mockResolvedValue([1]),
                findAll: jest.fn().mockResolvedValue([])
            };
            const result = await messageService.loadMessage({ roomId: 1, userId: 1 });
            expect(result.errCode).toBe(0);
            expect(result.data).toBeDefined();
        });

        // TC_MS_010
        test('test_loadMessage_missing_roomId', async () => {
            const result = await messageService.loadMessage({ userId: 1 });
            expect(result.errCode).toBe(1);
        });

        // TC_MS_011
        test('test_loadMessage_with_messages', async () => {
            const mockMsg = { id: 1, text: 'Hi', userId: 2, roomId: 1 };
            db.Message = {
                update: jest.fn().mockResolvedValue([1]),
                findAll: jest.fn().mockResolvedValue([mockMsg])
            };
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 2, image: null }) };
            const result = await messageService.loadMessage({ roomId: 1, userId: 1 });
            expect(result.errCode).toBe(0);
            expect(result.data.length).toBe(1);
        });
    });

    // ===================== listRoomOfUser =====================
    describe('listRoomOfUser', () => {
        // TC_MS_012
        test('test_listRoomOfUser_success', async () => {
            db.RoomMessage = { findAll: jest.fn().mockResolvedValue([]) };
            const result = await messageService.listRoomOfUser(1);
            expect(result.errCode).toBe(0);
            expect(result.data).toEqual([]);
        });

        // TC_MS_013
        test('test_listRoomOfUser_missing_userId', async () => {
            const result = await messageService.listRoomOfUser(null);
            expect(result.errCode).toBe(1);
        });

        // TC_MS_014
        test('test_listRoomOfUser_with_rooms', async () => {
            const mockRoom = { id: 1, userOne: 1, userTwo: 999 };
            db.RoomMessage = { findAll: jest.fn().mockResolvedValue([mockRoom]) };
            db.Message = { findAll: jest.fn().mockResolvedValue([]) };
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 1, image: null }) };
            const result = await messageService.listRoomOfUser(1);
            expect(result.errCode).toBe(0);
            expect(result.data.length).toBe(1);
        });
    });

    // ===================== listRoomOfAdmin =====================
    describe('listRoomOfAdmin', () => {
        // TC_MS_015
        test('test_listRoomOfAdmin_success', async () => {
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 999 }) };
            db.RoomMessage = { findAll: jest.fn().mockResolvedValue([]) };
            const result = await messageService.listRoomOfAdmin();
            expect(result.errCode).toBe(0);
            expect(result.data).toEqual([]);
        });

        // TC_MS_016
        test('test_listRoomOfAdmin_with_rooms', async () => {
            const mockRoom = { id: 1, userOne: 1, userTwo: 999 };
            db.User = { findOne: jest.fn().mockResolvedValue({ id: 999 }) };
            db.RoomMessage = { findAll: jest.fn().mockResolvedValue([mockRoom]) };
            db.Message = { findAll: jest.fn().mockResolvedValue([]) };
            // findOne called for userOneData and userTwoData
            db.User.findOne = jest.fn().mockResolvedValue({ id: 1, image: null });
            const result = await messageService.listRoomOfAdmin();
            expect(result.errCode).toBe(0);
            expect(result.data.length).toBe(1);
        });
    });
});
