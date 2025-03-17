import {
  type ArgumentValues,
  ArgumentValueTypeName,
  ComplexValueTypeName,
  type Context,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
  SYNTAX_HIGHLIGHTER_SERVICE_ID,
  type SyntaxHighlighterService,
} from "@flowscripter/dynamic-cli-framework";

const prettify: SubCommand = {
  name: "prettify",
  description: "Parse and prettify an SDL file",
  options: [
    {
      name: "input",
      description: "Input SDL file",
      type: ArgumentValueTypeName.STRING,
      shortAlias: "i"
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

    await printerService.print(
      highlighterService.highlight(
        JSON.stringify(argumentValues, null, 2),
        "json",
      ) + "\n",
    );
  },
};

export default prettify;
