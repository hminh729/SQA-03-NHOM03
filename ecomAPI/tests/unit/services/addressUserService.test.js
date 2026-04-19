/**
 * ADDRESS USER SERVICE TEST SUITE
 * =============================
 * Module: ecomAPI/src/services/addressUserService.js
 */

import addressUserService from "../src/services/addressUserService";
import db from "../src/models/index";

// Mock the database models
jest.mock("../src/models/index", () => ({
  AddressUser: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe("=== ADDRESS USER SERVICE TEST SUITE ===", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewAddressUser", () => {
    test("Should return error if missing userId", async () => {
      const result = await addressUserService.createNewAddressUser({});
      expect(result.errCode).toBe(1);
      expect(result.errMessage).toBe('Missing required parameter !');
    });

    test("Should create address successfully", async () => {
      const data = { userId: 1, shipName: 'Test', shipAdress: 'Addr', shipEmail: 'e@e.com', shipPhonenumber: '123' };
      db.AddressUser.create.mockResolvedValue(data);
      const result = await addressUserService.createNewAddressUser(data);
      expect(db.AddressUser.create).toHaveBeenCalledWith(data);
      expect(result.errCode).toBe(0);
    });
  });

  describe("getAllAddressUserByUserId", () => {
    test("Should return error if missing userId", async () => {
      const result = await addressUserService.getAllAddressUserByUserId(null);
      expect(result.errCode).toBe(1);
    });

    test("Should get all addresses for user", async () => {
      db.AddressUser.findAll.mockResolvedValue([{ id: 1 }]);
      const result = await addressUserService.getAllAddressUserByUserId(1);
      expect(db.AddressUser.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result.errCode).toBe(0);
      expect(result.data).toHaveLength(1);
    });
  });

  describe("deleteAddressUser", () => {
    test("Should return error if missing id", async () => {
      const result = await addressUserService.deleteAddressUser({});
      expect(result.errCode).toBe(1);
    });

    test("Should delete address successfully", async () => {
      db.AddressUser.findOne.mockResolvedValue({ id: 1 });
      db.AddressUser.destroy.mockResolvedValue(1);
      const result = await addressUserService.deleteAddressUser({ id: 1 });
      expect(result.errCode).toBe(0);
    });

    test("Should return error if address not found", async () => {
      db.AddressUser.findOne.mockResolvedValue(null);
      const result = await addressUserService.deleteAddressUser({ id: 1 });
      expect(result.errCode).toBe(-1);
    });
  });

  describe("editAddressUser", () => {
    test("Should return error if missing parameters", async () => {
      const result = await addressUserService.editAddressUser({ id: 1 });
      expect(result.errCode).toBe(1);
    });

    test("Should edit address successfully", async () => {
      const mockAddress = { 
        id: 1, 
        save: jest.fn().mockResolvedValue(true) 
      };
      db.AddressUser.findOne.mockResolvedValue(mockAddress);
      
      const data = { id: 1, shipName: 'N', shipAdress: 'A', shipEmail: 'E', shipPhonenumber: 'P' };
      const result = await addressUserService.editAddressUser(data);
      
      expect(mockAddress.shipName).toBe('N');
      expect(mockAddress.save).toHaveBeenCalled();
      expect(result.errCode).toBe(0);
    });
  });

  describe("getDetailAddressUserById", () => {
    test("Should get detail address", async () => {
      db.AddressUser.findOne.mockResolvedValue({ id: 1 });
      const result = await addressUserService.getDetailAddressUserById(1);
      expect(result.errCode).toBe(0);
      expect(result.data.id).toBe(1);
    });
  });
});
