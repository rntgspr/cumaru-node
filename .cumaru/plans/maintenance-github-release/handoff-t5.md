---
human_revised: false
plan: maintenance-github-release
task: T5
status: partial
date: 2026-11-17
summary: Framework guidance for Hand-off — maintenance-github-release / T5 and its required workflow.
---

# Hand-off — maintenance-github-release / T5

## Files touched

<!-- cumaru:touched -->
| Link | Description |
|------|-------------|
| [`rntgspr/cumaru release.yml`](https://github.com/rntgspr/cumaru/pull/23/files) | modified upstream — `Notify npm wrapper` step after the release is marked latest |
<!-- /cumaru:touched -->

## Decisions made during implementation

- The step skips with a warning when `CUMARU_NODE_DISPATCH_TOKEN` is unset, so an upstream release never fails on it.
- Delivered as upstream PR https://github.com/rntgspr/cumaru/pull/23.

## Commands run / verification

- `actionlint` — no issue in the new step; one pre-existing SC2251 info at line 72.

## Pending / follow-ups

- Merge PR #23 and add upstream secret `CUMARU_NODE_DISPATCH_TOKEN` (fine-grained PAT, `rntgspr/cumaru-node`, `contents: write`).

## Suggestions for the Lead

- None.
