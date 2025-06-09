import process from "node:process";
import { describe, expect, spyOn, test } from "bun:test";
import { cli } from "../src/cli.ts";
import { expectCallsInclude } from "./fixtures/util.ts";

describe("CLI tests", () => {
  test("CLI test", () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });
    const mockStderr = spyOn(process.stderr, "write").mockImplementation(() =>
      true
    );
    const mockStdout = spyOn(process.stdout, "write").mockImplementation(() =>
      true
    );

    expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(2);
    expectCallsInclude(mockStderr, "No command specified");
    expectCallsInclude(mockStdout, "Try running");
    mockExit.mockRestore();
  });

  test("CLI invalid command invocation test", () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });
    const mockStderr = spyOn(process.stderr, "write").mockImplementation(() =>
      true
    );

    process.argv = ["", "", "validate"];

    expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(1);
    expectCallsInclude(mockStderr, "Parse error");
    mockExit.mockRestore();
  });

  test("CLI validate invocation on valid SDL test", () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });
    const mockStderr = spyOn(process.stderr, "write").mockImplementation(() =>
      true
    );

    process.argv = [
      "",
      "",
      "validate",
      "-i",
      "tests/sample_specifications/various_elements.sdl",
    ];

    expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(0);
    expectCallsInclude(mockStderr, "is valid");
    mockExit.mockRestore();
  });

  test("CLI validate invocation on invalid SDL test", () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });
    const mockStderr = spyOn(process.stderr, "write").mockImplementation(() =>
      true
    );

    process.argv = [
      "",
      "",
      "validate",
      "-i",
      "tests/sample_specifications/invalid.sdl",
    ];

    expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(0);
    expectCallsInclude(mockStderr, "SYNTACTIC ERROR");
    mockExit.mockRestore();
  });

  test("CLI prettify invocation on valid SDL test", () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });
    const mockStderr = spyOn(process.stderr, "write").mockImplementation(() =>
      true
    );
    const mockStdout = spyOn(process.stdout, "write").mockImplementation(() =>
      true
    );

    process.argv = [
      "",
      "",
      "prettify",
      "-i",
      "tests/sample_specifications/various_elements.sdl",
    ];

    expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(0);
    expectCallsInclude(mockStderr, "Syntactic Description Language");
    expectCallsInclude(mockStdout, "bitstream");
    mockExit.mockRestore();
  });

  test("CLI prettify invocation on invalid SDL test", () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });
    const mockStderr = spyOn(process.stderr, "write").mockImplementation(() =>
      true
    );

    process.argv = [
      "",
      "",
      "prettify",
      "-i",
      "tests/sample_specifications/invalid.sdl",
    ];

    expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(0);
    expectCallsInclude(mockStderr, "SYNTACTIC ERROR");
    mockExit.mockRestore();
  });
});
