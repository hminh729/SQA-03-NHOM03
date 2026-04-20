import { EXCHANGE_RATES } from "../../../src/utils/constants";

describe("=== CONSTANTS TEST SUITE ===", () => {
  test("EXCHANGE_RATES should be defined correctly", () => {
    expect(EXCHANGE_RATES).toBeDefined();
    expect(EXCHANGE_RATES.USD).toBe(24300);
    expect(typeof EXCHANGE_RATES.USD).toBe("number");
  });
});
