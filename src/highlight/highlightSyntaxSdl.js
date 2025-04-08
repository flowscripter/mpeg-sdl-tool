/**
 * Highlight.js SDL syntax highlighting definition
 */
export default function (hljs) {
  const COMMENTS = hljs.COMMENT("//", "$");

  const BUILT_INS = [
    "lengthof",
  ];

  const KEYWORDS = [
    "abstract",
    "aligned",
    "break",
    "case",
    "class",
    "computed",
    "const",
    "default",
    "do",
    "else",
    "expandable",
    "extends",
    "for",
    "if",
    "legacy",
    "map",
    "reserved",
    "switch",
    "while",
  ];

  const TYPES = [
    "unsigned",
    "bit",
    "int",
    "base64string",
    "float",
    "utf16string",
    "utf8string",
    "utf8list",
    "utfstring",
  ];

  const NUMBERS = {
    className: "number",
    variants: [
      {
        // Literal binary
        begin: "(0b[0-1]{1,4})",
      },
      {
        // Literal hexadecimal
        begin: "(0x[0-9a-fA-F]{1,4})",
      },
      {
        // Literal integer, decimal, float
        begin: "\\b\\d+(\\.\\d+)?(E\\d+)?",
      },
    ],
  };

  const MULTIPLE_CHARACTER_LITERALS = {
    className: "string",
    begin: /'[^']*'/,
  };

  const STRING_LITERALS = {
    className: "string",
    begin: /u?"[^"]*"/,
  };

  const PUNCTUATORS = {
    className: "punctuation",
    match: /[\(\)\[\]{};:]/,
  };

  const OPERATORS = {
    className: "operator",
    match: /[\.+\-*/%<>=!&\|]/,
  };

  return {
    name: "SDL",
    disableAutodetect: true,
    keywords: {
      keyword: KEYWORDS,
      type: TYPES,
    },
    built_ins: BUILT_INS,
    contains: [
      MULTIPLE_CHARACTER_LITERALS,
      STRING_LITERALS,
      COMMENTS,
      NUMBERS,
      PUNCTUATORS,
      OPERATORS,
    ],
  };
}
