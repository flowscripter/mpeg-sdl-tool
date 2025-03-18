import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  type ArgumentValues,
  ArgumentValueTypeName,
  type Context,
  Icon,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
  SYNTAX_HIGHLIGHTER_SERVICE_ID,
  type SyntaxHighlighterService,
} from "@flowscripter/dynamic-cli-framework";
import sdl from "./sdl";
import { Parser } from "@flowscripter/mpeg-sdl-parser";

const prettify: SubCommand = {
  name: "prettify",
  description: "Parse and prettify an SDL file",
  options: [
    {
      name: "input",
      description: "Input SDL file path",
      type: ArgumentValueTypeName.STRING,
      shortAlias: "i",
    },
  ],
  positionals: [],
  usageExamples: [],
  async execute(
    context: Context,
    argumentValues: ArgumentValues,
  ): Promise<void> {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const highlighterService = context.getServiceById(
      SYNTAX_HIGHLIGHTER_SERVICE_ID,
    ) as SyntaxHighlighterService;

    highlighterService.registerSyntax("sdl", sdl);

    const parser = new Parser();

    const inputSdlFilePath = argumentValues.input as string;

    const sdlSpecification = await fs.readFile(
      path.join(process.cwd(), inputSdlFilePath),
    ).then((buffer) => buffer.toString());

    try {
      parser.parse(sdlSpecification);
    } catch (error) {
      printerService.error(
        `SDL file ${inputSdlFilePath} is invalid\n`,
        Icon.FAILURE,
      );
      if (error instanceof Error) {
        printerService.warn(error.message + "\n");
      } else {
        printerService.warn(String(error) + "\n");
      }

      return;
    }

    await printerService.print(
      highlighterService.highlight(
        sdlSpecification,
        "sdl",
      ) + "\n",
    );
  },
};

export default prettify;
