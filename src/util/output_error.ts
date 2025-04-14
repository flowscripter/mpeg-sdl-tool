import { type Location } from "@flowscripter/mpeg-sdl-parser";
import sdlHighlight from "./sdl_highlight";
const LINE_NUMBER_SUFFIX = " |    ";

import {
  type Context,
  PRINTER_SERVICE_ID,
  type PrinterService,
} from "@flowscripter/dynamic-cli-framework";

async function outputError(
  error: Error,
  sdlSpecification: string,
  context: Context,
): Promise<void> {
  const printerService = context.getServiceById(
    PRINTER_SERVICE_ID,
  ) as PrinterService;

  if ("location" in error && error.location) {
    const location = error.location as Location;
    const rowEnd = location.row;
    const column = location.column;

    let rowStart = rowEnd - 6;
    if (rowStart < 1) {
      rowStart = 1;
    }

    const rowEndString = rowEnd.toString();
    const lineNumberChars = rowEndString.length;
    const pointerLineSpacing = lineNumberChars + LINE_NUMBER_SUFFIX.length +
      column - 1;

    const outputLines = [];

    for (let i = rowStart; i <= rowEnd; i++) {
      const line = sdlSpecification.split("\n")[i - 1];
      const lineNumber = i.toString().padStart(lineNumberChars, " ");
      outputLines.push(
        `${printerService.yellow(lineNumber + LINE_NUMBER_SUFFIX)}${
          sdlHighlight(line, context)
        }`,
      );
    }

    outputLines.push(printerService.red(" ".repeat(pointerLineSpacing) + "^"));

    await printerService.warn("\n" + outputLines.join("\n") + "\n");
  }

  await printerService.warn(error.message + "\n");
}

export default outputError;
