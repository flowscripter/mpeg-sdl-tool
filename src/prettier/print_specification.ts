import type {
  AbstractNode,
  Specification,
} from "@flowscripter/mpeg-sdl-parser";
import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils";
const { hardline, join } = doc.builders;

export function printSpecification(
  path: AstPath<Specification>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const node = path.node;

  return [
    join(
      hardline,
      path.map(print, "globals"),
    ),
    hardline,
    getDocWithTrivia(node.eofToken),
  ];
}
