import {
  AbstractArrayDimension,
  AbstractClassId,
  AbstractExpression,
  AbstractMapOutputValue,
  AbstractNode,
  AbstractStatement,
  AggregateMapOutputValue,
  AlignedModifier,
  ArrayDefinition,
  ArrayDimensionKind,
  ArrayElementAccess,
  ArrayElementType,
  BinaryExpression,
  BitModifier,
  ClassDeclaration,
  ClassDefinition,
  ClassIdKind,
  ClassIdRange,
  ClassMemberAccess,
  CompoundStatement,
  ComputedArrayDefinition,
  ComputedElementaryTypeDefinition,
  DoStatement,
  ElementaryType,
  ElementaryTypeDefinition,
  ElementaryTypeKind,
  ExpandableModifier,
  ExplicitArrayDimension,
  ExpressionKind,
  ExpressionStatement,
  ExtendedClassIdRange,
  ExtendsModifier,
  ForStatement,
  Identifier,
  IfClause,
  IfStatement,
  ImplicitArrayDimension,
  LengthAttribute,
  LengthOfExpression,
  MapDeclaration,
  MapDefinition,
  MapEntry,
  MapEntryList,
  MapOutputValueKind,
  NodeKind,
  NumberLiteral,
  NumberLiteralKind,
  Parameter,
  ParameterList,
  ParameterValueList,
  PartialArrayDimension,
  PostfixExpression,
  PrimaryExpression,
  SingleClassId,
  SingleMapOutputValue,
  Specification,
  StatementKind,
  StringDefinition,
  StringLiteral,
  SwitchStatement,
  SyntaxToken,
  Trivia,
  UnaryExpression,
  WhileStatement,
} from "@flowscripter/mpeg-sdl-parser";
import type { SwitchCaseClause } from "@flowscripter/mpeg-sdl-parser/src/abstract_syntax_tree/node/SwitchCaseClause";
import type { SwitchDefaultClause } from "@flowscripter/mpeg-sdl-parser/src/abstract_syntax_tree/node/SwitchDefaultClause";
import { TokenKind } from "@flowscripter/mpeg-sdl-parser/src/tokenizer/enum/token_kind";
import type { AstPath, Doc, ParserOptions } from "prettier";
import { doc } from "prettier";
const { hardline, indent, join } = doc.builders;

function cleanupTrivia(node: AbstractNode) {
  for (const token of node.getSyntaxTokenIterable()) {
    token.leadingTrivia = token.leadingTrivia.filter((trivia) =>
      trivia.tokenKind !== TokenKind.WHITESPACE_TOKEN
    );
    token.trailingTrivia = token.trailingTrivia.filter((trivia) =>
      trivia.tokenKind !== TokenKind.WHITESPACE_TOKEN
    );
  }
}

function getCommentString(trivia: Trivia): string {
  if (trivia.tokenKind !== TokenKind.COMMENT_TOKEN) {
    throw new Error(
      "Logic Error: Expected a comment token: " + JSON.stringify(trivia),
    );
  }
  if (!trivia.text.startsWith("//")) {
    throw new Error(
      "Logic Error: Expected comment to start with // : " +
        JSON.stringify(trivia),
    );
  }
  // Remove leading "//" from the comment text
  const commentText = trivia.text.replace(/^\s*\/\/\s*/, "").trim();
  return "// " + commentText;
}

function getLeadingTriviaDoc(syntaxToken: SyntaxToken): Doc[] {
  if (!syntaxToken.leadingTrivia.length) {
    return [];
  }

  return [
    join(
      hardline,
      syntaxToken.leadingTrivia.map((trivia) => getCommentString(trivia)),
    ),
    hardline,
  ];
}

function getTrailingTriviaDoc(syntaxToken: SyntaxToken): Doc[] {
  if (!syntaxToken.trailingTrivia.length) {
    return [];
  }

  return [
    " ",
    join(
      hardline,
      syntaxToken.trailingTrivia.map((trivia) => getCommentString(trivia)),
    ),
    hardline,
  ];
}

function getDocWithTrivia(token: SyntaxToken): Doc[] {
  const leadingTriviaDoc = getLeadingTriviaDoc(token);
  const trailingTriviaDoc = getTrailingTriviaDoc(token);

  return [
    leadingTriviaDoc,
    token.text,
    trailingTriviaDoc,
  ];
}

function addCommaSeparatorsToDoc(
  valuesDoc: Doc[],
  commaSeparatorTokens: SyntaxToken[] | undefined,
): Doc[] {
  if (commaSeparatorTokens === undefined) {
    if (valuesDoc.length > 1) {
      throw new Error(
        `Logic Error: Number of values: ${valuesDoc.length} and no comma separators provided`,
      );
    }
    return valuesDoc;
  }

  if (valuesDoc.length !== commaSeparatorTokens.length + 1) {
    throw new Error(
      `Logic Error: Number of values: ${valuesDoc.length} and comma separators: ${commaSeparatorTokens.length} are not as expected`,
    );
  }

  const result: Doc[] = [];
  for (let i = 0; i < valuesDoc.length; i++) {
    result.push(valuesDoc[i]);
    if (i < commaSeparatorTokens.length) {
      result.push(getDocWithTrivia(commaSeparatorTokens[i]));
    }
  }

  return result;
}

