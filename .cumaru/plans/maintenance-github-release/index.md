---
human_revised: false
scope:
  - distribution/npm
status: in-progress
summary: Host the npm wrapper on GitHub as rntgspr/cumaru-node, run CI on main, publish to npm on release, and accept release dispatches from rntgspr/cumaru.
targets: [platform]
aux: []
---

# GitHub hosting and release automation for the npm wrapper

## Overview

The wrapper from `maintenance-npm-wrapper` works locally but has no GitHub
home: `origin` still points to the upstream tool repository `rntgspr/cumaru`,
and `rntgspr/cumaru-node` does not exist yet (checked with `gh repo view`).

Target flow:

```
rntgspr/cumaru  tag X.Y.Z ─► release.yml publishes binaries
                                 └─► repository_dispatch cumaru-release {version}
rntgspr/cumaru-node  sync.yml ─► creates tag + GitHub Release X.Y.Z ─► publish.yml ─► npm
rntgspr/cumaru-node  push main ─► ci.yml (verify only, never publishes)
```

A release in this repository is the only publish trigger. The upstream
dispatch only creates that release.

## Acceptance Criteria (EARS / RFC 2119)

- WHEN a commit lands on `main` of `rntgspr/cumaru-node` THE SYSTEM SHALL assemble the packages for the latest upstream release and smoke-test the launcher, without publishing.
- WHEN a GitHub Release `X.Y.Z` is published in `rntgspr/cumaru-node` THE SYSTEM SHALL publish `@cumaru/cli-*` and then `@cumaru/cumaru` at version `X.Y.Z` with npm provenance.
- WHEN `rntgspr/cumaru` publishes release `X.Y.Z` THE SYSTEM SHALL send a `repository_dispatch` event of type `cumaru-release` with `{"version": "X.Y.Z"}` to `rntgspr/cumaru-node`.
- WHEN `rntgspr/cumaru-node` receives `cumaru-release` for `X.Y.Z` THE SYSTEM SHALL create tag and GitHub Release `X.Y.Z` on the current `main` head, which then triggers the publish.
- WHEN release `X.Y.Z` already exists in `rntgspr/cumaru-node` THE SYSTEM SHALL skip creation and exit successfully.
- The release version MUST equal an existing upstream release tag; the assemble checksum gate MUST pass before any publish.
- Every `@cumaru/*` manifest MUST declare `repository` as `github:rntgspr/cumaru-node`, so npm provenance matches the publishing repository.
- No push MUST ever target `rntgspr/cumaru` from this repository.

## Plan / DAG

| Task | Title | Status | Depends on |
|------|-------|--------|-----------|
| [T1](t1.md) | Create rntgspr/cumaru-node and push main | done | — |
| [T2](t2.md) | CI workflow on main | done | T1 |
| [T3](t3.md) | Publish on GitHub Release | done | T1 |
| [T4](t4.md) | Sync workflow for upstream dispatch | done | T3 |
| [T5](t5.md) | Dispatch step in rntgspr/cumaru release | done | T4 |
| [T6](t6.md) | npm trusted publishers and first release | done | T3 |

T2 and T3 can run in parallel. T5 changes the upstream repository and needs its own commit there.

## Out of scope

- Windows packages.
- Wrapper-only versions independent of upstream (see Risks).
- Changes to how upstream builds binaries.

## Risks

- **GITHUB_TOKEN does not trigger workflows.** A release created by `sync.yml` with the default token does not fire `release: published` ([GitHub docs](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow)). Mitigation: `sync.yml` calls `publish.yml` through `workflow_call` after it creates the release, and `publish.yml` keeps the `release` trigger for manual releases.
- **Cross-repository dispatch needs a credential.** Upstream `GITHUB_TOKEN` cannot dispatch to another repository. Mitigation: a fine-grained PAT (or GitHub App token) with `contents: write` on `rntgspr/cumaru-node` only, stored as upstream secret `CUMARU_NODE_DISPATCH_TOKEN`.
- **Wrapper-only fixes.** npm never republishes a version. A launcher fix waits for the next upstream release, or ships as a prerelease such as `X.Y.Z-node.1` (not the `latest` tag). Decide when it first happens.
- **Trusted publishing bootstrap.** npm trusted publishers are configured per existing package; the four `@cumaru/cli-*` packages do not exist yet. The first publish may need `NPM_TOKEN`, then switch to OIDC ([npm docs](https://docs.npmjs.com/trusted-publishers)).
- **Squashed history.** Local `main` is a single rewritten `sunrise` commit; pushing it to a new empty repository is safe, pushing it to `rntgspr/cumaru` would destroy upstream history.
