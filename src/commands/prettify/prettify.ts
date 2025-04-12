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
  SYNTAX_HIGHLIGHTER_SERVICE_ID,
  type SyntaxHighlighterService,
} from "@flowscripter/dynamic-cli-framework";
import prettierPluginSdl from "../../prettier/prettierPluginSdl";
import highlightSyntaxSdl from "../../highlight/highlightSyntaxSdl";

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
    const highlighterService = context.getServiceById(
      SYNTAX_HIGHLIGHTER_SERVICE_ID,
    ) as SyntaxHighlighterService;
    const prettyPrinterService = context.getServiceById(
      PRETTY_PRINTER_SERVICE_ID,
    ) as PrettyPrinterService;

    prettyPrinterService.registerSyntax("sdl", prettierPluginSdl);
    highlighterService.registerSyntax("sdl", highlightSyntaxSdl);

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
      printerService.error(
        `SDL file ${inputSdlFilePath} could not be parsed\n`,
        Icon.FAILURE,
      );
      if (error instanceof Error) {
        printerService.warn(error.message + "\n");
      } else {
        printerService.warn(String(error) + "\n");
      }

      return;
    }
    const colorScheme = {
      keyword: "#ffff00",
      string: "#00ff00",
      number: "#00ffff",
      punctuation: "#00ff00",
      operator: "#00ff00",
    };

    await printerService.print(
      highlighterService.highlight(
        prettifiedSdlSpecification,
        "sdl",
        colorScheme,
      ),
    );
  },
};

export default prettify;