function printAbstractArrayDimension(
  path: AstPath<AbstractArrayDimension>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const { arrayDimensionKind } = path.node;
  switch (arrayDimensionKind) {
    case ArrayDimensionKind.EXPLICIT: {
      const explicitArrayDimensionNode = path.node as ExplicitArrayDimension;
      return [
        getDocWithTrivia(explicitArrayDimensionNode.openBracketToken),
        (path as AstPath<ExplicitArrayDimension>).call(print, "size"),
        getDocWithTrivia(explicitArrayDimensionNode.closeBracketToken),
      ];
    }
    case ArrayDimensionKind.PARTIAL: {
      const partialArrayDimensionNode = path.node as PartialArrayDimension;
      return [
        getDocWithTrivia(partialArrayDimensionNode.openBracketToken),
        getDocWithTrivia(partialArrayDimensionNode.innerOpenBracketToken),
        (path as AstPath<PartialArrayDimension>).call(print, "index"),
        getDocWithTrivia(partialArrayDimensionNode.innerCloseBracketToken),
        getDocWithTrivia(partialArrayDimensionNode.closeBracketToken),
      ];
    }
    case ArrayDimensionKind.IMPLICIT: {
      const node = path.node as ImplicitArrayDimension;
      const elements = [];

      elements.push(getDocWithTrivia(node.openBracketToken));
      elements.push("[");

      if (node.rangeStart !== undefined) {
        elements.push(
          path.call(
            print,
            "rangeStart" as keyof ImplicitArrayDimension["rangeStart"],
          ),
        );
      }

      if (node.rangeEnd !== undefined) {
        elements.push(getDocWithTrivia(node.rangeOperatorToken!));
        elements.push(
          path.call(
            print,
            "rangeEnd" as keyof ImplicitArrayDimension["rangeEnd"],
          ),
        );
      }

      elements.push(getDocWithTrivia(node.closeBracketToken));
      return elements;
    }

    default: {
      const exhaustiveCheck: never = arrayDimensionKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printAbstractExpression(
  path: AstPath<AbstractExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const { expressionKind } = path.node;
  switch (expressionKind) {
    case ExpressionKind.BINARY:
      return printBinaryExpression(path as AstPath<BinaryExpression>, print);
    case ExpressionKind.LENGTH_OF:
      return printLengthOfExpression(
        path as AstPath<LengthOfExpression>,
        print,
      );
    case ExpressionKind.POSTFIX:
      return printPostfixExpression(path as AstPath<PostfixExpression>, print);
    case ExpressionKind.PRIMARY:
      return printPrimaryExpression(path as AstPath<PrimaryExpression>, print);
    case ExpressionKind.UNARY:
      return printUnaryExpression(path as AstPath<UnaryExpression>, print);
    default: {
      const exhaustiveCheck: never = expressionKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printAbstractMapOutputValue(
  path: AstPath<AbstractMapOutputValue>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const { mapOutputValueKind } = path.node;
  switch (mapOutputValueKind) {
    case MapOutputValueKind.SINGLE: {
      const singleMapOutputValue = path.node as SingleMapOutputValue;
      if (singleMapOutputValue.numberLiteralValue !== undefined) {
        return path.call(
          print,
          "numberLiteralValue" as keyof SingleMapOutputValue[
            "numberLiteralValue"
          ],
        );
      }
      return [
        path.call(
          print,
          "elementaryType" as keyof SingleMapOutputValue["elementaryType"],
        ),
        path.call(
          print,
          "lengthAttribute" as keyof SingleMapOutputValue["lengthAttribute"],
        ),
      ];
    }
    case MapOutputValueKind.AGGREGATE: {
      const aggregateMapOutputValue = path.node as AggregateMapOutputValue;
      const elements = [];

      elements.push(getDocWithTrivia(aggregateMapOutputValue.openBraceToken));

      const outputValuesDoc = (path as AstPath<AggregateMapOutputValue>).map(
        print,
        "outputValues",
      );

      elements.push(
        ...addCommaSeparatorsToDoc(
          outputValuesDoc,
          aggregateMapOutputValue.commaTokens,
        ),
      );
      elements.push(getDocWithTrivia(aggregateMapOutputValue.closeBraceToken));

      return elements;
    }
    default: {
      const exhaustiveCheck: never = mapOutputValueKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printAlignedModifier(
  path: AstPath<AlignedModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const alignedModifier = path.node;

  const elements = [];

  elements.push(getDocWithTrivia(alignedModifier.alignedToken));

  if (!alignedModifier.isDefault8BitCount) {
    elements.push(getDocWithTrivia(alignedModifier.openParenthesisToken!));
    elements.push(
      path.call(
        print,
        "bitCountModifier" as keyof AlignedModifier["bitCountModifier"],
      ),
    ), elements.push(getDocWithTrivia(alignedModifier.closeParenthesisToken!));
  }
  return elements;
}

function printArrayDefinition(
  path: AstPath<ArrayDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const arrayDefinition = path.node;

  const elements = [];

  if (arrayDefinition.isReserved) {
    elements.push(getDocWithTrivia(arrayDefinition.reservedToken!));
  }

  if (arrayDefinition.isLegacy) {
    elements.push(getDocWithTrivia(arrayDefinition.legacyToken!));
  }

  if (arrayDefinition.alignedModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "alignedModifier" as keyof ArrayDefinition["alignedModifier"],
      ),
    );
  }

  elements.push(path.call(print, "arrayElementType"));

  const identifierClause = [
    path.call(print, "identifier"),
  ];

  if (arrayDefinition.implicitArrayDimension !== undefined) {
    identifierClause.push(
      path.call(
        print,
        "implicitArrayDimension" as keyof ArrayDefinition[
          "implicitArrayDimension"
        ],
      ),
    );
  }

  if (arrayDefinition.dimensions !== undefined) {
    identifierClause.push(
      path.map(
        print,
        "dimensions" as keyof ArrayDefinition["dimensions"],
      ),
    );
  }

  identifierClause.push(
    getDocWithTrivia(arrayDefinition.semicolonPunctuatorToken),
  );

  elements.push(identifierClause);

  return join(" ", elements);
}

function printArrayElementAccess(
  path: AstPath<ArrayElementAccess>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const arrayElementAccess = path.node;
  return [
    getDocWithTrivia(arrayElementAccess.openBracketToken),
    path.call(print, "index"),
    getDocWithTrivia(arrayElementAccess.closeBracketToken),
  ];
}

function printArrayElementType(
  path: AstPath<ArrayElementType>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  if (node.elementaryType !== undefined) {
    return [
      path.call(
        print,
        "elementaryType" as keyof ArrayElementType["elementaryType"],
      ),
      path.call(
        print,
        "lengthAttribute" as keyof ArrayElementType["lengthAttribute"],
      ),
    ];
  } else {
    return path.call(
      print,
      "classIdentifier" as keyof ArrayElementType["classIdentifier"],
    );
  }
}

function printBinaryExpression(
  path: AstPath<BinaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  return join(" ", [
    path.call(print, "leftOperand"),
    getDocWithTrivia(node.binaryOperandToken),
    path.call(print, "rightOperand"),
  ]);
}

function printBitModifier(
  path: AstPath<BitModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const bitModifier = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(bitModifier.colonToken));

  const subElements = [];

  subElements.push(getDocWithTrivia(bitModifier.bitKeywordToken));
  subElements.push(getDocWithTrivia(bitModifier.openParenthesisToken));
  subElements.push(path.call(print, "length"));
  subElements.push(getDocWithTrivia(bitModifier.closeParenthesisToken));

  elements.push(subElements);

  if (bitModifier.identifier !== undefined) {
    elements.push(
      path.call(
        print,
        "identifier" as keyof BitModifier["identifier"],
      ),
    );
  }

  if (bitModifier.assignmentToken !== undefined) {
    elements.push(getDocWithTrivia(bitModifier.assignmentToken!));
  }

  elements.push(
    path.call(
      print,
      "classId",
    ),
  );

  return join(" ", elements);
}

function printClassDeclaration(
  path: AstPath<ClassDeclaration>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const classDeclaration = path.node;

  const elements = [];

  if (classDeclaration.alignedModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "alignedModifier" as keyof ClassDeclaration["alignedModifier"],
      ),
    );
  }

  if (classDeclaration.expandableModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "expandableModifier" as keyof ClassDeclaration["expandableModifier"],
      ),
    );
  }

  if (classDeclaration.isAbstract) {
    elements.push(getDocWithTrivia(classDeclaration.abstractToken!));
  }

  elements.push(getDocWithTrivia(classDeclaration.classToken));
  elements.push(path.call(print, "identifier"));

  if (classDeclaration.parameterList !== undefined) {
    elements.push(
      path.call(
        print,
        "parameterList" as keyof ClassDeclaration["parameterList"],
      ),
    );
  }

  if (classDeclaration.extendsModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "extendsModifier" as keyof ClassDeclaration["extendsModifier"],
      ),
    );
  }

  if (classDeclaration.bitModifier !== undefined) {
    elements.push(
      path.call(print, "bitModifier" as keyof ClassDeclaration["bitModifier"]),
    );
  }

  elements.push(getDocWithTrivia(classDeclaration.openBraceToken));

  const parts = [];

  parts.push(join(" ", elements));

  if (classDeclaration.statements.length > 0) {
    parts.push(indent([
      hardline,
      join(hardline, path.map(print, "statements")),
    ]));
  }
  parts.push(hardline);
  parts.push(getDocWithTrivia(classDeclaration.closeBraceToken));

  return parts;
}

