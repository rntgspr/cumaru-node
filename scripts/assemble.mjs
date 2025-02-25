#!/usr/bin/env node
// Builds publishable npm packages in npm/ from one upstream cumaru GitHub Release.
// Usage: node scripts/assemble.mjs <X.Y.Z> [--base-url <url>]

import { createHash } from "node:crypto"
import { chmod, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(ROOT, "npm")
const REPO_URL = "https://github.com/rntgspr/cumaru"

/**
 * Downloads one URL and returns its body as a Buffer; throws on HTTP errors.
 */
async function download(url) {
  const response = await fetch(url, { redirect: "follow" })
  if (!response.ok) throw new Error(`download failed (HTTP ${response.status}): ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

/**
 * Parses a sha256sum file into a Map of file name to lowercase hex digest.
 */
function parseChecksums(text) {
  const sums = new Map()
  for (const line of text.split("\n")) {
    const match = line.trim().match(/^([0-9a-f]{64})\s+\*?(.+)$/i)
    if (match) sums.set(match[2], match[1].toLowerCase())
  }

  return sums
}

/**
 * Downloads a release asset and verifies it against the expected digest.
 */
async function fetchVerified(baseUrl, asset, sums) {
  const expected = sums.get(asset)
  if (!expected) throw new Error(`SHA256SUMS has no entry for ${asset}`)

  const body = await download(`${baseUrl}/${asset}`)
  const actual = createHash("sha256").update(body).digest("hex")
  if (actual !== expected) throw new Error(`checksum mismatch for ${asset}: expected ${expected}, got ${actual}`)

  return body
}

/**
 * Writes a JSON manifest with stable two-space formatting.
 */
async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`)
}

/**
 * Assembles every platform package and the main package for one version.
 */
async function assemble(version, baseUrl) {
  const manifest = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"))
  const platforms = JSON.parse(await readFile(join(ROOT, "bin", "platforms.json"), "utf8"))
  const sums = parseChecksums((await download(`${baseUrl}/SHA256SUMS`)).toString("utf8"))
  const license = await fetchVerified(baseUrl, "LICENSE", sums)

  // Download and verify everything before writing, so a mismatch writes nothing.
  const binaries = {}
  for (const [key, platform] of Object.entries(platforms)) {
    binaries[key] = await fetchVerified(baseUrl, platform.asset, sums)
  }

  await rm(OUT, { recursive: true, force: true })

  for (const [key, platform] of Object.entries(platforms)) {
    const dir = join(OUT, `cli-${key}`)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, "cumaru"), binaries[key])
    await chmod(join(dir, "cumaru"), 0o755)
    await writeFile(join(dir, "LICENSE"), license)
    await writeFile(join(dir, "README.md"), `# ${platform.package}\n\nThe \`cumaru\` ${key} binary for [\`@cumaru/cumaru\`](https://www.npmjs.com/package/@cumaru/cumaru). Install that package instead.\n`)
    await writeJson(join(dir, "package.json"), {
      name: platform.package,
      version,
      description: `The cumaru ${key} binary.`,
      license: manifest.license,
      author: manifest.author,
      homepage: manifest.homepage,
      repository: manifest.repository,
      os: [platform.os],
      cpu: [platform.cpu],
      files: ["cumaru"],
      preferUnplugged: true,
    })
  }

  const main = join(OUT, "cumaru")
  await mkdir(main, { recursive: true })
  await cp(join(ROOT, "bin"), join(main, "bin"), { recursive: true })
  await cp(join(ROOT, "README.md"), join(main, "README.md"))
  await writeFile(join(main, "LICENSE"), license)
  const { scripts, ...published } = manifest
  await writeJson(join(main, "package.json"), {
    ...published,
    version,
    optionalDependencies: Object.fromEntries(Object.values(platforms).map((p) => [p.package, version])),
  })

  console.log(`assembled ${Object.keys(platforms).length + 1} packages for ${version} in npm/`)
}

const args = process.argv.slice(2)
const version = args[0]
const baseUrlFlag = args.indexOf("--base-url")
if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) {
  console.error("usage: node scripts/assemble.mjs <X.Y.Z> [--base-url <url>]")
  process.exit(2)
}

const baseUrl = baseUrlFlag > 0 ? args[baseUrlFlag + 1] : `${REPO_URL}/releases/download/${version}`

assemble(version, baseUrl).catch((error) => {
  console.error(`assemble: ${error.message}`)
  process.exit(1)
})
