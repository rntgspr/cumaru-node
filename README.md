# @cumaru/cumaru

[![Star](https://img.shields.io/github/stars/rntgspr/cumaru-node?label=star&logo=github)](https://github.com/rntgspr/cumaru-node)
[![Release](https://img.shields.io/github/v/release/rntgspr/cumaru-node?label=release)](https://github.com/rntgspr/cumaru-node/releases/latest)
[![License](https://img.shields.io/npm/l/@cumaru/cumaru)](https://www.npmjs.com/package/@cumaru/cumaru)
[![Tests](https://img.shields.io/github/actions/workflow/status/rntgspr/cumaru-node/ci.yml?branch=main&label=tests&logo=githubactions&logoColor=white)](https://github.com/rntgspr/cumaru-node/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@cumaru/cumaru?logo=npm)](https://www.npmjs.com/package/@cumaru/cumaru)
[![Sponsor](https://img.shields.io/badge/sponsor-rntgspr-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/rntgspr)

The [Cumaru](https://cumaru.dev) CLI, distributed through npm.

**Give your AI agents roots.** Cumaru is a context-oriented framework for AI-assisted work. It
turns your repository into a navigable knowledge tree for AI coding agents such as Claude Code,
Codex, and OpenCode: a durable knowledge base, spec-driven development plans, and execution
disciplines. It is an alternative to OpenSpec, Spec Kit, and memory-bank workflows.

This package is only a thin Node.js wrapper: it runs the official `cumaru` binary for your
platform and adds no behavior of its own.

- Website and docs: [cumaru.dev](https://cumaru.dev)
- CLI source and releases: [rntgspr/cumaru](https://github.com/rntgspr/cumaru)

## Install

Run without installing:

```bash
npx @cumaru/cumaru help
```

Add it to a project:

```bash
npm install --save-dev @cumaru/cumaru
npx cumaru install agent claude
npx cumaru doctor
```

Or install it globally:

```bash
npm install --global @cumaru/cumaru
cumaru version
```

For all commands, run `cumaru help` or see [cumaru.dev](https://cumaru.dev).

## Supported platforms

| OS | Architecture | Package |
|---|---|---|
| macOS | arm64 | `@cumaru/cli-darwin-arm64` |
| macOS | x64 | `@cumaru/cli-darwin-x64` |
| Linux | arm64 | `@cumaru/cli-linux-arm64` |
| Linux | x64 | `@cumaru/cli-linux-x64` |

Windows is not supported, because upstream ships no Windows binary.

## How it works

- `@cumaru/cumaru` contains a small launcher and lists one optional dependency per platform.
- npm installs only the platform package that matches your OS and CPU. Each platform package
  holds only the `cumaru` binary.
- The launcher runs that binary with your arguments, stdio, and exit code.

Do not install with `--omit=optional` or `--no-optional`. The binary ships in an optional package.

To run a different `cumaru` binary through the wrapper, set `CUMARU_BINARY` to its path.

## Versions

The package version follows the upstream Cumaru release:

- `X.Y.Z` wraps the upstream release `X.Y.Z`.
- `X.Y.Z-revN` is a wrapper-only revision (for example docs or launcher fixes) of `X.Y.Z`. It runs
  the same `X.Y.Z` binary and is published under the `latest` tag.

The platform packages `@cumaru/cli-*` only ever carry upstream versions. Every package is
published from this repository through [npm trusted publishing](https://docs.npmjs.com/trusted-publishers)
(OIDC, no npm token) with [npm provenance](https://docs.npmjs.com/generating-provenance-statements).

The package has no install scripts, so it installs under npm v12 defaults without
`npm approve-scripts`.

## Release

Releases are automatic:

1. A release `X.Y.Z` in [rntgspr/cumaru](https://github.com/rntgspr/cumaru) sends a
   `repository_dispatch` event `cumaru-release` with `{"version": "X.Y.Z"}` to this repository.
2. The **Sync upstream release** workflow creates release `X.Y.Z` here and starts **Publish npm**.
3. **Publish npm** runs `node scripts/assemble.mjs X.Y.Z`. The script downloads the release
   binaries, verifies them against `SHA256SUMS`, and writes the packages to `npm/`.
4. It publishes the `@cumaru/cli-*` packages first, then `@cumaru/cumaru`.

To publish by hand, publish a GitHub Release `X.Y.Z` in this repository, or run **Publish npm**
with `version: X.Y.Z`.

## License

MIT
