#!/usr/bin/env node
// Checks that the manifests, the catalogs and the skills of this repository
// agree with each other and stay inside the limits of the plugin directories.
// It has no dependencies:
//
//   node scripts/check.mjs
//
// The limits come from the documents that docs/publishing.md links.

import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PLUGIN = 'weekend-folio'
const MCP_URL = 'https://weekendfolio.com/mcp'
const REGISTRY_NAME = `com.weekendfolio/${PLUGIN}`
const pluginDir = join(root, 'plugins', PLUGIN)

const problems = []
let passed = 0
const rel = (path) => relative(root, path) || '.'
const check = (ok, message) => (ok ? passed++ : problems.push(message))
const same = (values) => new Set(values.map((value) => JSON.stringify(value))).size === 1

function read(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    problems.push(`${rel(path)}: the file is missing`)
    return null
  }
}

function json(path) {
  const text = read(path)
  if (text === null) return null
  try {
    return JSON.parse(text)
  } catch (error) {
    problems.push(`${rel(path)}: not valid JSON (${error.message})`)
    return null
  }
}

/** All files below a folder, and the symbolic links found on the way. */
function walk(folder, files = [], links = []) {
  for (const name of readdirSync(folder)) {
    const path = join(folder, name)
    const stat = lstatSync(path)
    if (stat.isSymbolicLink()) links.push(path)
    else if (stat.isDirectory()) walk(path, files, links)
    else files.push({ path, size: stat.size })
  }
  return { files, links }
}

// ---------------------------------------------------------------- manifests

const agent = json(join(pluginDir, 'plugin.json'))
const claude = json(join(pluginDir, '.claude-plugin/plugin.json'))
const cursor = json(join(pluginDir, '.cursor-plugin/plugin.json'))
const gemini = json(join(root, 'gemini-extension.json'))
const registry = json(join(root, 'server.json'))

