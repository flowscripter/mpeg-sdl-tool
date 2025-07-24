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
} from "@flowscripter/dynamic-cli-framework";
import {
  collateParseErrors,
  createLenientSdlParser,
  SdlStringInput,
} from "@mpeggroup/mpeg-sdl-parser";
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
    const parser = await createLenientSdlParser();

    const inputSdlFilePath = argumentValues.input as string;

    const sdlSpecification = await fs.readFile(
      path.join(process.cwd(), inputSdlFilePath),
    ).then((buffer) => buffer.toString());

    // Prepare the SDL input
    const sdlStringInput = new SdlStringInput(sdlSpecification);

    const sdlParseTree = parser.parse(sdlStringInput);

    if (printerService.getLevel() === Level.DEBUG) {
      // Traverse and print the parse tree
      const cursor = sdlParseTree.cursor();
      do {
        await printerService.debug(
          `Node ${cursor.name} from ${cursor.from} to ${cursor.to}\n`,
        );
      } while (cursor.next());
    }

    // Check for any parse errors
    const parseErrors = collateParseErrors(sdlParseTree, sdlStringInput);

    if (parseErrors.length > 0) {
      await printerService.error(
        `SDL file ${inputSdlFilePath} is invalid\n`,
        Icon.FAILURE,
      );
      for (const error of parseErrors) {
        await outputError(error, context);
      }
    } else {
      await printerService.info(
        `SDL file ${inputSdlFilePath} is valid\n`,
        Icon.SUCCESS,
      );
    }
  },
};

export default validate;
