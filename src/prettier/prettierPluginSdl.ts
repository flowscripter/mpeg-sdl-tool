import {
  AbstractNode,
  Parser as SdlParser,
} from "@flowscripter/mpeg-sdl-parser";
import type { Parser, Plugin, Printer, SupportLanguage } from "prettier";
import printNode from "./print_node";
const languages: SupportLanguage[] = [
  {
    name: "sdl",
    parsers: ["sdl"],
  },
];

const parsers: Record<string, Parser<AbstractNode>> = {
  sdl: {
    astFormat: "sdl",
    parse: (sdlSpecification) => {
      const sdlParser = new SdlParser();
      return sdlParser.parse(sdlSpecification);
    },
    locStart: (node: AbstractNode) => {
      return node.location.position;
    },
    locEnd: (node: AbstractNode) => {
      const iterable = node.getSyntaxTokenIterable();
      let endPosition = node.location.position;
      for (const token of iterable) {
        endPosition += token.toString().length;
      }
      return endPosition;
    },
  },
};

const printers: Record<string, Printer<AbstractNode>> = {
  "sdl": {
    print: printNode,
  },
};

const prettierPluginSdl: Plugin = {
  languages,
  parsers,
  printers,
};

export default prettierPluginSdl;
