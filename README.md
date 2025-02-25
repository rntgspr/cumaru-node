# @cumaru/cumaru

Node.js wrapper for the [Cumaru](https://github.com/rntgspr/cumaru) CLI. It runs the official
`cumaru` binary for your platform and adds no behavior of its own.

## Install

```bash
npm install --save-dev @cumaru/cumaru
npx cumaru help
```

Supported platforms: macOS (arm64, x64) and Linux (arm64, x64). Do not install with
`--omit=optional`; the binary ships in an optional platform package.

Set `CUMARU_BINARY` to run a different `cumaru` binary through the wrapper.

## Release

The package version matches the upstream Cumaru release.

1. A release `X.Y.Z` in [rntgspr/cumaru](https://github.com/rntgspr/cumaru) sends a
   `repository_dispatch` event `cumaru-release` with `{"version": "X.Y.Z"}`. The **Sync upstream
   release** workflow creates release `X.Y.Z` here and calls **Publish npm**.
   A GitHub Release published by hand also triggers **Publish npm**, and so does a manual run
   with `version: X.Y.Z`.
2. The workflow runs `node scripts/assemble.mjs X.Y.Z`. It downloads the release binaries,
   verifies them against `SHA256SUMS`, and writes the packages to `npm/`.
3. It publishes `@cumaru/cli-*` first, then `@cumaru/cumaru`, with npm provenance.

npm authentication uses a trusted publisher for this repository, or the `NPM_TOKEN` secret.
