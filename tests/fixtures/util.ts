import { expect, type Mock } from "bun:test";

const decoder = new TextDecoder();

export function expectCallsInclude(
  mockFn: Mock<(arg: Uint8Array) => void>,
  expected: string,
) {
  let actual = "";

  for (let i = 0; i < mockFn.mock.calls.length; i++) {
    const call = mockFn.mock.calls[i];

    const arg = call[0] as Uint8Array;

    actual += decoder.decode(arg);
  }

  expect(actual).toContain(expected);
}