function printClassDefinition(
  path: AstPath<ClassDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const classDefinition = path.node;

  const elements = [];

  if (classDefinition.isLegacy) {
    elements.push(getDocWithTrivia(classDefinition.legacyToken!));
  }

  elements.push(path.call(print, "classIdentifier"));
  elements.push(path.call(print, "identifier"));

  if (classDefinition.parameterValueList !== undefined) {
    elements.push([
      path.call(
        print,
        "parameterValueList" as keyof ClassDefinition["parameterValueList"],
      ),
    ]);
  }

  return [
    join(" ", elements),
    getDocWithTrivia(classDefinition.semicolonToken),
  ];
}

function printClassId(
  path: AstPath<AbstractClassId>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const { classIdKind } = path.node;
  switch (classIdKind) {
    case ClassIdKind.SINGLE:
      return (path as AstPath<SingleClassId>).call(print, "value");
    case ClassIdKind.RANGE: {
      const classIdRange = path.node as ClassIdRange;
      return [
        (path as AstPath<ClassIdRange>).call(print, "startClassId"),
        getDocWithTrivia(classIdRange.rangeToken),
        (path as AstPath<ClassIdRange>).call(print, "endClassId"),
      ];
    }
    case ClassIdKind.EXTENDED_RANGE: {
      const extendedClassIdRange = path.node as ExtendedClassIdRange;
      const elements = [];
      const outputValuesDoc = (path as AstPath<ExtendedClassIdRange>).map(
        print,
        "classIds",
      );

      elements.push(
        ...addCommaSeparatorsToDoc(
          outputValuesDoc,
          extendedClassIdRange.commaTokens,
        ),
      );

      return elements;
    }
    default: {
      const exhaustiveCheck: never = classIdKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printClassMemberAccess(
  path: AstPath<ClassMemberAccess>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  return [
    getDocWithTrivia(node.classMemberAccessOperatorToken),
    path.call(print, "memberIdentifier"),
  ];
}

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

function printComputedArrayDefinition(
  path: AstPath<ComputedArrayDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const computedArrayDefinition = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(computedArrayDefinition.computedToken));
  elements.push(path.call(print, "elementaryType"));

  const identifierClause = [path.call(print, "identifier")];

  identifierClause.push(path.map(print, "dimensions"));

  identifierClause.push(
    getDocWithTrivia(computedArrayDefinition.semicolonPunctuatorToken),
  );

  elements.push(identifierClause);

  return join(" ", elements);
}

function printComputedElementaryTypeDefinition(
  path: AstPath<ComputedElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const elements = [];

  const computedElementaryTypeDefinition = path.node;
  elements.push(
    getDocWithTrivia(computedElementaryTypeDefinition.computedToken),
  );
  if (computedElementaryTypeDefinition.isConst) {
    elements.push(
      getDocWithTrivia(computedElementaryTypeDefinition.constToken!),
    );
  }
  elements.push(path.call(print, "elementaryType"));
  elements.push(path.call(print, "identifier"));
  if (computedElementaryTypeDefinition.value !== undefined) {
    elements.push(
      getDocWithTrivia(computedElementaryTypeDefinition.assignmentToken!),
    );
    elements.push(
      path.call(
        print,
        "value" as keyof ComputedElementaryTypeDefinition["value"],
      ),
    );
  }

  return [
    join(" ", elements),
    getDocWithTrivia(computedElementaryTypeDefinition.semicolonPunctuatorToken),
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
    getDocWithTrivia(doStatement.openParenthesisToken),
    path.call(print, "conditionExpression"),
    getDocWithTrivia(doStatement.closeParenthesisToken),
  ]);

  return join(" ", elements);
}

function printElementaryType(path: AstPath<ElementaryType>): Doc {
  const elementaryType = path.node;
  const elementaryTypeKind = elementaryType.elementaryTypeKind;

  switch (elementaryTypeKind) {
    case ElementaryTypeKind.BIT:
    case ElementaryTypeKind.FLOATING_POINT:
    case ElementaryTypeKind.INTEGER:
      return getDocWithTrivia(elementaryType.typeToken);
    case ElementaryTypeKind.UNSIGNED_INTEGER:
      return join(" ", [
        getDocWithTrivia(elementaryType.unsignedQualifierToken!),
        getDocWithTrivia(elementaryType.typeToken),
      ]);
    default: {
      const exhaustiveCheck: never = elementaryTypeKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printElementaryTypeDefinition(
  path: AstPath<ElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const elementaryTypeDefinition = path.node;

  const elements = [];

  if (elementaryTypeDefinition.isReserved) {
    elements.push(getDocWithTrivia(elementaryTypeDefinition.reservedToken!));
  }

  if (elementaryTypeDefinition.isLegacy) {
    elements.push(getDocWithTrivia(elementaryTypeDefinition.legacyToken!));
  }

  if (elementaryTypeDefinition.isConst) {
    elements.push(getDocWithTrivia(elementaryTypeDefinition.constToken!));
  }

  if (elementaryTypeDefinition.alignedModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "alignedModifier" as keyof ElementaryTypeDefinition["alignedModifier"],
      ),
    );
  }

  const typeClause = [
    path.call(print, "elementaryType"),
    path.call(print, "lengthAttribute"),
  ];

  if (elementaryTypeDefinition.isLookahead) {
    typeClause.push(getDocWithTrivia(elementaryTypeDefinition.lookaheadToken!));
  }
  elements.push(typeClause);
  elements.push(path.call(print, "identifier"));

  if (elementaryTypeDefinition.assignmentToken !== undefined) {
    elements.push(getDocWithTrivia(elementaryTypeDefinition.assignmentToken!));
    elements.push(
      path.call(print, "value" as keyof ElementaryTypeDefinition["value"]),
    );
    if (elementaryTypeDefinition.endValue !== undefined) {
      elements.push(
        getDocWithTrivia(elementaryTypeDefinition.rangeOperatorToken!),
      );
      elements.push(
        path.call(
          print,
          "endValue" as keyof ElementaryTypeDefinition["endValue"],
        ),
      );
    }
  }

  return [
    join(" ", elements),
    getDocWithTrivia(elementaryTypeDefinition.semicolonPunctuatorToken),
  ];
}

function printExpandableModifier(
  path: AstPath<ExpandableModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const expandableModifier = path.node;

  const elements = [];

  elements.push(getDocWithTrivia(expandableModifier.expandableToken));

  if (expandableModifier.maxClassSize !== undefined) {
    elements.push(getDocWithTrivia(expandableModifier.openParenthesisToken!));
    elements.push(
      path.call(
        print,
        "maxClassSize" as keyof ExpandableModifier["maxClassSize"],
      ),
    ),
      elements.push(
        getDocWithTrivia(expandableModifier.closeParenthesisToken!),
      );
  }

  return elements;
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

function printExtendsModifier(
  path: AstPath<ExtendsModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapEntryList = path.node;
  const elements = [
    path.call(print, "identifier"),
  ];

  if (mapEntryList.parameterValueList !== undefined) {
    elements.push(
      path.call(
        print,
        "parameterValueList" as keyof ExtendsModifier["parameterValueList"],
      ),
    );
  }

  return join(" ", [
    getDocWithTrivia(mapEntryList.extendsToken),
    elements,
  ]);
}

function printForStatement(
  path: AstPath<ForStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const forStatement = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(forStatement.forKeywordToken));

  const subElements = [];

  subElements.push(getDocWithTrivia(forStatement.openParenthesisToken));

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
  } else if (forStatement.semicolonToken1 !== undefined) {
    subElements.push(getDocWithTrivia(forStatement.semicolonToken1));
  }

  if (forStatement.expression2 !== undefined) {
    subElements.push(" ");
    subElements.push(
      path.call(print, "expression2" as keyof ForStatement["expression2"]),
    );
  }
  subElements.push(getDocWithTrivia(forStatement.semicolonToken2));
  if (forStatement.expression3 !== undefined) {
    subElements.push(" ");
    subElements.push(
      path.call(print, "expression3" as keyof ForStatement["expression3"]),
    );
  }
  subElements.push(getDocWithTrivia(forStatement.closeParenthesisToken));

  elements.push(subElements);
  elements.push(path.call(print, "compoundStatement"));

  return join(" ", elements);
}

function printIdentifier(path: AstPath<Identifier>): Doc {
  const identifier = path.node;

  return getDocWithTrivia(identifier.token);
}

function printIfClause(
  path: AstPath<IfClause>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const ifClause = path.node;

  const elements = [];

  if (ifClause.elseToken !== undefined) {
    elements.push(getDocWithTrivia(ifClause.elseToken));
  }

  if (ifClause.ifToken !== undefined) {
    if (ifClause.elseToken === undefined) {
      elements.push([hardline, getDocWithTrivia(ifClause.ifToken)]);
    } else {
      elements.push(getDocWithTrivia(ifClause.ifToken));
    }

    elements.push(
      [
        getDocWithTrivia(ifClause.openParenthesisToken!),
        path.call(print, "condition" as keyof IfClause["condition"]),
        getDocWithTrivia(ifClause.closeParenthesisToken!),
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

function printLengthAttribute(
  path: AstPath<LengthAttribute>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  return [
    getDocWithTrivia(node.openParenthesisToken),
    path.call(print, "length"),
    getDocWithTrivia(node.closeParenthesisToken),
  ];
}

function printLengthOfExpression(
  path: AstPath<LengthOfExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const lengthOfExpression = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(lengthOfExpression.lengthOfToken));
  elements.push(
    getDocWithTrivia(lengthOfExpression.openParenthesisPunctuatorToken),
  );
  elements.push(path.call(print, "operand"));
  elements.push(
    getDocWithTrivia(lengthOfExpression.closeParenthesisPunctuatorToken),
  );

  return elements;
}

function printMapDeclaration(
  path: AstPath<MapDeclaration>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapDeclaration = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(mapDeclaration.mapToken));
  elements.push(path.call(print, "identifier"));
  elements.push(getDocWithTrivia(mapDeclaration.openParenthesisToken));

  if (mapDeclaration.outputElementaryType !== undefined) {
    elements.push(
      path.call(
        print,
        "outputElementaryType" as keyof MapDeclaration["outputElementaryType"],
      ),
    );
  } else if (mapDeclaration.outputClassIdentifier !== undefined) {
    elements.push(
      path.call(
        print,
        "outputClassIdentifier" as keyof MapDeclaration[
          "outputClassIdentifier"
        ],
      ),
    );
  }
  elements.push(getDocWithTrivia(mapDeclaration.openParenthesisToken));
  elements.push(
    path.call(
      print,
      "mapEntryList",
    ),
  );
  return join(" ", elements);
}

function printMapDefinition(
  path: AstPath<MapDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapDefinition = path.node;
  const elements = [];

  if (mapDefinition.isReserved) {
    elements.push(getDocWithTrivia(mapDefinition.reservedToken!));
  }
  if (mapDefinition.isLegacy) {
    elements.push(getDocWithTrivia(mapDefinition.legacyToken!));
  }

  const subElements = [];

  if (mapDefinition.elementaryType !== undefined) {
    subElements.push(
      path.call(
        print,
        "elementaryType" as keyof MapDefinition["elementaryType"],
      ),
    );
  } else if (mapDefinition.classIdentifier !== undefined) {
    subElements.push(
      path.call(
        print,
        "classIdentifier" as keyof MapDefinition["classIdentifier"],
      ),
    );
  }

  subElements.push(getDocWithTrivia(mapDefinition.openParenthesisToken));
  subElements.push(path.call(print, "mapIdentifier"));
  subElements.push(getDocWithTrivia(mapDefinition.closeParenthesisToken));

  elements.push(subElements);
  elements.push([
    path.call(print, "identifier"),
    getDocWithTrivia(mapDefinition.semicolonToken),
  ]);
  return join(" ", elements);
}

function printMapEntry(
  path: AstPath<MapEntry>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const mapEntry = path.node;
  const elements = [];
  elements.push([
    path.call(print, "inputValue"),
    getDocWithTrivia(mapEntry.commaToken),
  ]);
  elements.push(
    path.call(
      print,
      "outputValue",
    ),
  );
  return join(" ", elements);
}

function printMapEntryList(
  path: AstPath<MapEntryList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const mapEntryList = path.node;
  const elements = [];
  const outputValuesDoc = path.map(print, "mapEntries");

  elements.push(
    ...addCommaSeparatorsToDoc(outputValuesDoc, mapEntryList.commaTokens),
  );

  return [
    getDocWithTrivia(mapEntryList.openBraceToken),
    indent(elements),
    hardline,
    getDocWithTrivia(mapEntryList.closeBraceToken),
  ];
}

function printNumberLiteral(path: AstPath<NumberLiteral>): Doc {
  const numberLiteral = path.node;
  const numberLiteralKind = numberLiteral.numberLiteralKind;

  switch (numberLiteralKind) {
    case NumberLiteralKind.BINARY:
    case NumberLiteralKind.HEXADECIMAL:
    case NumberLiteralKind.INTEGER:
    case NumberLiteralKind.DECIMAL:
    case NumberLiteralKind.FLOATING_POINT:
      return getDocWithTrivia(numberLiteral.tokens[0]);
    case NumberLiteralKind.MULTIPLE_CHARACTER:
      return [
        join(
          " ",
          numberLiteral.tokens.map((token) => getDocWithTrivia(token)),
        ),
      ];
    default: {
      const exhaustiveCheck: never = numberLiteralKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printParameter(
  path: AstPath<Parameter>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameter = path.node;
  const elements = [];

  if (parameter.classIdentifier !== undefined) {
    elements.push(
      path.call(
        print,
        "classIdentifier" as keyof Parameter["classIdentifier"],
      ),
    );
  } else if (parameter.elementaryType !== undefined) {
    elements.push(
      path.call(
        print,
        "elementaryType" as keyof Parameter["elementaryType"],
      ),
    );
  }

  elements.push(path.call(print, "identifier"));

  return join(" ", elements);
}

function printParameterList(
  path: AstPath<ParameterList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameterList = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(parameterList.openParenthesisToken));

  const outputValuesDoc = path.map(print, "parameters");

  elements.push(
    ...addCommaSeparatorsToDoc(outputValuesDoc, parameterList.commaTokens),
  );
  elements.push(getDocWithTrivia(parameterList.closeParenthesisToken));

  return join(" ", elements);
}

function printParameterValueList(
  path: AstPath<ParameterValueList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameterValueList = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(parameterValueList.openParenthesisToken));

  const outputValuesDoc = path.map(print, "values");

  elements.push(
    ...addCommaSeparatorsToDoc(outputValuesDoc, parameterValueList.commaTokens),
  );
  elements.push(getDocWithTrivia(parameterValueList.closeParenthesisToken));

  return join(" ", elements);
}

function printPostfixExpression(
  path: AstPath<PostfixExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const postfixExpression = path.node;
  const elements = [];

  elements.push(path.call(print, "operand"));

  if (postfixExpression.arrayElementAccess !== undefined) {
    elements.push(
      path.call(
        print,
        "arrayElementAccess" as keyof PostfixExpression["arrayElementAccess"],
      ),
    );
  }

  if (postfixExpression.classMemberAccess !== undefined) {
    elements.push(
      path.call(
        print,
        "classMemberAccess" as keyof PostfixExpression["classMemberAccess"],
      ),
    );
  }

  if (postfixExpression.postfixOperatorKind !== undefined) {
    elements.push(getDocWithTrivia(postfixExpression.postfixOperatorToken!));
  }

  return elements;
}

function printPrimaryExpression(
  path: AstPath<PrimaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const primaryExpression = path.node;
  const elements = [];

  if (primaryExpression.openParenthesisToken !== undefined) {
    elements.push(getDocWithTrivia(primaryExpression.openParenthesisToken));
  }

  elements.push(path.call(print, "operand"));

  if (primaryExpression.closeParenthesisToken !== undefined) {
    elements.push(getDocWithTrivia(primaryExpression.closeParenthesisToken));
  }

  return elements;
}

function printStatement(
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

function printStringDefinition(
  path: AstPath<StringDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const stringDefinition = path.node;

  const elements = [];

  if (stringDefinition.isReserved) {
    elements.push(getDocWithTrivia(stringDefinition.reservedToken!));
  }
  if (stringDefinition.isLegacy) {
    elements.push(getDocWithTrivia(stringDefinition.legacyToken!));
  }
  if (stringDefinition.isConst) {
    elements.push(getDocWithTrivia(stringDefinition.constToken!));
  }

  if (stringDefinition.alignedModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "alignedModifier" as keyof StringDefinition["alignedModifier"],
      ),
    );
  }
  elements.push(getDocWithTrivia(stringDefinition.stringVariableKindToken));
  elements.push(path.call(print, "identifier"));

  if (stringDefinition.assignmentPunctuatorToken !== undefined) {
    elements.push(getDocWithTrivia(stringDefinition.assignmentPunctuatorToken));
    elements.push(
      path.call(
        print,
        "stringLiteral" as keyof StringDefinition["stringLiteral"],
      ),
    );
  }

  return [
    join(" ", elements),
    getDocWithTrivia(stringDefinition.semicolonPunctuatorToken),
  ];
}

function printStringLiteral(
  path: AstPath<StringLiteral>,
) {
  const stringLiteral = path.node;

  return join(
    " ",
    stringLiteral.stringLiteralTokens.map((stringLiteralToken) =>
      getDocWithTrivia(stringLiteralToken)
    ),
  );
}

function printSwitchCaseClause(
  path: AstPath<SwitchCaseClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const switchCaseClause = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(switchCaseClause.caseToken));
  elements.push(" ");
  elements.push([
    path.call(print, "value"),
    getDocWithTrivia(switchCaseClause.colonToken),
  ]);

  if (switchCaseClause.openBraceToken !== undefined) {
    elements.push(" ");
    elements.push(getDocWithTrivia(switchCaseClause.openBraceToken));
  }

  elements.push(indent([
    hardline,
    join(hardline, path.map(print, "statements")),
    hardline,
    getDocWithTrivia(switchCaseClause.breakToken),
    getDocWithTrivia(switchCaseClause.semicolonToken),
  ]));

  if (switchCaseClause.closeBraceToken !== undefined) {
    elements.push(getDocWithTrivia(switchCaseClause.closeBraceToken));
    elements.push(hardline);
  }

  return elements;
}

function printSwitchDefaultClause(
  path: AstPath<SwitchDefaultClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const switchDefaultClause = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(switchDefaultClause.defaultToken));
  elements.push(getDocWithTrivia(switchDefaultClause.colonToken));

  if (switchDefaultClause.openBraceToken !== undefined) {
    elements.push(" ");
    elements.push(getDocWithTrivia(switchDefaultClause.openBraceToken));
  }

  elements.push(indent([
    hardline,
    join(hardline, path.map(print, "statements")),
    hardline,
  ]));

  if (switchDefaultClause.closeBraceToken !== undefined) {
    elements.push(getDocWithTrivia(switchDefaultClause.closeBraceToken));
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
    getDocWithTrivia(switchStatement.openParenthesisToken),
    path.call(print, "expression"),
    getDocWithTrivia(switchStatement.closeParenthesisToken),
  ]);
  elements.push(getDocWithTrivia(switchStatement.openBraceToken));
  elements.push(
    path.map(print, "switchCaseClauses"),
  );
  if (switchStatement.switchDefaultClause !== undefined) {
    elements.push(
      path.call(
        print,
        "switchDefaultClause" as keyof SwitchStatement["switchDefaultClause"],
      ),
    );
  }
  elements.push(getDocWithTrivia(switchStatement.closeBraceToken));

  return join(" ", elements);
}

