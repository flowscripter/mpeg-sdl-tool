import fs from "node:fs/promises";
import path from "node:path";
import { describe, test } from "bun:test";
import prettierPluginSdl from "../../src/prettier/prettierPluginSdl";
import { DefaultPrettyPrinterService } from "@flowscripter/dynamic-cli-framework";

describe("Prettier Plugin SDL tests", () => {
  test("Prettify test", async () => {
    const prettyPrinterService = new DefaultPrettyPrinterService();
    prettyPrinterService.registerSyntax("sdl", prettierPluginSdl);

    const sampleSdlSpecification = await fs.readFile(
      path.join(__dirname, "../sample_specifications/various_elements.sdl"),
    ).then((buffer) => buffer.toString());

    console.error(
      await prettyPrinterService.prettify(sampleSdlSpecification, "sdl"),
    );
  });
});
