import {
  AbstractNode,
  AbstractStatement,
  ArrayDefinition,
  ClassDeclaration,
  ClassDefinition,
  CompoundStatement,
  ComputedArrayDefinition,
  ComputedElementaryTypeDefinition,
  DoStatement,
  ElementaryTypeDefinition,
  ExpressionStatement,
  ForStatement,
  IfClause,
  IfStatement,
  MapDeclaration,
  MapDefinition,
  StatementKind,
  StringDefinition,
  SwitchCaseClause,
  SwitchDefaultClause,
  SwitchStatement,
  WhileStatement,
} from "@flowscripter/mpeg-sdl-parser";
import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils";
import { printClassDeclaration, printClassDefinition } from "./print_class";
import { printMapDeclaration, printMapDefinition } from "./print_map";
import {
  printArrayDefinition,
  printComputedArrayDefinition,
} from "./print_array";
import { printStringDefinition } from "./print_string";
import {
  printComputedElementaryTypeDefinition,
  printElementaryTypeDefinition,
} from "./print_elementary_type";
const { hardline, indent, join } = doc.builders;

function printCompoundStatement(
  path: AstPath<CompoundStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  return [
    getDocWithTrivia(node.openBracePunctuatorToken),
    indent([
      hardline,
      path.map(print, "statements"),
    ]),
    hardline,
    getDocWithTrivia(node.closeBracePunctuatorToken),
  ];
}
function printDoStatement(
  path: AstPath<DoStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const doStatement = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(doStatement.doKeywordToken));
  elements.push(path.call(print, "compoundStatement"));
  elements.push(getDocWithTrivia(doStatement.whileKeywordToken));
  elements.push([
    getDocWithTrivia(doStatement.openParenthesisPunctuatorToken),
    path.call(print, "conditionExpression"),
    getDocWithTrivia(doStatement.closeParenthesisPunctuatorToken),
  ]);

  return join(" ", elements);
}

function printExpressionStatement(
  path: AstPath<ExpressionStatement>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  return [
    path.call(
      print,
      "expression",
    ),
    getDocWithTrivia(node.semicolonPunctuatorToken),
  ];
}

function printForStatement(
  path: AstPath<ForStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const forStatement = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(forStatement.forKeywordToken));

  const subElements = [];

  subElements.push(
    getDocWithTrivia(forStatement.openParenthesisPunctuatorToken),
  );

  if (forStatement.expression1 !== undefined) {
    subElements.push(
      path.call(print, "expression1" as keyof ForStatement["expression1"]),
    );
  } else if (forStatement.computedElementaryDefinition !== undefined) {
    subElements.push(
      path.call(
        print,
        "computedElementaryDefinition" as keyof ForStatement[
          "computedElementaryDefinition"
        ],
      ),
    );
  } else if (forStatement.semicolon1PunctuatorToken !== undefined) {
    subElements.push(getDocWithTrivia(forStatement.semicolon1PunctuatorToken));
  }

  if (forStatement.expression2 !== undefined) {
    subElements.push(" ");
    subElements.push(
      path.call(print, "expression2" as keyof ForStatement["expression2"]),
    );
  }
  subElements.push(getDocWithTrivia(forStatement.semicolon2PunctuatorToken));
  if (forStatement.expression3 !== undefined) {
    subElements.push(" ");
    subElements.push(
      path.call(print, "expression3" as keyof ForStatement["expression3"]),
    );
  }
  subElements.push(
    getDocWithTrivia(forStatement.closeParenthesisPunctuatorToken),
  );

  elements.push(subElements);
  elements.push(path.call(print, "compoundStatement"));

  return join(" ", elements);
}

export function printIfClause(
  path: AstPath<IfClause>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const ifClause = path.node;

  const elements = [];

  if (ifClause.elseKeywordToken !== undefined) {
    elements.push(getDocWithTrivia(ifClause.elseKeywordToken));
  }

  if (ifClause.ifKeywordToken !== undefined) {
    if (ifClause.elseKeywordToken === undefined) {
      elements.push([hardline, getDocWithTrivia(ifClause.ifKeywordToken)]);
    } else {
      elements.push(getDocWithTrivia(ifClause.ifKeywordToken));
    }

    elements.push(
      [
        getDocWithTrivia(ifClause.openParenthesisPunctuatorToken!),
        path.call(print, "condition" as keyof IfClause["condition"]),
        getDocWithTrivia(ifClause.closeParenthesisPunctuatorToken!),
      ],
    );
  }

  elements.push(path.call(print, "statement"));

  return join(" ", elements);
}

function printIfStatement(
  path: AstPath<IfStatement>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  return (path as AstPath<IfStatement>).map(print, "clauses");
}

