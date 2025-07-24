import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  type ArgumentValues,
  ArgumentValueTypeName,
  type Context,
  Icon,
  PRETTY_PRINTER_SERVICE_ID,
  type PrettyPrinterService,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";
import sdlHighlight from "../../util/sdl_highlight";
import outputError from "../../util/output_error";
import { prettierPluginSdl } from "@mpeggroup/mpeg-sdl-parser/src/prettier/prettierPluginSdl";
import { SyntacticParseError } from "@mpeggroup/mpeg-sdl-parser";

/**
 * Command to parse and prettify an SDL file.
 */
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
    const prettyPrinterService = context.getServiceById(
      PRETTY_PRINTER_SERVICE_ID,
    ) as PrettyPrinterService;

    prettyPrinterService.registerSyntax("sdl", prettierPluginSdl);

    const inputSdlFilePath = argumentValues.input as string;

    const sdlSpecification = await fs.readFile(
      path.join(process.cwd(), inputSdlFilePath),
    ).then((buffer) => buffer.toString());

    let prettifiedSdlSpecification: string;
    try {
      prettifiedSdlSpecification = await prettyPrinterService.prettify(
        sdlSpecification,
        "sdl",
      );
    } catch (error) {
      await printerService.error(
        `SDL file ${inputSdlFilePath} could not be parsed\n`,
        Icon.FAILURE,
      );
      if (error instanceof SyntacticParseError) {
        await outputError(error, context);
      } else {
        await printerService.warn(String(error) + "\n");
      }

      return;
    }

    await printerService.print(
      sdlHighlight(prettifiedSdlSpecification + "\n", context),
    );
  },
};

export default prettify;
