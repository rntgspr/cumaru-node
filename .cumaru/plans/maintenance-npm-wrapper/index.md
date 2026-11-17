---
human_revised: false
scope:
  - distribution/npm
status: in-progress
summary: Ship the cumaru CLI on npm as a Biome-style thin Node wrapper with per-platform binary packages and automated GitHub publish.
targets: [platform]
aux: []
---

# npm wrapper for the cumaru CLI

## Overview

Node.js users need `cumaru` through npm. The upstream release already ships
four static binaries (`cumaru-<target>`) plus `SHA256SUMS` on each GitHub
Release of `rntgspr/cumaru`. This plan wraps those binaries without adding
behavior, following the Biome distribution model: one main package with a
tiny Node launcher and one optional package per platform that holds only the
binary.

The package version tracks the upstream release version. A GitHub Actions
workflow assembles and publishes all packages from a given upstream tag.

## Acceptance Criteria (EARS / RFC 2119)

- WHEN a user runs `cumaru <args>` from the installed `@cumaru/cumaru` package THE SYSTEM SHALL execute the platform binary with the same arguments, stdio, and exit code.
- WHEN no platform package matches the host THE SYSTEM SHALL print an error that names the host platform and exit with a non-zero code.
- WHEN the assemble script runs for version `X.Y.Z` THE SYSTEM SHALL download the four release binaries, verify each against `SHA256SUMS`, and write one package per platform plus the main package, all at version `X.Y.Z`.
- WHEN a binary checksum does not match THE SYSTEM SHALL stop with a non-zero exit code and publish nothing.
- WHEN the publish workflow runs for a tag THE SYSTEM SHALL publish the platform packages before the main package, with npm provenance.
- The wrapper MUST NOT add commands, options, or logic that the upstream `cumaru` binary does not provide.
- The repository MUST NOT commit any binary.

## Plan / DAG

| Task | Title | Status | Depends on |
|------|-------|--------|-----------|
| [T1](t1.md) | Node launcher and main package manifest | done | — |
| [T2](t2.md) | Assemble script for platform packages | done | T1 |
| [T3](t3.md) | GitHub Actions publish workflow | done | T2 |

## Out of scope

- Windows support (upstream ships no Windows binary).
- Changes to the upstream `rntgspr/cumaru` release workflow; a dispatch hook from upstream is a follow-up.
- Running an actual `npm publish`.

## Risks

- The repository `origin` points to `rntgspr/cumaru`; pushing this history there would overwrite upstream. Mitigation: set a dedicated remote before any push.
- npm already holds `@cumaru/cumaru@0.0.8`; versions from `0.15.1` sort higher, so no conflict.
- Publishing the `@cumaru/cli-*` packages requires publish rights on the `@cumaru` scope and an npm trusted publisher (or `NPM_TOKEN`) for this repository.
