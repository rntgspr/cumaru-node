---
human_revised: false
name: distribution
summary: How the cumaru CLI reaches Node.js users through npm packages and GitHub Actions.
depends-on: []
targets: [platform]
---

# Distribution

## Overview

`cumaru-node` distributes the upstream `cumaru` binary through npm. This area holds the durable
rules for how packages are published and installed.

## Files

- [npm.md](npm.md) — npm publishing authentication and install-time safety.
