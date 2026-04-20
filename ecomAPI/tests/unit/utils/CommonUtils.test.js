import CommonUtils from "../../../src/utils/CommonUtils";
import JWT from "jsonwebtoken";

describe("=== COMMON UTILS TEST SUITE ===", () => {
  const userId = 123;
  const secret = process.env.JWT_SECRET || "secret"; // Fallback if env not loaded in test

  test("encodeToken should return a valid JWT", () => {
    const token = CommonUtils.encodeToken(userId);
    expect(typeof token).toBe("string");

    const decoded = JWT.decode(token);
    expect(decoded.iss).toBe("Bi Ngo");
    expect(decoded.sub).toBe(userId);
  });

  test("encodeToken should have expiration and issue timestamp", () => {
    const token = CommonUtils.encodeToken(userId);
    const decoded = JWT.decode(token);
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});