function printUnaryExpression(
  path: AstPath<UnaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const unaryExpression = path.node;

  return [
    getDocWithTrivia(unaryExpression.unaryOperatorToken),
    path.call(
      print,
      "operand",
    ),
  ];
}

function printWhileStatement(
  path: AstPath<WhileStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const whileStatement = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(whileStatement.whileKeywordToken));
  elements.push([
    getDocWithTrivia(whileStatement.openParenthesisToken),
    path.call(print, "expression"),
    getDocWithTrivia(whileStatement.closeParenthesisToken),
  ]);
  elements.push(path.call(print, "compoundStatement"));

  return join(" ", elements);
}

function printSpecification(
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

export default function print(
  path: AstPath<AbstractNode>,
  _options: ParserOptions<AbstractNode>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  const nodeKind = node.nodeKind;

  cleanupTrivia(node);

  switch (nodeKind) {
    case NodeKind.ALIGNED_MODIFIER:
      return printAlignedModifier(path as AstPath<AlignedModifier>, print);
    case NodeKind.ARRAY_DIMENSION:
      return printAbstractArrayDimension(
        path as AstPath<AbstractArrayDimension>,
        print,
      );
    case NodeKind.ARRAY_ELEMENT_ACCESS:
      return printArrayElementAccess(
        path as AstPath<ArrayElementAccess>,
        print,
      );
    case NodeKind.ARRAY_ELEMENT_TYPE:
      return printArrayElementType(path as AstPath<ArrayElementType>, print);
    case NodeKind.BIT_MODIFIER:
      return printBitModifier(path as AstPath<BitModifier>, print);
    case NodeKind.CLASS_ID:
      return printClassId(path as AstPath<AbstractClassId>, print);
    case NodeKind.CLASS_MEMBER_ACCESS:
      return printClassMemberAccess(path as AstPath<ClassMemberAccess>, print);
    case NodeKind.ELEMENTARY_TYPE:
      return printElementaryType(path as AstPath<ElementaryType>);
    case NodeKind.EXPRESSION:
      return printAbstractExpression(
        path as AstPath<AbstractExpression>,
        print,
      );
    case NodeKind.EXPANDABLE_MODIFIER:
      return printExpandableModifier(
        path as AstPath<ExpandableModifier>,
        print,
      );
    case NodeKind.EXTENDS_MODIFIER:
      return printExtendsModifier(path as AstPath<ExtendsModifier>, print);
    case NodeKind.IDENTIFIER:
      return printIdentifier(path as AstPath<Identifier>);
    case NodeKind.IF_CLAUSE:
      return printIfClause(path as AstPath<IfClause>, print);
    case NodeKind.LENGTH_ATTRIBUTE:
      return printLengthAttribute(path as AstPath<LengthAttribute>, print);
    case NodeKind.MAP_ENTRY:
      return printMapEntry(path as AstPath<MapEntry>, print);
    case NodeKind.MAP_ENTRY_LIST:
      return printMapEntryList(path as AstPath<MapEntryList>, print);
    case NodeKind.MAP_OUTPUT_VALUE:
      return printAbstractMapOutputValue(
        path as AstPath<AbstractMapOutputValue>,
        print,
      );
    case NodeKind.NUMBER_LITERAL:
      return printNumberLiteral(path as AstPath<NumberLiteral>);
    case NodeKind.PARAMETER:
      return printParameter(path as AstPath<Parameter>, print);
    case NodeKind.PARAMETER_LIST:
      return printParameterList(path as AstPath<ParameterList>, print);
    case NodeKind.PARAMETER_VALUE_LIST:
      return printParameterValueList(
        path as AstPath<ParameterValueList>,
        print,
      );
    case NodeKind.SPECIFICATION:
      return printSpecification(path as AstPath<Specification>, print);
    case NodeKind.STATEMENT:
      return printStatement(path as AstPath<AbstractStatement>, print);
    case NodeKind.STRING_LITERAL:
      return printStringLiteral(path as AstPath<StringLiteral>);
    case NodeKind.SWITCH_CASE_CLAUSE:
      return printSwitchCaseClause(path as AstPath<SwitchCaseClause>, print);
    case NodeKind.SWITCH_DEFAULT_CLAUSE:
      return printSwitchDefaultClause(
        path as AstPath<SwitchDefaultClause>,
        print,
      );
    default: {
      const exhaustiveCheck: never = nodeKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}
