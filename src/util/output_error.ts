import { type Location, SyntacticParseError } from "@mpeggroup/mpeg-sdl-parser";
import sdlHighlight from "./sdl_highlight.ts";
const LINE_NUMBER_SUFFIX = " |    ";

import {
  type Context,
  PRINTER_SERVICE_ID,
  type PrinterService,
} from "@flowscripter/dynamic-cli-framework";

async function outputError(
  error: SyntacticParseError,
  context: Context,
): Promise<void> {
  const printerService = context.getServiceById(
    PRINTER_SERVICE_ID,
  ) as PrinterService;

  if ("location" in error && error.location) {
    const location = error.location as Location;
    const row = location?.row || 1;
    const column = location?.column || 1;

    const lineNumberChars = row.toString().length;
    const pointerLineSpacing = lineNumberChars + LINE_NUMBER_SUFFIX.length +
      column - 1;

    await printerService.warn("\n");

    for (let i = error.preceedingLines?.length || 0; i > 0; i--) {
      const line = error.preceedingLines![i - 1];
      const lineNumber = (row - i).toString().padStart(lineNumberChars, " ");
      await printerService.warn(
        `${printerService.yellow(lineNumber + LINE_NUMBER_SUFFIX)}${
          sdlHighlight(
            line,
            context,
          )
        }\n`,
      );
    }
    await printerService.warn(
      `${printerService.yellow(row + LINE_NUMBER_SUFFIX)}${
        sdlHighlight(
          error.errorLine || "",
          context,
        )
      }\n`,
    );

    await printerService.warn(
      printerService.red(" ".repeat(pointerLineSpacing) + "^\n"),
    );
  }

  await printerService.warn(error.message + "\n");
}

export default outputError;
