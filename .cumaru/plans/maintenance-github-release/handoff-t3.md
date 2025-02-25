---
human_revised: false
plan: maintenance-github-release
task: T3
status: complete
date: 2026-11-17
summary: Framework guidance for Hand-off — maintenance-github-release / T3 and its required workflow.
---

# Hand-off — maintenance-github-release / T3

## Files touched

<!-- cumaru:touched -->
| Link | Description |
|------|-------------|
| [`.github/workflows/publish.yml`](../../../.github/workflows/publish.yml) | modified — triggers on `release: published`, `workflow_call`, and `workflow_dispatch` |
| [`README.md`](../../../README.md) | modified — release section describes the dispatch and release flow |
<!-- /cumaru:touched -->

## Decisions made during implementation

- `repository_dispatch` moved to `sync.yml`; `publish.yml` validates `X.Y.Z` before assembling.

## Commands run / verification

- `actionlint .github/workflows/*.yml` — no issues.
- Called from `sync.yml` for `0.15.1`: assemble and smoke passed; publish failed with `ENEEDAUTH` (no npm credential yet).

## Pending / follow-ups

- Real publish proof belongs to T6.

## Suggestions for the Lead

- None.
