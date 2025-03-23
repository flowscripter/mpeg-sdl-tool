import {
  AsciiBannerGeneratorServiceProvider,
  BannerServiceProvider,
  launchMultiCommandCLI,
  PrettyPrinterServiceProvider,
  SyntaxHighlighterServiceProvider,
} from "@flowscripter/dynamic-cli-framework";
import validate from "./commands/validate/validate.ts";
import prettify from "./commands/prettify/prettify.ts";
import packageJson from "../package.json";

/**
 * Run the CLI.
 */
export async function cli(): Promise<void> {
  await launchMultiCommandCLI(
    [validate, prettify],
    "ISO/IEC 14496-34 Syntactic Description Language (MPEG SDL) CLI tool.",
    "mpeg-sdl-tool",
    packageJson.version,
    false, // disable env vars support for configuration defaults
    false, // disable configuration support
    false, // disable key-value service
    [
      new BannerServiceProvider(50), // renders an ascii banner on CLI launch
      new AsciiBannerGeneratorServiceProvider(45), // exposes ascii banner generation service
      new SyntaxHighlighterServiceProvider(40), // exposes syntax highlighting service
      new PrettyPrinterServiceProvider(40), // exposes pretty printing service
    ],
  );
}
