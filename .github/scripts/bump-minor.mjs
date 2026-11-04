#!/usr/bin/env node
// Bumps every direct dependency to its newest MINOR / PATCH release, majors excluded.
//
// `pnpm update` alone stays inside the package.json ranges, so it never takes a new minor of
// a 0.x package (`^0.63.2` allows only 0.63.x), of a `~` range or of an exact pin. Here each
// dependency is updated to `^<its current major>` (`^0` = every 0.x), which lets pnpm pick the
// newest release of that major — still behind pnpm's minimumReleaseAge gate — and then the
// resolved version is written back with the original prefix (`^0.63.2` → `^0.64.1`,
// `~1.2.3` → `~1.4.0`, `1.2.3` → `1.4.0`), never as the bare `^0` pnpm would save.
//
// Skipped: `npm:` aliases (e.g. the root TS 6 alias), workspace / file / link / git / URL specs,
// and anything that is not a plain semver version or range.
//
// Usage: node .github/scripts/bump-minor.mjs [projectDir ...]   (default: the current dir)
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const DEP_FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies']
const SPEC = /^([\^~]?)(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?$/

function pnpm(cwd, args) {
  return execFileSync('pnpm', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })
}

function bumpProject(dir) {
  const pkgPath = join(dir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

  const targets = new Map() // name -> { field, prefix, major }
  for (const field of DEP_FIELDS) {
    for (const [name, spec] of Object.entries(pkg[field] ?? {})) {
      const m = SPEC.exec(spec)
      if (!m || m[5]) continue // not a plain semver spec, or a prerelease pin
      targets.set(name, { field, prefix: m[1], major: m[2], spec })
    }
  }
  if (targets.size === 0) return []

  // One pnpm call per project: pnpm resolves the newest release of each major.
  pnpm(dir, ['update', ...[...targets].map(([name, t]) => `${name}@^${t.major}`)])

  // Read what pnpm resolved, then restore the original prefix style in package.json.
  const listed = JSON.parse(pnpm(dir, ['list', '--depth', '0', '--json']))[0] ?? {}
  const resolved = { ...listed.dependencies, ...listed.devDependencies, ...listed.optionalDependencies }
  const updated = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const changes = []
  for (const [name, t] of targets) {
    const version = resolved[name]?.version
    const next = version && SPEC.test(version) ? `${t.prefix}${version}` : t.spec
    updated[t.field][name] = next
    if (next !== t.spec) changes.push(`${name} ${t.spec} -> ${next}`)
  }
  writeFileSync(pkgPath, JSON.stringify(updated, null, 2) + '\n')
  return changes
}

const dirs = process.argv.slice(2)
const changes = (dirs.length ? dirs : ['.']).flatMap((dir) => bumpProject(resolve(dir)))
// Sync the lockfile's specifiers with the rewritten package.json files.
pnpm(process.cwd(), ['install', '--no-frozen-lockfile'])
console.log(changes.length ? changes.join('\n') : 'No minor / patch bumps.')
