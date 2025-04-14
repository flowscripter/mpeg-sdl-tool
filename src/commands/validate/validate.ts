import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  type ArgumentValues,
  ArgumentValueTypeName,
  type Context,
  Icon,
  Level,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
  SYNTAX_HIGHLIGHTER_SERVICE_ID,
  type SyntaxHighlighterService,
} from "@flowscripter/dynamic-cli-framework";
import { Parser } from "@flowscripter/mpeg-sdl-parser";
import outputError from "../../util/output_error";

/**
 * Command to parse and validate an SDL file.
 */
const validate: SubCommand = {
  name: "validate",
  description: "Parse and validate an SDL file",
  options: [
    {
      name: "input",
      description: "Input SDL file path",
      type: ArgumentValueTypeName.STRING,
      shortAlias: "i",
    },
  ],
  positionals: [],
  execute: async (
    context: Context,
    argumentValues: ArgumentValues,
  ): Promise<void> => {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const parser = new Parser();

    const inputSdlFilePath = argumentValues.input as string;

    const sdlSpecification = await fs.readFile(
      path.join(process.cwd(), inputSdlFilePath),
    ).then((buffer) => buffer.toString());

    try {
      const parsedSdlSpecification = parser.parse(sdlSpecification);

      if (printerService.getLevel() === Level.DEBUG) {
        const highlighterService = context.getServiceById(
          SYNTAX_HIGHLIGHTER_SERVICE_ID,
        ) as SyntaxHighlighterService;
        await printerService.debug(
          highlighterService.highlight(
            JSON.stringify(parsedSdlSpecification, undefined, 2),
            "json",
          ) + "\n",
        );
      }

      await printerService.info(
        `SDL file ${inputSdlFilePath} is valid\n`,
        Icon.SUCCESS,
      );
    } catch (error) {
      await printerService.error(
        `SDL file ${inputSdlFilePath} is invalid\n`,
        Icon.FAILURE,
      );
      if (error instanceof Error) {
        await outputError(error, sdlSpecification, context);
      } else {
        await printerService.warn(String(error) + "\n");
      }
    }
  },
};

export default validate;
