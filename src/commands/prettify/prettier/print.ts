import {
  AbstractArrayDimension,
  AbstractClassId,
  AbstractExpression,
  AbstractMapOutputValue,
  AbstractNode,
  AbstractStatement,
  AlignedModifier,
  ArrayDefinition,
  ArrayDimensionKind,
  ArrayElementAccess,
  ArrayElementType,
  BitModifier,
  ClassDeclaration,
  ClassDefinition,
  ClassIdKind,
  ClassMemberAccess,
  CompoundStatement,
  ComputedArrayDefinition,
  ComputedElementaryTypeDefinition,
  DoStatement,
  ElementaryType,
  ElementaryTypeDefinition,
  ElementaryTypeKind,
  ExpandableModifier,
  ExpressionKind,
  ExpressionStatement,
  ExtendsModifier,
  ForStatement,
  Identifier,
  IfClause,
  IfStatement,
  LengthAttribute,
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
  Specification,
  StatementKind,
  StringDefinition,
  StringLiteral,
  SwitchStatement,
  WhileStatement,
} from "@flowscripter/mpeg-sdl-parser";
import type { AstPath, Doc, ParserOptions } from "prettier";
import { doc } from "prettier";
const { ifBreak, group, indent, join, hardline } = doc.builders;

function printAbstractArrayDimension(
  path: AstPath<AbstractArrayDimension>,
): Doc {
  const { arrayDimensionKind } = path.node;
  switch (arrayDimensionKind) {
    case ArrayDimensionKind.EXPLICIT:
      // public readonly size: AbstractNode,
      // public readonly openBracketToken: SyntaxToken,
      // public readonly closeBracketToken: SyntaxToken,
      throw new Error("ArrayDimensionKind.EXPLICIT not implemented.");
    case ArrayDimensionKind.PARTIAL:
      // public readonly index: AbstractNode,
      // public readonly openBracketToken: SyntaxToken,
      // public readonly innerOpenBracketToken: SyntaxToken,
      // public readonly innerCloseBracketToken: SyntaxToken,
      // public readonly closeBracketToken: SyntaxToken,
      throw new Error("ArrayDimensionKind.PARTIAL not implemented.");
    case ArrayDimensionKind.IMPLICIT:
      // public readonly rangeStart: AbstractNode | undefined,
      // public readonly rangeEnd: AbstractNode | undefined,
      // public readonly openBracketToken: SyntaxToken,
      // public readonly rangeOperatorToken: SyntaxToken | undefined,
      // public readonly closeBracketToken: SyntaxToken,
      throw new Error("ArrayDimensionKind.IMPLICIT not implemented.");
    default: {
      const exhaustiveCheck: never = arrayDimensionKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printAbstractExpression(path: AstPath<AbstractExpression>): Doc {
  const { expressionKind } = path.node;
  switch (expressionKind) {
    case ExpressionKind.BINARY:
      // public readonly leftOperand: AbstractNode,
      // public readonly binaryOperatorKind: BinaryOperatorKind,
      // public readonly rightOperand: AbstractNode,
      // public readonly binaryOperandToken: SyntaxToken,
      throw new Error("ExpressionKind.BINARY not implemented.");
    case ExpressionKind.LENGTH_OF:
      // public readonly operand: AbstractNode,
      // public readonly lengthOfToken: SyntaxToken,
      // public readonly openParenthesisPunctuatorToken: SyntaxToken,
      // public readonly closeParenthesisPunctuatorToken: SyntaxToken,
      throw new Error("ExpressionKind.LENGTH_OF not implemented.");
    case ExpressionKind.POSTFIX:
      // public readonly operand: AbstractNode,
      // public readonly arrayElementAccess: ArrayElementAccess | undefined,
      // public readonly classMemberAccess: ClassMemberAccess | undefined,
      // public readonly postfixOperatorKind: PostfixOperatorKind | undefined,
      // public readonly postfixOperatorToken: SyntaxToken | undefined,
      throw new Error("ExpressionKind.POSTFIX not implemented.");
    case ExpressionKind.PRIMARY:
      // public readonly operand: Identifier | NumberLiteral | AbstractNode,
      // public readonly openParenthesisToken: SyntaxToken | undefined,
      // public readonly closeParenthesisToken: SyntaxToken | undefined,
      throw new Error("ExpressionKind.PRIMARY not implemented.");
    case ExpressionKind.UNARY:
      // public readonly unaryOperatorKind: UnaryOperatorKind,
      // public readonly operand: AbstractNode,
      // public readonly unaryOperatorToken: SyntaxToken,
      throw new Error("ExpressionKind.UNARY not implemented.");
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
): doc.builders.Doc {
  const { mapOutputValueKind } = path.node;
  switch (mapOutputValueKind) {
    case MapOutputValueKind.SINGLE:
      // public readonly numberLiteralValue: NumberLiteral | undefined,
      // public readonly elementaryType: ElementaryType | undefined,
      // public readonly lengthAttribute: LengthAttribute | undefined,
      throw new Error("MapOutputValueKind.SINGLE not implemented.");
    case MapOutputValueKind.AGGREGATE:
      // public readonly outputValues: AbstractMapOutputValue[],
      // public readonly openBraceToken: SyntaxToken,
      // public readonly commaTokens: SyntaxToken[] | undefined,
      // public readonly closeBraceToken: SyntaxToken,
      throw new Error("ExpressionKind.AGGREGATE not implemented.");
    default: {
      const exhaustiveCheck: never = mapOutputValueKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printAlignedModifier(_path: AstPath<AlignedModifier>): Doc {
  // public readonly bitCount: number,
  // public readonly isDefault8BitCount: boolean,
  // public readonly bitCountModifier: NumberLiteral | undefined,
  // public readonly alignedToken: SyntaxToken,
  // public readonly openParenthesisToken?: SyntaxToken,
  // public readonly closeParenthesisToken?: SyntaxToken,
  throw new Error("printAlignedModifier not implemented yet");
}

function printArrayDefinition(_path: AstPath<ArrayDefinition>): Doc {
  // public readonly isReserved: boolean,
  // public readonly isLegacy: boolean,
  // public readonly alignedModifier: AlignedModifier | undefined,
  // public readonly arrayElementType: ArrayElementType,
  // identifier: Identifier,
  // public readonly implicitArrayDimension: ImplicitArrayDimension | undefined,
  // public readonly dimensions:
  //   | (ExplicitArrayDimension | PartialArrayDimension)[]
  //   | undefined,
  // public readonly reservedToken: SyntaxToken | undefined,
  // public readonly legacyToken: SyntaxToken | undefined,
  // semicolonPunctuatorToken: SyntaxToken,
  throw new Error("printArrayDefinition not implemented yet");
}

function printArrayElementAccess(_path: AstPath<ArrayElementAccess>): Doc {
  // public readonly index: AbstractNode,
  // public readonly openBracketToken: SyntaxToken,
  // public readonly closeBracketToken: SyntaxToken,
  throw new Error("printArrayElementAccess not implemented yet");
}

function printArrayElementType(_path: AstPath<ArrayElementType>): Doc {
  // public readonly elementaryType: ElementaryType | undefined,
  // public readonly lengthAttribute: LengthAttribute | undefined,
  // public readonly classIdentifier: Identifier | undefined,
  throw new Error("printArrayElementType not implemented yet");
}

function printBitModifier(_path: AstPath<BitModifier>): Doc {
  // public readonly length: NumberLiteral,
  // public readonly identifier: Identifier | undefined,
  // public readonly classId: AbstractClassId,
  // public readonly colonToken: SyntaxToken,
  // public readonly bitKeywordToken: SyntaxToken,
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly closeParenthesisToken: SyntaxToken,
  // public readonly assignmentToken: SyntaxToken | undefined,
  throw new Error("printBitModifier not implemented yet");
}

function printClassDeclaration(path: AstPath<ClassDeclaration>, print: (path: AstPath<AbstractNode>) => Doc): Doc {

  const classDeclaration = path.node;

  const groupElements = [];

  if (classDeclaration.alignedModifier) {
    groupElements.push(path.call(print, "alignedModifier" as keyof ClassDeclaration["alignedModifier"]));
  }

  if (classDeclaration.expandableModifier) {
    groupElements.push(path.call(print, "expandableModifier" as keyof ClassDeclaration["expandableModifier"]));
  }

  if (classDeclaration.isAbstract) {
    groupElements.push("abstract");
  }

  groupElements.push("class");
  groupElements.push("identifier");

  if (classDeclaration.parameterList !== undefined) {
    groupElements.push(path.call(print, "parameterList" as keyof ClassDeclaration["parameterList"]));
  }

  if (classDeclaration.extendsModifier !== undefined) {
    groupElements.push(path.call(print, "extendsModifier" as keyof ClassDeclaration["extendsModifier"]));
  }

  if (classDeclaration.bitModifier !== undefined) {
    groupElements.push(path.call(print, "bitModifier" as keyof ClassDeclaration["bitModifier"]));
  }

  groupElements.push('{');
  groupElements.push(hardline);

  return [
    group(groupElements),
    indent([
      join(
        hardline,
        path.map(print, "statements"),
      ),
      hardline
    ]),
    '}',
    hardline
  ];
}

function printClassDefinition(_path: AstPath<ClassDefinition>): Doc {
  // public readonly isLegacy: boolean,
  // public readonly classIdentifier: Identifier,
  // public readonly identifier: Identifier,
  // public readonly parameterValueList: ParameterValueList | undefined,
  // public readonly legacyToken: SyntaxToken | undefined,
  // public readonly semicolonToken: SyntaxToken,
  throw new Error("printClassDefinition not implemented yet");
}

function printClassId(path: AstPath<AbstractClassId>): Doc {
  const { classIdKind } = path.node;
  switch (classIdKind) {
    case ClassIdKind.SINGLE:
      // public readonly value: NumberLiteral,
      throw new Error("ClassIdKind.SINGLE not implemented.");
    case ClassIdKind.RANGE:
      // public readonly startClassId: SingleClassId,
      // public readonly endClassId: SingleClassId,
      // public readonly rangeToken: SyntaxToken,
      throw new Error("ClassIdKind.RANGE not implemented.");
    case ClassIdKind.EXTENDED_RANGE:
      // public readonly classIds: Array<(SingleClassId | ClassIdRange)>,
      // public readonly commaTokens: SyntaxToken[],
      throw new Error("ClassIdKind.EXTENDED_RANGE not implemented.");
    default: {
      const exhaustiveCheck: never = classIdKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printClassMemberAccess(_path: AstPath<ClassMemberAccess>): Doc {
  // public readonly memberIdentifier: Identifier,
  // public readonly classMemberAccessOperatorToken: SyntaxToken,
  throw new Error("printClassMemberAccess not implemented yet");
}

function printCompoundStatement(_path: AstPath<CompoundStatement>): Doc {
  // public readonly statements: AbstractStatement[],
  // public readonly openBracePunctuatorToken: SyntaxToken,
  // public readonly closeBracePunctuatorToken: SyntaxToken,
  throw new Error("printCompoundStatement not implemented yet");
}

function printComputedArrayDefinition(
  _path: AstPath<ComputedArrayDefinition>,
): Doc {
  // public readonly elementaryType: ElementaryType,
  // identifier: Identifier,
  // public readonly dimensions: ExplicitArrayDimension[],
  // public readonly computedToken: SyntaxToken,
  // semicolonPunctuatorToken: SyntaxToken,
  throw new Error("printComputedArrayDefinition not implemented yet");
}

function printComputedElementaryTypeDefinition(
  path: AstPath<ComputedElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc
): Doc {
  const groupElements = [];

  const computedElementaryTypeDefinition = path.node;
  groupElements.push("computed");
  if (computedElementaryTypeDefinition.isConst) {
    groupElements.push("const");
  }
  groupElements.push(path.call(print, "elementaryType"));
  groupElements.push(path.call(print, "identifier"));
  if (computedElementaryTypeDefinition.value) {
    groupElements.push("=");
    groupElements.push(path.call(print, "value" as keyof ComputedElementaryTypeDefinition["value"]));
  }
  groupElements.push(";");

  return group(groupElements);
}

function printDoStatement(_path: AstPath<DoStatement>): Doc {
  // public readonly compoundStatement: CompoundStatement,
  // public readonly conditionExpression: AbstractNode,
  // public readonly doKeywordToken: SyntaxToken,
  // public readonly whileKeywordToken: SyntaxToken,
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly closeParenthesisToken: SyntaxToken,
  // public readonly semicolonToken: SyntaxToken,
  throw new Error("printDoStatement not implemented yet");
}

function printElementaryType(path: AstPath<ElementaryType>): Doc {

  const elementaryType = path.node;
  const elementaryTypeKind = elementaryType.elementaryTypeKind;

  switch (elementaryTypeKind) {
    case ElementaryTypeKind.BIT:
      return "bit";
    case ElementaryTypeKind.FLOATING_POINT:
      return "float";
    case ElementaryTypeKind.INTEGER:
      return "int";
    case ElementaryTypeKind.UNSIGNED_INTEGER:
      return group([
        "unsigned",
        "int"
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
  print: (path: AstPath<AbstractNode>) => Doc
): Doc {
  const elementaryTypeDefinition = path.node;

  const groupElements = [];

  if (elementaryTypeDefinition.isReserved) {
    groupElements.push("reserved");
  }

  if (elementaryTypeDefinition.isLegacy) {
    groupElements.push("legacy");
  }

  if (elementaryTypeDefinition.isConst) {
    groupElements.push("const");
  }

  if (elementaryTypeDefinition.alignedModifier) {
    groupElements.push(path.call(print, "alignedModifier" as keyof ElementaryTypeDefinition["alignedModifier"]));
  }

  groupElements.push(path.call(print, "elementaryType"));
  groupElements.push(path.call(print, "lengthAttribute"));

  if (elementaryTypeDefinition.isLookahead) {
    groupElements.push("*");
  }

  groupElements.push(path.call(print, "identifier"));

  if (elementaryTypeDefinition.assignmentToken) {
    groupElements.push("=");
    groupElements.push(path.call(print, "value" as keyof ElementaryTypeDefinition["value"]));
    if (elementaryTypeDefinition.endValue) {
      groupElements.push("..");
      groupElements.push(path.call(print, "endValue" as keyof ElementaryTypeDefinition["endValue"]));
    }
  }

  groupElements.push(";");

  return [
    group(groupElements),
    hardline
  ];
}

function printExpandableModifier(_path: AstPath<ExpandableModifier>): Doc {
  // public readonly maxClassSize: NumberLiteral | undefined,
  // public readonly expandableToken: SyntaxToken,
  // public readonly openParenthesisToken: SyntaxToken | undefined,
  // public readonly closeParenthesisToken: SyntaxToken | undefined,
  throw new Error("printExpandableModifier not implemented yet");
}

function printExpressionStatement(
  _path: AstPath<ExpressionStatement>,
): Doc {
  // public readonly expression: AbstractNode,
  // public readonly semicolonPunctuatorToken: SyntaxToken,
  throw new Error("printExpressionStatement not implemented yet");
}

function printExtendsModifier(_path: AstPath<ExtendsModifier>): Doc {
  // public readonly identifier: Identifier,
  // public readonly parameterValueList: ParameterValueList | undefined,
  // public readonly extendsToken: SyntaxToken,
  throw new Error("printExtendsModifier not implemented yet");
}

function printForStatement(_path: AstPath<ForStatement>): Doc {
  // // either ((assignment_expression semicolon) | computed_elementary_type_definition | semicolon)
  // public readonly expression1: AbstractExpression | undefined,
  // public readonly computedElementaryDefinition:
  //   | ComputedElementaryTypeDefinition
  //   | undefined,
  // public readonly expression2: AbstractExpression | undefined,
  // public readonly expression3: AbstractExpression | undefined,
  // public readonly compoundStatement: CompoundStatement,
  // public readonly forKeywordToken: SyntaxToken,
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly semicolonToken1: SyntaxToken | undefined,
  // public readonly semicolonToken2: SyntaxToken,
  // public readonly closeParenthesisToken: SyntaxToken,
  throw new Error("printForStatement not implemented yet");
}

function printIfStatement(path: AstPath<IfStatement>, print: (_path: AstPath<AbstractNode>) => Doc): Doc {
  const ifStatement = path.node;

  const groupElements = [];

  for (const ifClause of ifStatement.clauses) {

    if (ifClause.elseToken) {
      groupElements.push("else");
    }

    if (ifClause.ifToken) {
      groupElements.push("if");
      groupElements.push("(");
      groupElements.push(path.call(print, "condition" as keyof IfClause["condition"]));
      groupElements.push(")");
    }
    print(ifClause.statement as AstPath<AbstractNode>);
    groupElements.push(path.call(print, "statement" as keyof AbstractNode));
  }

  return group(groupElements);
}

function printLengthAttribute(path: AstPath<LengthAttribute>, print: (path: AstPath<AbstractNode>) => Doc): Doc {
  return group([
    "(",
      path.call(print, "length"),
    ")"
  ]);
}

function printMapDeclaration(_path: AstPath<MapDeclaration>): Doc {
  // public readonly identifier: Identifier,
  // public readonly outputElementaryType: ElementaryType | undefined,
  // public readonly outputClassIdentifier: Identifier | undefined,
  // public readonly mapEntryList: MapEntryList,
  // public readonly mapToken: SyntaxToken,
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly closeParenthesisToken: SyntaxToken,
  throw new Error("printMapDeclaration not implemented yet");
}

function printMapDefinition(_path: AstPath<MapDefinition>): Doc {
  // public readonly isReserved: boolean,
  // public readonly isLegacy: boolean,
  // public readonly elementaryType: ElementaryType | undefined,
  // public readonly classIdentifier: Identifier | undefined,
  // public readonly mapIdentifier: Identifier,
  // public readonly identifier: Identifier,
  // public readonly reservedToken: SyntaxToken | undefined,
  // public readonly legacyToken: SyntaxToken | undefined,
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly closeParenthesisToken: SyntaxToken,
  // public readonly semicolonToken: SyntaxToken,
  throw new Error("printMapDefinition not implemented yet");
}

function printMapEntry(_path: AstPath<MapEntry>): doc.builders.Doc {
  // public readonly inputValue: NumberLiteral,
  // public readonly outputValue: AggregateMapOutputValue,
  // public readonly commaToken: SyntaxToken,
  throw new Error("printMapEntry not implemented.");
}

function printMapEntryList(_path: AstPath<MapEntryList>): doc.builders.Doc {
  // public readonly mapEntries: MapEntry[],
  // public readonly openBraceToken: SyntaxToken,
  // public readonly commaTokens: SyntaxToken[] | undefined,
  // public readonly closeBraceToken: SyntaxToken,
  throw new Error("printMapEntryList not implemented.");
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
        return numberLiteral.tokens[0].text;
    case NumberLiteralKind.MULTIPLE_CHARACTER:
      return [
        join(
          ifBreak("", " "),
          numberLiteral.tokens.map((token) => token.text),
        )
      ];
    default: {
      const exhaustiveCheck: never = numberLiteralKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printParameter(_path: AstPath<Parameter>): doc.builders.Doc {
  // public readonly classIdentifier: Identifier | undefined,
  // public readonly elementaryType: ElementaryType | undefined,
  // public readonly identifier: Identifier,
  throw new Error("printParameter not implemented.");
}

function printParameterList(_path: AstPath<ParameterList>): doc.builders.Doc {
  // public readonly parameters: Parameter[],
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly commaTokens: SyntaxToken[] | undefined,
  // public readonly closeParenthesisToken: SyntaxToken,
  throw new Error("printParameterList not implemented.");
}

function printParameterValueList(
  _path: AstPath<ParameterValueList>,
): doc.builders.Doc {
  // public readonly values: AbstractNode[],
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly commaTokens: SyntaxToken[] | undefined,
  // public readonly closeParenthesisToken: SyntaxToken,
  throw new Error("printParameterValueList not implemented.");
}

function printStatement(path: AstPath<AbstractStatement>, print: (_path: AstPath<AbstractNode>) => Doc): Doc {
  const abstractStatement = path.node;
  const statementKind = abstractStatement.statementKind;
  switch (statementKind) {
    case StatementKind.ARRAY_DEFINITION:
      return printArrayDefinition(path as AstPath<ArrayDefinition>);
    case StatementKind.COMPUTED_ARRAY_DEFINITION:
      return printComputedArrayDefinition(
        path as AstPath<ComputedArrayDefinition>,
      );
    case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
      return printComputedElementaryTypeDefinition(
        path as AstPath<ComputedElementaryTypeDefinition>, print
      );
    case StatementKind.CLASS_DECLARATION:
      return printClassDeclaration(path as AstPath<ClassDeclaration>, print);
    case StatementKind.CLASS_DEFINITION:
      return printClassDefinition(path as AstPath<ClassDefinition>);
    case StatementKind.COMPOUND:
      return printCompoundStatement(path as AstPath<CompoundStatement>);
    case StatementKind.DO:
      return printDoStatement(path as AstPath<DoStatement>);
    case StatementKind.ELEMENTARY_TYPE_DEFINITION:
      return printElementaryTypeDefinition(
        path as AstPath<ElementaryTypeDefinition>, print
      );
    case StatementKind.EXPRESSION:
      return printExpressionStatement(path as AstPath<ExpressionStatement>);
    case StatementKind.FOR:
      return printForStatement(path as AstPath<ForStatement>);
    case StatementKind.IF:
      return printIfStatement(path as AstPath<IfStatement>, print);
    case StatementKind.MAP_DECLARATION:
      return printMapDeclaration(path as AstPath<MapDeclaration>);
    case StatementKind.MAP_DEFINITION:
      return printMapDefinition(path as AstPath<MapDefinition>);
    case StatementKind.STRING_DEFINITION:
      return printStringDefinition(path as AstPath<StringDefinition>);
    case StatementKind.SWITCH:
      return printSwitchStatement(path as AstPath<SwitchStatement>);
    case StatementKind.WHILE:
      return printWhileStatement(path as AstPath<WhileStatement>);
    default: {
      const exhaustiveCheck: never = statementKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}

function printStringDefinition(_path: AstPath<StringDefinition>): Doc {
  // public readonly isReserved: boolean,
  // public readonly isLegacy: boolean,
  // public readonly isConst: boolean,
  // public readonly alignedModifier: AlignedModifier | undefined,
  // public readonly stringVariableKind: StringVariableKind,
  // public readonly identifier: Identifier,
  // public readonly stringLiteral: StringLiteral | undefined,
  // public readonly reservedToken: SyntaxToken | undefined,
  // public readonly legacyToken: SyntaxToken | undefined,
  // public readonly constToken: SyntaxToken | undefined,
  // public readonly stringVariableKindToken: SyntaxToken,
  // public readonly assignmentPunctuatorToken: SyntaxToken | undefined,
  // public readonly semicolonPunctuatorToken: SyntaxToken,
  throw new Error("printStringDefinition not implemented yet");
}

function printSwitchStatement(_path: AstPath<SwitchStatement>): Doc {
  // public readonly expression: AbstractNode,
  // public readonly switchCaseClauses: SwitchCaseClause[],
  // public readonly switchDefaultClause: SwitchDefaultClause | undefined,
  // public readonly switchKeywordToken: SyntaxToken,
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly closeParenthesisToken: SyntaxToken,
  // public readonly openBraceToken: SyntaxToken,
  // public readonly closeBraceToken: SyntaxToken,
  throw new Error("printSwitchStatement not implemented yet");
}

function printWhileStatement(_path: AstPath<WhileStatement>): Doc {
  // public readonly expression: AbstractExpression,
  // public readonly compoundStatement: CompoundStatement,
  // public readonly whileKeywordToken: SyntaxToken,
  // public readonly openParenthesisToken: SyntaxToken,
  // public readonly closeParenthesisToken: SyntaxToken,
  throw new Error("printWhileStatement not implemented yet");
}

export default function print(
  path: AstPath<AbstractNode>,
  _options: ParserOptions<AbstractNode>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  const nodeKind = node.nodeKind;

  switch (nodeKind) {
    case NodeKind.ALIGNED_MODIFIER:
      return printAlignedModifier(path as AstPath<AlignedModifier>);
    case NodeKind.ARRAY_DIMENSION:
      return printAbstractArrayDimension(
        path as AstPath<AbstractArrayDimension>,
      );
    case NodeKind.ARRAY_ELEMENT_ACCESS:
      return printArrayElementAccess(path as AstPath<ArrayElementAccess>);
    case NodeKind.ARRAY_ELEMENT_TYPE:
      return printArrayElementType(path as AstPath<ArrayElementType>);
    case NodeKind.BIT_MODIFIER:
      return printBitModifier(path as AstPath<BitModifier>);
    case NodeKind.CLASS_ID:
      return printClassId(path as AstPath<AbstractClassId>);
    case NodeKind.CLASS_MEMBER_ACCESS:
      return printClassMemberAccess(path as AstPath<ClassMemberAccess>);
    case NodeKind.ELEMENTARY_TYPE:
      return printElementaryType(path as AstPath<ElementaryType>);
    case NodeKind.EXPRESSION:
      return printAbstractExpression(path as AstPath<AbstractExpression>);
    case NodeKind.EXPANDABLE_MODIFIER:
      return printExpandableModifier(path as AstPath<ExpandableModifier>);
    case NodeKind.EXTENDS_MODIFIER:
      return printExtendsModifier(path as AstPath<ExtendsModifier>);
    case NodeKind.IDENTIFIER:
      return (node as Identifier).name;
    case NodeKind.LENGTH_ATTRIBUTE:
      return printLengthAttribute(path as AstPath<LengthAttribute>, print);
    case NodeKind.MAP_ENTRY:
      return printMapEntry(path as AstPath<MapEntry>);
    case NodeKind.MAP_ENTRY_LIST:
      return printMapEntryList(path as AstPath<MapEntryList>);
    case NodeKind.MAP_OUTPUT_VALUE:
      return printAbstractMapOutputValue(
        path as AstPath<AbstractMapOutputValue>,
      );
    case NodeKind.NUMBER_LITERAL:
      return printNumberLiteral(path as AstPath<NumberLiteral>);
    case NodeKind.PARAMETER:
      return printParameter(path as AstPath<Parameter>);
    case NodeKind.PARAMETER_LIST:
      return printParameterList(path as AstPath<ParameterList>);
    case NodeKind.PARAMETER_VALUE_LIST:
      return printParameterValueList(path as AstPath<ParameterValueList>);
    case NodeKind.SPECIFICATION:
      return join(
        hardline,
        (path as AstPath<Specification>).map(print, "globals"),
      );
    case NodeKind.STATEMENT:
      return printStatement(path as AstPath<AbstractStatement>, print);
    case NodeKind.STRING_LITERAL:
      return (node as StringLiteral).value;
    default: {
      const exhaustiveCheck: never = nodeKind;
      throw new Error(
        "Unreachable code reached, case: " + exhaustiveCheck,
      );
    }
  }
}
