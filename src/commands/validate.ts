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

const validate: SubCommand = {
  name: "validate",
  description: "Parse and validate an SDL file",
  options: [
    {
      name: "input",
      description: "Input SDL file",
      type: ArgumentValueTypeName.STRING,
      shortAlias: "i"
    },
  ],
  positionals: [],
  execute: async (
    context: Context,
    _argumentValues: ArgumentValues,
  ): Promise<void> => {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const parser = new Parser();

    
    expect(() => parser.parse("class A")).toThrow(
      "Unable to consume token: ",
    );

  },
};

export default validate;
