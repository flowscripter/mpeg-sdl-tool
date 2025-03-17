import {
  BannerServiceProvider,
  launchMultiCommandCLI,
  SyntaxHighlighterServiceProvider,
} from "@flowscripter/dynamic-cli-framework";
import command1 from "./commands/validate.ts";
import command2 from "./commands/prettify.ts";
import packageJson from "../package.json";

/**
 * Run the CLI.
 */
export async function cli(): Promise<void> {
  await launchMultiCommandCLI(
    [command1, command2],
    "ISO/IEC 14496-34 Syntactic Description Language (MPEG SDL) CLI tool.",
    "mpeg-sdl-tool",
    packageJson.version,
    false, // disable env vars support for configuration defaults
    false, // disable configuration support
    false, // disable key-value service
    [
      new BannerServiceProvider(50), // renders an ascii banner on CLI launch
      new SyntaxHighlighterServiceProvider(40), // exposes syntax highlighting service
    ],
  );
}
