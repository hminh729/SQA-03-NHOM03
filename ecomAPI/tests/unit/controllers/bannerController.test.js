/**
 * BANNER CONTROLLER TEST SUITE
 * =============================
 * Module: ecomAPI/src/controllers/bannerController.js
 * Test Framework: Jest
 *
 * DESCRIPTION:
 * Unit tests for Banner Controller covering all CRUD operations:
 * - createNewBanner
 * - getDetailBanner
 * - getAllBanner
 * - updateBanner
 * - deleteBanner
 *
 * NOTE ON DB TESTING:
 * - This is a CONTROLLER LAYER test (NOT service layer)
 * - bannerController calls bannerService (mocked here)
 * - Service layer is responsible for DB operations
 * - CheckDB & Rollback responsibility: bannerService test suite
 *
 * TEST APPROACH:
 * - Unit Testing: Mock bannerService for isolation
 * - Mock HTTP req/res objects
 * - Verify correct service calls and response handling
 */

import bannerController from "../src/controllers/bannerController";
import bannerService from "../src/services/bannerService";

// Mock the service layer to isolate controller testing
jest.mock("../src/services/bannerService");

describe("=== BANNER CONTROLLER TEST SUITE ===", () => {
  /**
   * SETUP: Initialize mock objects before each test
   * This ensures clean state for every test case
   */
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    // TC_SETUP: Create mock request object
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };

    // TC_SETUP: Create mock response object with chainable methods
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // TC_SETUP: Clear all mock calls before each test
    jest.clearAllMocks();
  });

  // =====================================================
  // TEST SUITE 1: CREATE NEW BANNER TESTS
  // =====================================================
  describe("TEST SUITE 1: createNewBanner() Function", () => {
    /**
     * TC_001: Create New Banner - Success Case
     *
     * Objective: Verify successful banner creation with valid data
     * Input: Valid banner data (name, description, image)
     * Expected Output: HTTP 200 with errCode 0 (success)
     *
     * Test Flow:
     * 1. Arrange: Setup valid banner data in request body
     * 2. Mock service to return success response
     * 3. Act: Call createNewBanner controller
     * 4. Assert: Verify response status and data
     */
    test("TC_001: Should successfully create new banner with valid data", async () => {
      // Arrange: Prepare input data
      const validBannerData = {
        name: "Summer Sale 2024",
        description: "Big summer discount up to 50%",
        image: "base64_encoded_image_data_here",
      };
      mockRequest.body = validBannerData;

      // Mock service successful response
      const mockServiceResponse = {
        errCode: 0,
        errMessage: "ok",
      };
      bannerService.createNewBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller function
      await bannerController.createNewBanner(mockRequest, mockResponse);

      // Assert: Verify correct response
      expect(bannerService.createNewBanner).toHaveBeenCalledWith(
        validBannerData,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_002: Create New Banner - Missing Required Field
     *
     * Objective: Verify error handling when required field is missing
     * Input: Incomplete banner data (missing name field)
     * Expected Output: Service returns error, controller returns HTTP 200 with error code
     *
     * Validation:
     * - Service should validate missing parameters (name, description, image)
     * - Service returns errCode 1 for validation failure
     */
    test("TC_002: Should handle missing required field (name)", async () => {
      // Arrange: Prepare incomplete data
      const incompleteBannerData = {
        description: "Missing name field",
        image: "base64_image",
        // name field is intentionally missing
      };
      mockRequest.body = incompleteBannerData;

      // Mock service validation error response
      const mockServiceResponse = {
        errCode: 1,
        errMessage: "Missing required parameter !",
      };
      bannerService.createNewBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.createNewBanner(mockRequest, mockResponse);

      // Assert: Verify error response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_003: Create New Banner - Database Error
     *
     * Objective: Verify error handling when database operation fails
     * Input: Valid banner data (but DB connection fails)
     * Expected Output: HTTP 200 with errCode -1 (server error)
     *
     * Scenario: Service throws database exception
     * Controller should catch exception and return standardized error
     */
    test("TC_003: Should handle database error during banner creation", async () => {
      // Arrange: Setup valid data but mock DB error
      const validData = {
        name: "Test Banner",
        description: "Test Description",
        image: "test_image",
      };
      mockRequest.body = validData;

      // Mock service throwing database error
      bannerService.createNewBanner.mockRejectedValue(
        new Error("Database connection failed"),
      );

      // Act: Execute controller
      await bannerController.createNewBanner(mockRequest, mockResponse);

      // Assert: Verify error handling
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 2: GET DETAIL BANNER TESTS
  // =====================================================
  describe("TEST SUITE 2: getDetailBanner() Function", () => {
    /**
     * TC_004: Get Banner Detail - Success Case
     *
     * Objective: Retrieve single banner details by ID
     * Input: Valid banner ID in query parameter
     * Expected Output: HTTP 200 with banner data object
     *
     * Data Structure:
     * - Banner ID must exist in database
     * - Image is converted from base64 to binary
     */
    test("TC_004: Should retrieve banner detail by valid ID", async () => {
      // Arrange: Set query parameter
      const bannerId = 5;
      mockRequest.query.id = bannerId;

      // Mock service response with banner data
      const mockBannerData = {
        id: 5,
        name: "Banner 5",
        description: "Description of Banner 5",
        image: "binary_image_data",
        statusId: "S1",
      };
      const mockServiceResponse = {
        errCode: 0,
        data: mockBannerData,
      };
      bannerService.getDetailBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.getDetailBanner(mockRequest, mockResponse);

      // Assert: Verify response
      expect(bannerService.getDetailBanner).toHaveBeenCalledWith(bannerId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_005: Get Banner Detail - Missing ID Parameter
     *
     * Objective: Verify error handling when ID parameter is missing
     * Input: No ID in query parameter (undefined)
     * Expected Output: Service returns validation error (errCode 1)
     */
    test("TC_005: Should handle missing ID parameter", async () => {
      // Arrange: No ID in query
      mockRequest.query.id = undefined;

      // Mock service validation response
      const mockServiceResponse = {
        errCode: 1,
        errMessage: "Missing required parameter !",
      };
      bannerService.getDetailBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.getDetailBanner(mockRequest, mockResponse);

      // Assert: Verify error response
      expect(bannerService.getDetailBanner).toHaveBeenCalledWith(undefined);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_006: Get Banner Detail - Non-existent ID
     *
     * Objective: Verify handling when ID exists but banner not found
     * Input: Valid ID format but banner doesn't exist in database
     * Expected Output: HTTP 200 with errCode 0 but data is null/undefined
     */
    test("TC_006: Should return null data for non-existent banner ID", async () => {
      // Arrange: Setup non-existent ID
      mockRequest.query.id = 9999;

      // Mock service response - banner not found
      const mockServiceResponse = {
        errCode: 0,
        data: null,
      };
      bannerService.getDetailBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.getDetailBanner(mockRequest, mockResponse);

      // Assert: Verify response
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_007: Get Banner Detail - Database Error
     *
     * Objective: Verify error handling when database query fails
     * Input: Valid ID but database connection error
     * Expected Output: HTTP 200 with errCode -1
     */
    test("TC_007: Should handle database error in getDetailBanner", async () => {
      // Arrange: Setup valid ID
      mockRequest.query.id = 1;

      // Mock database error
      bannerService.getDetailBanner.mockRejectedValue(
        new Error("Database query failed"),
      );

      // Act: Execute controller
      await bannerController.getDetailBanner(mockRequest, mockResponse);

      // Assert: Verify error response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 3: GET ALL BANNERS TESTS
  // =====================================================
  describe("TEST SUITE 3: getAllBanner() Function", () => {
    /**
     * TC_008: Get All Banners - Without Pagination
     *
     * Objective: Retrieve all active banners without pagination
     * Input: Empty query parameters (no limit/offset)
     * Expected Output: Array of all banners with count
     *
     * Business Logic:
     * - Only retrieve banners with statusId 'S1' (active)
     * - Return full list without pagination
     */
    test("TC_008: Should retrieve all banners without pagination", async () => {
      // Arrange: No pagination parameters
      mockRequest.query = {};

      // Mock service response
      const mockBannersList = [
        { id: 1, name: "Banner 1", statusId: "S1" },
        { id: 2, name: "Banner 2", statusId: "S1" },
        { id: 3, name: "Banner 3", statusId: "S1" },
      ];
      const mockServiceResponse = {
        errCode: 0,
        data: mockBannersList,
        count: 3,
      };
      bannerService.getAllBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.getAllBanner(mockRequest, mockResponse);

      // Assert: Verify response
      expect(bannerService.getAllBanner).toHaveBeenCalledWith({});
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_009: Get All Banners - With Pagination
     *
     * Objective: Retrieve paginated list of banners
     * Input: limit=10, offset=0
     * Expected Output: First 10 banners with total count
     *
     * Pagination Details:
     * - limit: number of records per page
     * - offset: starting position (0-based)
     */
    test("TC_009: Should retrieve paginated banners", async () => {
      // Arrange: Setup pagination parameters
      mockRequest.query = {
        limit: "10",
        offset: "0",
      };

      // Mock paginated response
      const mockPaginatedList = [
        { id: 1, name: "Banner 1" },
        { id: 2, name: "Banner 2" },
      ];
      const mockServiceResponse = {
        errCode: 0,
        data: mockPaginatedList,
        count: 50, // Total records in database
      };
      bannerService.getAllBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.getAllBanner(mockRequest, mockResponse);

      // Assert: Verify pagination parameters sent to service
      expect(bannerService.getAllBanner).toHaveBeenCalledWith({
        limit: "10",
        offset: "0",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_010: Get All Banners - With Keyword Search
     *
     * Objective: Search banners by keyword
     * Input: keyword="Summer"
     * Expected Output: Banners matching keyword (SQL SUBSTRING match)
     */
    test("TC_010: Should filter banners by keyword", async () => {
      // Arrange: Setup search keyword
      mockRequest.query = {
        keyword: "Summer",
      };

      // Mock search results
      const mockSearchResults = [
        { id: 1, name: "Summer Sale 2024" },
        { id: 3, name: "Early Summer Collection" },
      ];
      const mockServiceResponse = {
        errCode: 0,
        data: mockSearchResults,
        count: 2,
      };
      bannerService.getAllBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.getAllBanner(mockRequest, mockResponse);

      // Assert: Verify search was performed
      expect(bannerService.getAllBanner).toHaveBeenCalledWith({
        keyword: "Summer",
      });
    });

    /**
     * TC_011: Get All Banners - Empty Result
     *
     * Objective: Handle case when no banners exist
     * Input: Search with keyword that returns no results
     * Expected Output: Empty array with count 0
     */
    test("TC_011: Should return empty list when no banners exist", async () => {
      // Arrange: Setup query
      mockRequest.query = {};

      // Mock empty result
      const mockServiceResponse = {
        errCode: 0,
        data: [],
        count: 0,
      };
      bannerService.getAllBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.getAllBanner(mockRequest, mockResponse);

      // Assert: Verify empty response
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [],
          count: 0,
        }),
      );
    });

    /**
     * TC_012: Get All Banners - Database Error
     *
     * Objective: Handle database errors gracefully
     * Input: Valid query but database unavailable
     * Expected Output: HTTP 200 with errCode -1
     */
    test("TC_012: Should handle database error in getAllBanner", async () => {
      // Arrange: Setup valid query
      mockRequest.query = {};

      // Mock database error
      bannerService.getAllBanner.mockRejectedValue(
        new Error("Database connection lost"),
      );

      // Act: Execute controller
      await bannerController.getAllBanner(mockRequest, mockResponse);

      // Assert: Verify error response
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 4: UPDATE BANNER TESTS
  // =====================================================
  describe("TEST SUITE 4: updateBanner() Function", () => {
    /**
     * TC_013: Update Banner - Success Case
     *
     * Objective: Successfully update existing banner
     * Input: Complete update data (id, name, description, image)
     * Expected Output: HTTP 200 with errCode 0
     *
     * Update Fields:
     * - name: Banner name
     * - description: Banner description
     * - image: Base64 encoded image
     */
    test("TC_013: Should successfully update banner with valid data", async () => {
      // Arrange: Prepare update data
      const updateData = {
        id: 5,
        name: "Updated Banner Name",
        description: "Updated description",
        image: "new_base64_image_data",
      };
      mockRequest.body = updateData;

      // Mock service success response
      const mockServiceResponse = {
        errCode: 0,
        errMessage: "ok",
      };
      bannerService.updateBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.updateBanner(mockRequest, mockResponse);

      // Assert: Verify update call and response
      expect(bannerService.updateBanner).toHaveBeenCalledWith(updateData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_014: Update Banner - Missing Required Field
     *
     * Objective: Verify validation when update field is missing
     * Input: Missing 'name' field in update data
     * Expected Output: Service returns validation error (errCode 1)
     */
    test("TC_014: Should handle missing required field in update", async () => {
      // Arrange: Incomplete update data
      const incompleteData = {
        id: 5,
        // name is missing
        description: "Updated description",
        image: "image_data",
      };
      mockRequest.body = incompleteData;

      // Mock validation error
      const mockServiceResponse = {
        errCode: 1,
        errMessage: "Missing required parameter !",
      };
      bannerService.updateBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.updateBanner(mockRequest, mockResponse);

      // Assert: Verify error response
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_015: Update Banner - Non-existent ID
     *
     * Objective: Handle update when banner ID doesn't exist
     * Input: Valid update data but banner doesn't exist
     * Expected Output: Service returns error (banner not found)
     */
    test("TC_015: Should handle non-existent banner ID in update", async () => {
      // Arrange: Setup data with non-existent ID
      const updateData = {
        id: 9999,
        name: "Updated Name",
        description: "Updated Description",
        image: "image",
      };
      mockRequest.body = updateData;

      // Mock not found response
      const mockServiceResponse = {
        errCode: 2,
        errMessage: "Banner not found",
      };
      bannerService.updateBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.updateBanner(mockRequest, mockResponse);

      // Assert: Verify response
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_016: Update Banner - Database Error
     *
     * Objective: Handle database errors during update
     * Input: Valid update data but database error
     * Expected Output: HTTP 200 with errCode -1
     */
    test("TC_016: Should handle database error in updateBanner", async () => {
      // Arrange: Valid data
      mockRequest.body = {
        id: 5,
        name: "Updated",
        description: "Updated",
        image: "image",
      };

      // Mock database error
      bannerService.updateBanner.mockRejectedValue(
        new Error("Database update failed"),
      );

      // Act: Execute controller
      await bannerController.updateBanner(mockRequest, mockResponse);

      // Assert: Verify error response
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });
    });
  });

  // =====================================================
  // TEST SUITE 5: DELETE BANNER TESTS
  // =====================================================
  describe("TEST SUITE 5: deleteBanner() Function", () => {
    /**
     * TC_017: Delete Banner - Success Case
     *
     * Objective: Successfully delete a banner
     * Input: Valid banner ID in request body
     * Expected Output: HTTP 200 with errCode 0
     *
     * DB Impact:
     * - Banner record is soft-deleted or marked inactive
     * - CheckDB: Verify banner statusId changed to 'S2' (inactive)
     * - Rollback: After test, banner should be restored to 'S1'
     */
    test("TC_017: Should successfully delete banner with valid ID", async () => {
      // Arrange: Prepare delete data
      const deleteData = {
        id: 5,
      };
      mockRequest.body = deleteData;

      // Mock service success response
      const mockServiceResponse = {
        errCode: 0,
        errMessage: "ok",
      };
      bannerService.deleteBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.deleteBanner(mockRequest, mockResponse);

      // Assert: Verify delete call
      expect(bannerService.deleteBanner).toHaveBeenCalledWith(deleteData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);

      /**
       * NOTE: CheckDB would be performed at SERVICE LAYER test:
       * - Query database to verify banner statusId = 'S2'
       * - Verify deleteAt timestamp is set
       *
       * NOTE: Rollback would restore:
       * - UPDATE banners SET statusId='S1' WHERE id=5
       * - CLEAR deleteAt timestamp
       */
    });

    /**
     * TC_018: Delete Banner - Missing ID
     *
     * Objective: Handle delete when ID is missing
     * Input: Empty request body (no ID)
     * Expected Output: Service returns validation error
     */
    test("TC_018: Should handle missing ID in delete request", async () => {
      // Arrange: No ID provided
      mockRequest.body = {};

      // Mock validation error
      const mockServiceResponse = {
        errCode: 1,
        errMessage: "Missing required parameter !",
      };
      bannerService.deleteBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.deleteBanner(mockRequest, mockResponse);

      // Assert: Verify error response
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_019: Delete Banner - Non-existent ID
     *
     * Objective: Handle delete when banner doesn't exist
     * Input: Valid ID format but banner not found
     * Expected Output: Service returns not found error
     */
    test("TC_019: Should handle deletion of non-existent banner", async () => {
      // Arrange: Setup non-existent ID
      mockRequest.body = {
        id: 9999,
      };

      // Mock not found response
      const mockServiceResponse = {
        errCode: 2,
        errMessage: "Banner not found",
      };
      bannerService.deleteBanner.mockResolvedValue(mockServiceResponse);

      // Act: Execute controller
      await bannerController.deleteBanner(mockRequest, mockResponse);

      // Assert: Verify response
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    /**
     * TC_020: Delete Banner - Database Error
     *
     * Objective: Handle database errors during deletion
     * Input: Valid ID but database error
     * Expected Output: HTTP 200 with errCode -1
     *
     * Rollback Verification:
     * - After error, database should be unchanged
     * - No deletion should occur
     * - Banner should remain with original statusId
     */
    test("TC_020: Should handle database error in deleteBanner", async () => {
      // Arrange: Valid ID
      mockRequest.body = {
        id: 5,
      };

      // Mock database error
      bannerService.deleteBanner.mockRejectedValue(
        new Error("Database delete failed"),
      );

      // Act: Execute controller
      await bannerController.deleteBanner(mockRequest, mockResponse);

      // Assert: Verify error response
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: -1,
        errMessage: "Error from server",
      });

      /**
       * NOTE: Rollback verification at SERVICE LAYER:
       * - Verify banner statusId is unchanged ('S1' if not deleted)
       * - Verify no partial update occurred
       * - Verify deleteAt timestamp is null
       */
    });

    /**
     * TC_021: Delete Banner - Concurrent Delete Requests
     *
     * Objective: Handle race conditions in concurrent deletes
     * Input: Multiple delete requests for same banner ID
     * Expected Output: First succeeds, subsequent return not found
     */
    test("TC_021: Should handle concurrent delete requests safely", async () => {
      // Arrange: Prepare multiple delete requests
      const deleteData = { id: 5 };
      mockRequest.body = deleteData;

      // First call succeeds
      bannerService.deleteBanner.mockResolvedValueOnce({
        errCode: 0,
        errMessage: "ok",
      });

      // Act: First delete
      await bannerController.deleteBanner(mockRequest, mockResponse);

      // Assert: First delete succeeds
      expect(mockResponse.json).toHaveBeenCalledWith({
        errCode: 0,
        errMessage: "ok",
      });

      // Arrange: Second call returns not found
      bannerService.deleteBanner.mockResolvedValueOnce({
        errCode: 2,
        errMessage: "Banner not found",
      });

      // Act: Second delete
      await bannerController.deleteBanner(mockRequest, mockResponse);

      // Assert: Second delete returns not found
      expect(mockResponse.json).toHaveBeenLastCalledWith({
        errCode: 2,
        errMessage: "Banner not found",
      });
    });
  });

  // =====================================================
  // TEST SUITE 6: EDGE CASES & SECURITY
  // =====================================================
  describe("TEST SUITE 6: Edge Cases & Security Tests", () => {
    /**
     * TC_022: Response Format Consistency
     *
     * Objective: Verify all responses follow standard format
     * Expected: Every response has errCode and errMessage
     */
    test("TC_022: Should return consistent response format", async () => {
      // Arrange: Test with various scenarios
      mockRequest.body = { name: "Test" };
      bannerService.createNewBanner.mockResolvedValue({
        errCode: 1,
        errMessage: "Missing required parameter !",
      });

      // Act: Execute
      await bannerController.createNewBanner(mockRequest, mockResponse);

      // Assert: Check format
      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs).toHaveProperty("errCode");
      expect(callArgs).toHaveProperty("errMessage");
      expect(typeof callArgs.errCode).toBe("number");
      expect(typeof callArgs.errMessage).toBe("string");
    });

    /**
     * TC_023: SQL Injection Prevention (via Service Layer)
     *
     * Objective: Verify malicious input doesn't cause SQL injection
     * Note: Service layer should sanitize, controller should pass through
     *
     * Test that controller properly passes data to service
     * Service layer is responsible for parameterized queries
     */
    test("TC_023: Should safely handle special characters in input", async () => {
      // Arrange: Malicious-like input
      const suspiciousData = {
        name: "' OR '1'='1",
        description: "test<script>alert('xss')</script>",
        image: "test_image",
      };
      mockRequest.body = suspiciousData;

      // Mock service with safe parameterized queries
      bannerService.createNewBanner.mockResolvedValue({
        errCode: 0,
        errMessage: "ok",
      });

      // Act: Execute
      await bannerController.createNewBanner(mockRequest, mockResponse);

      // Assert: Service was called with untouched data
      // (Service layer should handle escaping/parameterization)
      expect(bannerService.createNewBanner).toHaveBeenCalledWith(
        suspiciousData,
      );
    });

    /**
     * TC_024: Null Body Handling
     *
     * Objective: Handle null request body gracefully
     * Input: null request body
     * Expected: Proper error response (handled by service)
     */
    test("TC_024: Should handle null request body", async () => {
      // Arrange: Null body
      mockRequest.body = null;

      // Mock service error
      bannerService.createNewBanner.mockResolvedValue({
        errCode: 1,
        errMessage: "Invalid data",
      });

      // Act: Execute
      await bannerController.createNewBanner(mockRequest, mockResponse);

      // Assert: Error handled
      expect(mockResponse.json).toHaveBeenCalled();
    });

    /**
     * TC_025: Undefined Parameters
     *
     * Objective: Handle undefined values safely
     * Input: undefined in query or body
     * Expected: Service layer validates and returns error
     */
    test("TC_025: Should handle undefined parameters", async () => {
      // Arrange: Undefined query
      mockRequest.query.id = undefined;

      // Mock service validation
      bannerService.getDetailBanner.mockResolvedValue({
        errCode: 1,
        errMessage: "Missing required parameter !",
      });

      // Act: Execute
      await bannerController.getDetailBanner(mockRequest, mockResponse);

      // Assert: Handled properly
      expect(bannerService.getDetailBanner).toHaveBeenCalledWith(undefined);
    });
  });

  /**
   * CLEANUP: After all tests
   * Verify no mock leaks
   */
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
