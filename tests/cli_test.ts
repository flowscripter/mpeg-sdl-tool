import process from "node:process";
import { describe, expect, spyOn, test } from "bun:test";
import { cli } from "../src/cli.ts";

describe("MPEG SDL Tool tests", () => {
  test("CLI test", async () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });

    await expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(2);
    mockExit.mockRestore();
  });

  test("CLI invalid command invocation test", async () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });

    process.argv = ["", "", "validate"];

    await expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });

  test("CLI validate invocation on valid SDL test", async () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });

    process.argv = ["", "", "validate", "-i", "tests/sample_specifications/valid.sdl"];

    await expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(0);
    mockExit.mockRestore();
  });

  test("CLI validate invocation on invalid SDL test", async () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });

    process.argv = ["", "", "validate", "-i", "tests/sample_specifications/invalid.sdl"];

    await expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(0);
    mockExit.mockRestore();
  });
});
