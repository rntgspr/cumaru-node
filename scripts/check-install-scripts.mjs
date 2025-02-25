#!/usr/bin/env node
// Fails when an assembled package in npm/ would need install-time scripts, which npm v12 blocks by default.

import { readdirSync, readFileSync } from "node:fs"

const BANNED = ["preinstall", "install", "postinstall", "prepare"]

/**
 * Returns the problems found in one assembled package directory.
 */
function check(dir) {
  const problems = []
  const scripts = JSON.parse(readFileSync(`${dir}/package.json`, "utf8")).scripts ?? {}
  for (const name of BANNED.filter((n) => n in scripts)) problems.push(`${dir}: forbidden "${name}" script`)

  if (readdirSync(dir, { recursive: true }).some((f) => f.endsWith("binding.gyp"))) problems.push(`${dir}: forbidden binding.gyp`)

  return problems
}

const problems = readdirSync("npm").flatMap((name) => check(`npm/${name}`))
for (const problem of problems) console.error(problem)
process.exit(problems.length ? 1 : 0)
