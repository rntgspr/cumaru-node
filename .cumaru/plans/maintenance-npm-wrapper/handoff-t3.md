---
human_revised: false
plan: maintenance-npm-wrapper
task: T3
status: partial
date: 2026-11-17
summary: Framework guidance for Hand-off — maintenance-npm-wrapper / T3 and its required workflow.
---

# Hand-off — maintenance-npm-wrapper / T3

## Files touched

<!-- cumaru:touched -->
| Link | Description |
|------|-------------|
| [`.github/workflows/publish.yml`](../../../.github/workflows/publish.yml) | created — assembles and publishes all packages for one upstream version |
<!-- /cumaru:touched -->

## Decisions made during implementation

- Triggers: `workflow_dispatch` (input `version`) and `repository_dispatch` type `cumaru-release`.
- Node 24 for an npm version that supports trusted publishing; `NPM_TOKEN` is the fallback.
- Each package is skipped when its version already exists, so a failed run can be retried.
- Action versions follow upstream (`actions/checkout@v7.0.1`) and the latest `actions/setup-node` release (`v7.1.0`).

## Commands run / verification

- YAML parsed with Ruby `YAML.load_file` — five steps.
- The workflow was not executed on GitHub; no publish ran.

## Pending / follow-ups

- Push this repository to its own GitHub remote, then configure the npm trusted publisher (or `NPM_TOKEN`) for each `@cumaru/*` package.
- npm provenance requires `repository` in each manifest to match the publishing GitHub repository; update `package.json` `repository` if the wrapper repository is not `rntgspr/cumaru`.
- Optional: add a `repository_dispatch` step to the upstream release workflow.

## Suggestions for the Lead

- None.