export function printSwitchCaseClause(
  path: AstPath<SwitchCaseClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const switchCaseClause = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(switchCaseClause.caseKeywordToken));
  elements.push(" ");
  elements.push([
    path.call(print, "value"),
    getDocWithTrivia(switchCaseClause.colonPunctuatorToken),
  ]);

  if (switchCaseClause.openBracePunctuatorToken !== undefined) {
    elements.push(" ");
    elements.push(getDocWithTrivia(switchCaseClause.openBracePunctuatorToken));
  }

  const subElements = [
    hardline,
    join(hardline, path.map(print, "statements")),
    hardline,
  ];

  if (switchCaseClause.breakKeywordToken !== undefined) {
    subElements.push(getDocWithTrivia(switchCaseClause.breakKeywordToken));
  }

  if (switchCaseClause.semicolonPunctuatorToken !== undefined) {
    subElements.push(
      getDocWithTrivia(switchCaseClause.semicolonPunctuatorToken),
    );
  }

  elements.push(indent(subElements));

  if (switchCaseClause.closeBracePunctuatorToken !== undefined) {
    elements.push(getDocWithTrivia(switchCaseClause.closeBracePunctuatorToken));
    elements.push(hardline);
  }

  return elements;
}

export function printSwitchDefaultClause(
  path: AstPath<SwitchDefaultClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const switchDefaultClause = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(switchDefaultClause.defaultKeywordToken));
  elements.push(getDocWithTrivia(switchDefaultClause.colonPunctuatorToken));

  if (switchDefaultClause.openBracePunctuatorToken !== undefined) {
    elements.push(" ");
    elements.push(
      getDocWithTrivia(switchDefaultClause.openBracePunctuatorToken),
    );
  }

  elements.push(indent([
    hardline,
    join(hardline, path.map(print, "statements")),
    hardline,
  ]));

  if (switchDefaultClause.closeBracePunctuatorToken !== undefined) {
    elements.push(
      getDocWithTrivia(switchDefaultClause.closeBracePunctuatorToken),
    );
    elements.push(hardline);
  }

  return elements;
}

function printSwitchStatement(
  path: AstPath<SwitchStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const switchStatement = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(switchStatement.switchKeywordToken));
  elements.push([
    getDocWithTrivia(switchStatement.openParenthesisPunctuatorToken),
    path.call(print, "expression"),
    getDocWithTrivia(switchStatement.closeParenthesisPunctuatorToken),
  ]);
  elements.push(getDocWithTrivia(switchStatement.openBracePunctuatorToken));

  const clauses = [];

  clauses.push(
    path.map(print, "switchCaseClauses"),
  );

  if (switchStatement.switchDefaultClause !== undefined) {
    clauses.push(
      path.call(
        print,
        "switchDefaultClause" as keyof SwitchStatement["switchDefaultClause"],
      ),
    );
  }

  elements.push(
    indent([
      hardline,
      clauses,
    ]),
  );

  elements.push(getDocWithTrivia(switchStatement.closeBracePunctuatorToken));

  return join(" ", elements);
}

function printWhileStatement(
  path: AstPath<WhileStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const whileStatement = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(whileStatement.whileKeywordToken));
  elements.push([
    getDocWithTrivia(whileStatement.openParenthesisPunctuatorToken),
    path.call(print, "expression"),
    getDocWithTrivia(whileStatement.closeParenthesisPunctuatorToken),
  ]);
  elements.push(path.call(print, "compoundStatement"));

  return join(" ", elements);
}

export function printStatement(
  path: AstPath<AbstractStatement>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const abstractStatement = path.node;
  const statementKind = abstractStatement.statementKind;
  switch (statementKind) {
    case StatementKind.ARRAY_DEFINITION:
      return printArrayDefinition(path as AstPath<ArrayDefinition>, print);
    case StatementKind.COMPUTED_ARRAY_DEFINITION:
      return printComputedArrayDefinition(
        path as AstPath<ComputedArrayDefinition>,
        print,
      );
    case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
      return printComputedElementaryTypeDefinition(
        path as AstPath<ComputedElementaryTypeDefinition>,
        print,
      );
    case StatementKind.CLASS_DECLARATION:
      return printClassDeclaration(path as AstPath<ClassDeclaration>, print);
    case StatementKind.CLASS_DEFINITION:
      return printClassDefinition(path as AstPath<ClassDefinition>, print);
    case StatementKind.COMPOUND:
      return printCompoundStatement(path as AstPath<CompoundStatement>, print);
    case StatementKind.DO:
      return printDoStatement(path as AstPath<DoStatement>, print);
    case StatementKind.ELEMENTARY_TYPE_DEFINITION:
      return printElementaryTypeDefinition(
        path as AstPath<ElementaryTypeDefinition>,
        print,
      );
    case StatementKind.EXPRESSION:
      return printExpressionStatement(
        path as AstPath<ExpressionStatement>,
        print,
      );
    case StatementKind.FOR:
      return printForStatement(path as AstPath<ForStatement>, print);
    case StatementKind.IF:
      return printIfStatement(path as AstPath<IfStatement>, print);
    case StatementKind.MAP_DECLARATION:
      return printMapDeclaration(path as AstPath<MapDeclaration>, print);
    case StatementKind.MAP_DEFINITION:
      return printMapDefinition(path as AstPath<MapDefinition>, print);
    case StatementKind.STRING_DEFINITION:
      return printStringDefinition(path as AstPath<StringDefinition>, print);
    case StatementKind.SWITCH:
      return printSwitchStatement(path as AstPath<SwitchStatement>, print);
    case StatementKind.WHILE:
      return printWhileStatement(path as AstPath<WhileStatement>, print);
    default: {
      const exhaustiveCheck: never = statementKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}
