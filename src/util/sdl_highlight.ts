import {
  type Context,
  PRINTER_SERVICE_ID,
  type PrinterService,
  SYNTAX_HIGHLIGHTER_SERVICE_ID,
  type SyntaxHighlighterService,
} from "@flowscripter/dynamic-cli-framework";
import highlightSyntaxSdl from "../highlight/highlightSyntaxSdl.js";
import type { ColorScheme } from "@flowscripter/dynamic-cli-framework/src/api/service/core/SyntaxHighlighterService";

let syntaxHighlighterService: SyntaxHighlighterService | undefined = undefined;
let colorScheme: ColorScheme | undefined = undefined;

function sdlHighlight(sdlText: string, context: Context): string {
  if (syntaxHighlighterService === undefined) {
    syntaxHighlighterService = context.getServiceById(
      SYNTAX_HIGHLIGHTER_SERVICE_ID,
    ) as SyntaxHighlighterService;

    syntaxHighlighterService.registerSyntax("sdl", highlightSyntaxSdl);

    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;

    if (printerService.darkMode) {
      colorScheme = {
        keyword: "#508ECC",
        string: "#D29578",
        number: "#B8CEA6",
        type: "#C06BC0",
        comment: "#6B9450",
        operator: "#FCD00A",
      };
    } else {
      colorScheme = {
        keyword: "#1919FF",
        string: "#8A0000",
        number: "#007031",
        type: "#C06BC0",
        comment: "#0F760F",
        operator: "#67290F",
      };
    }
  }

  return syntaxHighlighterService.highlight(sdlText, "sdl", colorScheme);
}

export default sdlHighlight;
