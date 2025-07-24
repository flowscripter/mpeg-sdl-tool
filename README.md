# mpeg-sdl-tool

[![version](https://img.shields.io/github/v/release/flowscripter/mpeg-sdl-tool?sort=semver)](https://github.com/flowscripter/mpeg-sdl-tool/releases)
[![build](https://img.shields.io/github/actions/workflow/status/flowscripter/mpeg-sdl-tool/release-bun-executable.yml)](https://github.com/flowscripter/mpeg-sdl-tool/actions/workflows/release-bun-executable.yml)
[![coverage](https://codecov.io/gh/flowscripter/mpeg-sdl-tool/branch/main/graph/badge.svg?token=EMFT2938ZF)](https://codecov.io/gh/flowscripter/mpeg-sdl-tool)
[![license: MIT](https://img.shields.io/github/license/flowscripter/mpeg-sdl-tool)](https://github.com/flowscripter/mpeg-sdl-tool/blob/main/LICENSE)

> ISO/IEC 14496-34 Syntactic Description Language (MPEG SDL) CLI tool

## Binary Executable Usage

#### MacOS

Via [Homebrew](https://brew.sh/):

`brew install flowscripter/tap/mpeg-sdl-tool`

#### Linux

In a terminal:

`curl -fsSL https://raw.githubusercontent.com/flowscripter/mpeg-sdl-tool/main/script/install.sh | sh`

#### Windows

Via [Winget](https://github.com/microsoft/winget-cli):

`winget install Flowscripter.mpeg-sdl-tool`

#### Manual Install

You can download and extract the binary zip files from the
[releases](https://github.com/flowscripter/mpeg-sdl-tool/releases) page.

## Functional Tests

Refer to [functional_tests/README.md](functional_tests/README.md)

## Setup

`@mpeggroup/mpeg-sdl-parser` is hosted on GitHub packages, so before installing
dependencies, authentication needs to be configured. Create a GitHub class
personal access token which has permission to read packages and then set it in
your environment:

`export NPM_GITHUB_TOKEN=<your_classic_PAT>`

## Development

Install dependencies:

`bun install`

Test:

`bun test`

Run:

`bun run index.ts`

> During development this can be used to validate command definitions:
>
> `DYNAMIC_CLI_FRAMEWORK_VALIDATE_ALL=1 bun run index.ts`

> During development this can be used to enable framework logging:
>
> `DYNAMIC_CLI_FRAMEWORK_DEBUG=1 bun run index.ts`

Compile binary:

`bun build index.ts --compile --outfile /tmp/mpeg-sdl-tool`

**NOTE**: The following tasks use Deno as it excels at these and Bun does not
currently provide such functionality:

Format:

`deno fmt`

Lint:

`deno lint index.ts src/ tests/`

## Documentation

Refer to the [mpeg-sdl-parser](https://github.com/flowscripter/mpeg-sdl-parser)
documentation.

Refer to the
[dynamic-cli-framework](https://github.com/flowscripter/dynamic-cli-framework)
documentation.

## License

MIT © Flowscripter
