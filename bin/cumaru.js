#!/usr/bin/env node
"use strict"

const { spawnSync } = require("node:child_process")
const platforms = require("./platforms.json")

/**
 * Resolves the absolute path of the native cumaru binary for this host.
 * CUMARU_BINARY overrides the lookup; otherwise the matching optional
 * platform package is resolved. Exits with an error when none is installed.
 */
function resolveBinary() {
  if (process.env.CUMARU_BINARY) return process.env.CUMARU_BINARY

  const host = `${process.platform}-${process.arch}`
  const platform = platforms[host]
  if (!platform) {
    console.error(`cumaru: unsupported platform ${host}. Supported: ${Object.keys(platforms).join(", ")}.`)
    process.exit(1)
  }

  try {
    return require.resolve(`${platform.package}/cumaru`)
  } catch {
    console.error(`cumaru: missing package ${platform.package} for ${host}. Reinstall without --no-optional / --omit=optional.`)
    process.exit(1)
  }
}

/**
 * Runs the native binary with the caller's arguments and stdio, then exits
 * with the binary's exit code or re-raises its terminating signal.
 */
function run() {
  const result = spawnSync(resolveBinary(), process.argv.slice(2), { stdio: "inherit" })
  if (result.error) {
    console.error(`cumaru: failed to run binary: ${result.error.message}`)
    process.exit(1)
  }

  if (result.signal) process.kill(process.pid, result.signal)
  process.exit(0)
}

run()
