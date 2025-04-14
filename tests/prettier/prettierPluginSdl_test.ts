import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "bun:test";
import prettierPluginSdl from "../../src/prettier/prettierPluginSdl";
import { DefaultPrettyPrinterService } from "@flowscripter/dynamic-cli-framework";
import { Parser } from "@flowscripter/mpeg-sdl-parser";

describe("Prettier Plugin SDL tests", () => {
  test("Prettify test", async () => {
    const prettyPrinterService = new DefaultPrettyPrinterService();
    prettyPrinterService.registerSyntax("sdl", prettierPluginSdl);

    const sampleSdlSpecification = await fs.readFile(
      path.join(__dirname, "../sample_specifications/various_elements.sdl"),
    ).then((buffer) => buffer.toString());

    const prettified = await prettyPrinterService.prettify(
      sampleSdlSpecification,
      "sdl",
    );

    expect(prettified).toMatchSnapshot();
  });

  test("Prettify test - prettified output is valid", async () => {
    const prettyPrinterService = new DefaultPrettyPrinterService();
    prettyPrinterService.registerSyntax("sdl", prettierPluginSdl);

    const sampleSdlSpecification = await fs.readFile(
      path.join(__dirname, "../sample_specifications/various_elements.sdl"),
    ).then((buffer) => buffer.toString());

    const prettified = await prettyPrinterService.prettify(
      sampleSdlSpecification,
      "sdl",
    );

    const parser = new Parser();

    parser.parse(prettified);
  });
});
