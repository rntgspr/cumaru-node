---
human_revised: false
plan: maintenance-github-release
task: T4
status: complete
date: 2026-11-17
summary: Framework guidance for Hand-off — maintenance-github-release / T4 and its required workflow.
---

# Hand-off — maintenance-github-release / T4

## Files touched

<!-- cumaru:touched -->
| Link | Description |
|------|-------------|
| [`.github/workflows/sync.yml`](../../../.github/workflows/sync.yml) | created — mirrors an upstream release and calls `publish.yml` |
<!-- /cumaru:touched -->

## Decisions made during implementation

- Publish runs only when this run created the release, so a repeated dispatch is a no-op.

## Commands run / verification

- `gh api repos/rntgspr/cumaru-node/dispatches ... version=0.15.1` — job `release` success, release `0.15.1` created on `main`; job `publish` reached the npm step and failed with `ENEEDAUTH`.

## Pending / follow-ups

- Release `0.15.1` exists without npm packages; T6 publishes it through `workflow_dispatch`.

## Suggestions for the Lead

- None.
