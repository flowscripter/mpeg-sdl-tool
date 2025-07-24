import fs from "node:fs/promises";
import process from "node:process";
import path from "node:path";
import { describe, expect, test } from "bun:test";
import {
  DefaultPrinterService,
  DefaultSyntaxHighlighterService,
} from "@flowscripter/dynamic-cli-framework";
import highlightSyntaxSdl from "../../src/highlight/highlightSyntaxSdl";
import TtyTerminal from "@flowscripter/dynamic-cli-framework/src/service/printer/terminal/TtyTerminal";
import { Writable } from "node:stream";
import TtyStyler from "@flowscripter/dynamic-cli-framework/src/service/printer/terminal/TtyStyler";
import {
  createLenientSdlParser,
  prettyPrint,
  SdlStringInput,
} from "@mpeggroup/mpeg-sdl-parser";
import { buildAst } from "@mpeggroup/mpeg-sdl-parser/src/ast/buildAst";

describe("Highlight Plugin SDL tests", () => {
  test("Highlight test", async () => {
    const printer = new DefaultPrinterService(
      Writable.toWeb(process.stdout),
      Writable.toWeb(process.stderr),
      true,
      true,
      new TtyTerminal(process.stderr),
      new TtyStyler(3),
    );
    const syntaxHighlighterService = new DefaultSyntaxHighlighterService();

    printer.colorEnabled = true;

    syntaxHighlighterService.registerSyntax("sdl", highlightSyntaxSdl);
    syntaxHighlighterService.colorFunction = printer.color.bind(printer);

    const sampleSdlSpecification = await fs.readFile(
      path.join(__dirname, "../sample_specifications/various_elements.sdl"),
    ).then((buffer) => buffer.toString());

    const sdlStringInput = new SdlStringInput(sampleSdlSpecification);
    const parser = await createLenientSdlParser();

    const sdlParseTree = parser.parse(sdlStringInput);
    const sdlSpecification = buildAst(sdlParseTree, sdlStringInput);

    const prettifiedSdlSpecification = await prettyPrint(
      sdlSpecification,
      sdlStringInput,
    );
    const colorScheme = {
      keyword: "#f00000",
      string: "#f0f000",
      number: "#00f000",
      punctuation: "#00f0f0",
      operator: "#0000f0",
    };

    const highlighted = syntaxHighlighterService.highlight(
      prettifiedSdlSpecification,
      "sdl",
      colorScheme,
    );

    expect(highlighted).toMatchSnapshot();
  });
});
