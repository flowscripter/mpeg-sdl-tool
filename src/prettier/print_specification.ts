import {
  type AbstractNode,
  AbstractStatement,
  NodeKind,
  type Specification,
  StatementKind,
} from "@flowscripter/mpeg-sdl-parser";
import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils";
const { hardline, join } = doc.builders;

export function printSpecification(
  path: AstPath<Specification>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const node = path.node;

  const globalElements = path.map(print, "globals");

  const elements: Doc[] = [];

  let previousStatementKind: StatementKind | undefined;

  for (let i = 0; i < globalElements.length; i++) {
    const globalElement = globalElements[i];
    const globalNode = node.globals[i];
    if (globalNode.nodeKind === NodeKind.STATEMENT) {
      const statementKind = (globalNode as AbstractStatement).statementKind;
      if (
        (previousStatementKind !== undefined) &&
        ((statementKind !==
          StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION) ||
          (statementKind !== previousStatementKind))
      ) {
        elements.push([
          hardline,
          globalElement,
        ]);
      } else {
        elements.push(globalElement);
      }
      previousStatementKind = statementKind;
    } else {
      elements.push(globalElement);
    }
  }

  return [
    join(
      hardline,
      elements,
    ),
    hardline,
    getDocWithTrivia(node.eofToken),
  ];
}