if (agent && claude && cursor && gemini && registry) {
  const manifests = { 'plugin.json': agent, '.claude-plugin/plugin.json': claude, '.cursor-plugin/plugin.json': cursor, 'gemini-extension.json': gemini }

  for (const [file, manifest] of Object.entries(manifests)) {
    check(manifest.name === PLUGIN, `${file}: "name" must be "${PLUGIN}"`)
    check(/^\d+\.\d+\.\d+$/.test(manifest.version ?? ''), `${file}: "version" must be a version such as 1.2.3`)
  }
  check(registry.name === REGISTRY_NAME, `server.json: "name" must be "${REGISTRY_NAME}"`)
  check(
    same([...Object.values(manifests).map((m) => m.version), registry.version]),
    'The version is not the same in plugin.json, .claude-plugin/plugin.json, .cursor-plugin/plugin.json, gemini-extension.json and server.json',
  )
  check(same(Object.values(manifests).map((m) => m.description)), 'The description is not the same in the four manifests')
  check(
    same([agent.repository, claude.repository, cursor.repository, registry.repository?.url]),
    'The repository address is not the same in the manifests and server.json',
  )

  // Agent Plugins 1.0.0: a closed list of fields (agent-plugins.org/specification).
  const allowed = ['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions']
  check(agent.$schema === 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', 'plugin.json: "$schema" must be the Agent Plugins 1.0.0 schema')
  for (const key of Object.keys(agent)) check(allowed.includes(key), `plugin.json: Agent Plugins does not permit the field "${key}"`)

  // The listing of ChatGPT and Codex (developers.openai.com/plugins/deploy/submission).
  const listing = agent.extensions?.['com.openai']?.interface
  check(!!listing, 'plugin.json: extensions["com.openai"].interface is missing')
  if (listing) {
    check(listing.displayName?.length > 0 && listing.displayName.length <= 30, 'plugin.json: interface.displayName must have 1 to 30 characters')
    check(listing.shortDescription?.length > 0 && listing.shortDescription.length <= 30, 'plugin.json: interface.shortDescription must have 1 to 30 characters')
    check(listing.longDescription?.length > 0 && listing.longDescription.length <= 4000, 'plugin.json: interface.longDescription must have 1 to 4000 characters')
    const prompts = [listing.defaultPrompt ?? []].flat()
    check(prompts.length <= 3, 'plugin.json: interface.defaultPrompt permits a maximum of 3 prompts')
    for (const prompt of prompts) check(prompt.length <= 128, `plugin.json: a default prompt has more than 128 characters: "${prompt}"`)
    for (const key of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
      check(/^https:\/\//.test(listing[key] ?? ''), `plugin.json: interface.${key} must be an https address`)
    }
    for (const key of ['brandColor', 'brandColorDark']) {
      check(/^#[0-9A-Fa-f]{6}$/.test(listing[key] ?? ''), `plugin.json: interface.${key} must be a colour such as #161614`)
    }
    for (const key of ['composerIcon', 'composerIconDark', 'logo', 'logoDark']) {
      const path = listing[key]
      check(typeof path === 'string' && path.startsWith('./') && existsSync(join(pluginDir, path)), `plugin.json: interface.${key} must be a ./ path to a file in the plugin`)
    }
  }

  // Claude Code and the Claude directory.
  check(typeof claude.icon === 'string' && existsSync(join(pluginDir, claude.icon)), '.claude-plugin/plugin.json: "icon" must be a file in the plugin')
  for (const key of ['documentationUrl', 'supportUrl', 'privacyPolicyUrl', 'termsOfServiceUrl']) {
    check(/^https:\/\//.test(claude[key] ?? ''), `.claude-plugin/plugin.json: "${key}" must be an https address`)
  }

  // Cursor.
  check(typeof cursor.logo === 'string' && existsSync(join(pluginDir, cursor.logo)), '.cursor-plugin/plugin.json: "logo" must be a file in the plugin')
  for (const key of ['skills', 'mcpServers']) {
    check(typeof cursor[key] === 'string' && existsSync(join(pluginDir, cursor[key])), `.cursor-plugin/plugin.json: "${key}" must be a path in the plugin`)
  }

  // The MCP Registry (registry.modelcontextprotocol.io).
  check(registry.description?.length > 0 && registry.description.length <= 100, 'server.json: "description" must have 1 to 100 characters')
  check((registry.title ?? '').length <= 100, 'server.json: "title" permits a maximum of 100 characters')

  // The review data for ChatGPT and Codex: an initial MCP review needs exactly
  // five positive and three negative test cases. Credentials never go in the package.
  const openai = agent.extensions?.['com.openai'] ?? {}
  const review = openai.review
  if (review) {
    const tools = [...(read(join(root, 'README.md')) ?? '').matchAll(/^\| `([a-z_]+)` \|/gm)].map((m) => m[1])
    const positive = review.test_cases?.positive ?? []
    const negative = review.test_cases?.negative ?? []
    check(positive.length === 5, `plugin.json: review.test_cases.positive must have 5 cases, not ${positive.length}`)
    check(negative.length === 3, `plugin.json: review.test_cases.negative must have 3 cases, not ${negative.length}`)
    for (const [i, c] of positive.entries()) {
      for (const key of ['description', 'prompt', 'tools_triggered', 'expected_behavior']) {
        check(typeof c[key] === 'string' && c[key].trim().length > 0, `plugin.json: positive test case ${i + 1} needs "${key}"`)
      }
      for (const tool of (c.tools_triggered ?? '').split(',').map((t) => t.trim()).filter(Boolean)) {
        check(tools.includes(tool), `plugin.json: positive test case ${i + 1} names "${tool}", which is not in the tool table of README.md`)
      }
    }
    for (const [i, c] of negative.entries()) {
      for (const key of ['description', 'prompt']) {
        check(typeof c[key] === 'string' && c[key].trim().length > 0, `plugin.json: negative test case ${i + 1} needs "${key}"`)
      }
    }
    check(typeof review.commerce === 'boolean', 'plugin.json: review.commerce must be true or false')
    check(!review.commerce || (review.commerce_description ?? '').trim().length > 0, 'plugin.json: review.commerce_description must say how payments work')
  }
  for (const key of ['test_credentials', 'reviewer_instructions']) {
    check(!(key in (review ?? {})) && !(key in openai), `plugin.json: "${key}" must not be in the package. Give it in the dashboard form.`)
  }
}

// ---------------------------------------------------------------- connector

const portable = json(join(pluginDir, 'mcp.json'))
const dotfile = json(join(pluginDir, '.mcp.json'))

if (portable && dotfile && gemini && registry) {
  const a = portable.mcpServers?.[PLUGIN]
  const b = dotfile.mcpServers?.[PLUGIN]
  const c = gemini.mcpServers?.[PLUGIN]
  const d = registry.remotes?.[0]
  check(portable.$schema === 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json', 'mcp.json: "$schema" must be the Agent Plugins 1.0.0 MCP schema')
  check(a?.type === 'streamable-http' && a?.url === MCP_URL, `mcp.json: the server "${PLUGIN}" must have the type "streamable-http" and the address ${MCP_URL}`)
  check(b?.type === 'http' && b?.url === MCP_URL, `.mcp.json: the server "${PLUGIN}" must have the type "http" and the address ${MCP_URL}`)
  check(c?.httpUrl === MCP_URL, `gemini-extension.json: the server "${PLUGIN}" must have the httpUrl ${MCP_URL}`)
  check(d?.type === 'streamable-http' && d?.url === MCP_URL, `server.json: the first remote must have the type "streamable-http" and the address ${MCP_URL}`)
  for (const [file, config] of [['mcp.json', portable], ['.mcp.json', dotfile], ['gemini-extension.json', gemini]]) {
    check(Object.keys(config.mcpServers ?? {}).length === 1, `${file}: there must be one server only`)
    check(!JSON.stringify(config).includes('"headers"'), `${file}: no headers. The sign-in is OAuth, and a manifest must not hold a secret.`)
  }
}

// ----------------------------------------------------------------- catalogs

const catalogs = {
  '.claude-plugin/marketplace.json': (entry) => entry.source,
  '.cursor-plugin/marketplace.json': (entry) => entry.source,
  '.agents/plugins/marketplace.json': (entry) => entry.source?.path,
}

for (const [file, sourceOf] of Object.entries(catalogs)) {
  const catalog = json(join(root, file))
  if (!catalog) continue
  check(catalog.name === PLUGIN, `${file}: the catalog "name" must be "${PLUGIN}"`)
  const entry = catalog.plugins?.find((plugin) => plugin.name === PLUGIN)
  check(!!entry, `${file}: there is no entry for the plugin "${PLUGIN}"`)
  if (!entry) continue
  const source = sourceOf(entry)
  check(typeof source === 'string' && source.startsWith('./') && resolve(root, source) === pluginDir, `${file}: the source of "${PLUGIN}" must be ./plugins/${PLUGIN}`)
  if (entry.description !== undefined && agent) check(entry.description === agent.description, `${file}: the description is not the same as in plugin.json`)
  if (file.startsWith('.agents')) {
    check(!!entry.policy?.installation && !!entry.policy?.authentication && !!entry.category, `${file}: a Codex entry needs policy.installation, policy.authentication and category`)
  }
  if (catalog.metadata?.version !== undefined && agent) check(catalog.metadata.version === agent.version, `${file}: metadata.version is not the version of the plugin`)
}

// ------------------------------------------------------------------- skills

const skillsDir = join(pluginDir, 'skills')
const skills = existsSync(skillsDir) ? readdirSync(skillsDir).filter((name) => lstatSync(join(skillsDir, name)).isDirectory()) : []
check(skills.length > 0, 'There is no skill in plugins/weekend-folio/skills')

const rootReadme = read(join(root, 'README.md')) ?? ''
const pluginReadme = read(join(pluginDir, 'README.md')) ?? ''

for (const skill of skills) {
  const file = `skills/${skill}/SKILL.md`
  const text = read(join(skillsDir, skill, 'SKILL.md'))
  if (text === null) continue
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  check(!!match, `${file}: the file must start with a YAML header between two --- lines`)
  if (!match) continue
  const header = Object.fromEntries(
    match[1].split('\n').map((line) => line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)).filter(Boolean).map(([, key, value]) => [key, value.trim()]),
  )
  check(header.name === skill, `${file}: "name" must be the name of its folder, "${skill}"`)
  check(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(skill) && skill.length <= 64, `${file}: the name must be lowercase words with hyphens, 64 characters or fewer`)
  check(!!header.description && header.description.length <= 1024, `${file}: "description" must have 1 to 1024 characters`)
  check(!('version' in header), `${file}: no "version" in a skill. The version is in the manifests.`)
  check(match[2].split('\n').length <= 500, `${file}: the body must have 500 lines or fewer`)
  check(!/\bClaude\b|\bChatGPT\b|\bCodex\b|\bGemini\b|\bGrok\b/.test(match[2]), `${file}: do not name an assistant in a skill. Each assistant reads the same file.`)

  const codex = read(join(skillsDir, skill, 'agents/openai.yaml'))
  if (codex !== null) check(codex.includes(MCP_URL), `skills/${skill}/agents/openai.yaml: the connector address ${MCP_URL} is missing`)
  check(rootReadme.includes(`\`${skill}\``), `README.md does not list the skill "${skill}"`)
  check(pluginReadme.includes(`\`${skill}\``), `plugins/${PLUGIN}/README.md does not list the skill "${skill}"`)
}

// --------------------------------------------- what the directories refuse

// claude.com/docs/plugins/pre-submission-checklist: a README of 40 words or
// more, a license, no .DS_Store, no symbolic links, no large or binary files.
const { files, links } = walk(pluginDir)
const images = /\.(png|jpe?g|webp|svg|gif)$/i
check(pluginReadme.split(/\s+/).filter(Boolean).length >= 40, `plugins/${PLUGIN}/README.md must have 40 words or more`)
check(existsSync(join(pluginDir, 'LICENSE')), `plugins/${PLUGIN}/LICENSE is missing`)
check(read(join(pluginDir, 'LICENSE')) === read(join(root, 'LICENSE')), `plugins/${PLUGIN}/LICENSE is not the same as LICENSE`)
check(links.length === 0, `Symbolic links in the plugin: ${links.map(rel).join(', ')}`)
check(files.length <= 512, 'The plugin has more than 512 files')
for (const { path, size } of files) {
  check(!path.endsWith('.DS_Store'), `${rel(path)}: remove this file`)
  check(images.test(path) || size <= 256 * 1024, `${rel(path)}: a file that is not a picture must be 256 KiB or smaller`)
  check(!/\.(ico|pdf|zip|exe|dmg|tgz|gz)$/i.test(path), `${rel(path)}: no binary files in the plugin`)
}
check(!existsSync(join(pluginDir, 'hooks')) && !existsSync(join(pluginDir, 'bin')), 'The plugin must not have hooks or programs. The public directories refuse them.')

// ------------------------------------------------------------------ result

if (problems.length > 0) {
  console.error(`${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}
console.log(`${passed} checks passed. ${PLUGIN} ${agent.version}, ${skills.length} skills, connector ${MCP_URL}`)
