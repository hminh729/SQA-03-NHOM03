/**
 * PYTHON INVOKER TEST SUITE
 * =============================
 * Module: ecomAPI/src/services/pythonInvoker.js
 */

import pythonInvoker from "../../../src/services/pythonInvoker";
import { spawn } from "child_process";
import { EventEmitter } from "events";

// Mock child_process
jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));

describe("=== PYTHON INVOKER TEST SUITE ===", () => {
  let mockProcess;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Setup a mock process object
    mockProcess = new EventEmitter();
    mockProcess.stdout = new EventEmitter();
    mockProcess.stderr = new EventEmitter();
    mockProcess.stdin = {
      write: jest.fn(),
      end: jest.fn(),
    };
    mockProcess.pid = 1234;
    mockProcess.kill = jest.fn();

    spawn.mockReturnValue(mockProcess);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("runPythonInference success case", async () => {
    const payload = { test: 123 };
    const mockOutput = JSON.stringify({ ok: true, items: [1, 2, 3] });

    const promise = pythonInvoker.runPythonInference(payload);

    // Simulate Python outputting JSON and exiting
    mockProcess.stdout.emit("data", Buffer.from(mockOutput));
    mockProcess.emit("close", 0);

    const result = await promise;

    expect(result.ok).toBe(true);
    expect(result.items).toEqual([1, 2, 3]);
    expect(mockProcess.stdin.write).toHaveBeenCalledWith(
      JSON.stringify(payload) + require("os").EOL,
    );
  });

  test("runPythonInference failure case (exit code 1)", async () => {
    const promise = pythonInvoker.runPythonInference({});

    mockProcess.stderr.emit("data", Buffer.from("error message"));
    mockProcess.emit("close", 1);

    const result = await promise;

    expect(result.ok).toBe(false);
    expect(result.error).toBe("exit_code_1");
    expect(result.stderr).toBe("error message");
  });

  test("runPythonInference invalid JSON case", async () => {
    const promise = pythonInvoker.runPythonInference({});

    mockProcess.stdout.emit("data", Buffer.from("not a json"));
    mockProcess.emit("close", 0);

    const result = await promise;

    expect(result.ok).toBe(false);
    expect(result.error).toBe("invalid_json");
  });

  test("runPythonInference timeout case", async () => {
    const timeoutMs = 1000;
    const promise = pythonInvoker.runPythonInference({}, { timeoutMs });

    // Fast-forward time
    jest.advanceTimersByTime(timeoutMs + 100);

    const result = await promise;

    expect(result.ok).toBe(false);
    expect(result.error).toBe("timeout");

    if (process.platform === "win32") {
      // On Windows it calls taskkill
      expect(spawn).toHaveBeenCalledWith("taskkill", expect.anything());
    } else {
      expect(mockProcess.kill).toHaveBeenCalledWith("SIGKILL");
    }
  });

  test("runPythonInference exception handled", async () => {
    spawn.mockImplementationOnce(() => {
      throw new Error("Spawn error");
    });

    const result = await pythonInvoker.runPythonInference({});
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Spawn error");
  });
});
