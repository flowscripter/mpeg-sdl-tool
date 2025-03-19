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
} from "@flowscripter/dynamic-cli-framework";
import { Parser } from "@flowscripter/mpeg-sdl-parser";

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
      parser.parse(sdlSpecification);

      printerService.info(
        `SDL file ${inputSdlFilePath} is valid\n`,
        Icon.SUCCESS,
      );
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
    }
  },
};

export default validate;
