#!/usr/bin/env node
// Checks a Coder command-hint spec. Usage: node validate.mjs <path/to/command.json>
// Exit 0 = usable (warnings may still print), exit 1 = Coder would ignore or misread it.
import fs from 'node:fs'
import path from 'node:path'

const file = process.argv[2]
if (!file) { console.error('usage: node validate.mjs <command.json>'); process.exit(2) }

const errors = []
const warnings = []
const err = (where, msg) => errors.push(`${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`${where}: ${msg}`)

let spec
try { spec = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { console.error(`INVALID JSON: ${e.message}`); process.exit(1) }
if (!spec || typeof spec !== 'object' || Array.isArray(spec)) { console.error('top level must be a JSON object'); process.exit(1) }

const command = path.basename(file, '.json')
const KNOWN = new Set(['name', 'description', 'displayName', 'insertValue', 'hidden', 'deprecated', 'subcommands', 'options', 'args',
  'isPersistent', 'isRepeatable', 'exclusiveOn', 'isOptional', 'isVariadic', 'template', 'suggestions', 'generators', 'script', 'splitOn',
  'icon', 'priority', 'filterStrategy', 'isDangerous', 'isRequired', 'loadSpec', 'parserDirectives'])
const names = n => (typeof n === 'string' ? [n] : Array.isArray(n) && n.every(x => typeof x === 'string') ? n : null)

function checkKeys(obj, where) {
  for (const k of Object.keys(obj)) if (!KNOWN.has(k)) warn(where, `unknown key "${k}" (ignored)`)
}

function checkArg(arg, where) {
  if (!arg || typeof arg !== 'object' || Array.isArray(arg)) return err(where, '"args" entries must be objects')
  checkKeys(arg, where)
  if (arg.template !== undefined) {
    const t = Array.isArray(arg.template) ? arg.template : [arg.template]
    for (const x of t) if (x !== 'filepaths' && x !== 'folders') err(where, `template "${x}" is not supported (use "filepaths" or "folders")`)
  }
  if (arg.suggestions !== undefined) {
    if (!Array.isArray(arg.suggestions)) err(where, '"suggestions" must be an array')
    else arg.suggestions.forEach((s, i) => {
      if (typeof s === 'string') return
      if (!s || typeof s !== 'object' || !names(s.name)) err(`${where}.suggestions[${i}]`, 'must be a string or { "name": … }')
    })
  }
  for (const g of arg.generators === undefined ? [] : [].concat(arg.generators)) {
    if (!g || typeof g !== 'object') { err(where, 'generator must be an object'); continue }
    if (g.template !== undefined) continue
    if (!Array.isArray(g.script) || g.script.some(x => typeof x !== 'string')) err(where, 'generator "script" must be an array of strings')
    else if (g.script[0] !== command) err(where, `generator script must start with "${command}" (the command being typed), got "${g.script[0]}"`)
  }
}

function checkOptionOrSub(node, where, kind) {
  if (!node || typeof node !== 'object') return err(where, `${kind} must be an object`)
  checkKeys(node, where)
  const ns = names(node.name)
  if (!ns || ns.length === 0) return err(where, `${kind} needs a "name" (string or array of strings)`)
  for (const n of ns) {
    if (!n || /\s/.test(n)) err(where, `name "${n}" is empty or contains whitespace`)
    if (kind === 'option' && !n.startsWith('-')) err(where, `option name "${n}" must start with "-"`)
    if (kind === 'subcommand' && n.startsWith('-')) err(where, `subcommand name "${n}" must not start with "-"`)
  }
  if (!node.description) warn(where, 'no description (hints are much more useful with one)')
  return ns
}

function checkCommand(node, where, isRoot) {
  checkKeys(node, where)
  if (isRoot && !names(node.name)) warn(where, `no "name"; expected "${command}"`)
  if (isRoot && typeof node.name === 'string' && node.name !== command) warn(where, `"name" is "${node.name}" but the file is ${command}.json: the file name is what Coder matches`)
  for (const key of ['subcommands', 'options']) if (node[key] !== undefined && !Array.isArray(node[key])) err(where, `"${key}" must be an array`)
  for (const a of node.args === undefined ? [] : [].concat(node.args)) checkArg(a, `${where}.args`)
  const seen = new Set()
  ;(node.options ?? []).forEach((o, i) => {
    const w = `${where}.options[${i}]`
    const ns = checkOptionOrSub(o, w, 'option') ?? []
    for (const n of ns) { if (seen.has(n)) err(w, `duplicate option "${n}"`); seen.add(n) }
    for (const a of o?.args === undefined ? [] : [].concat(o.args)) checkArg(a, `${w}.args`)
    if (o?.isPersistent && !isRoot) warn(w, '"isPersistent" is most useful on the top-level command; it applies to every subcommand below it')
  })
  const subs = new Set()
  ;(node.subcommands ?? []).forEach((s, i) => {
    const w = `${where}.subcommands[${i}]`
    const ns = checkOptionOrSub(s, w, 'subcommand') ?? []
    for (const n of ns) { if (subs.has(n)) err(w, `duplicate subcommand "${n}"`); subs.add(n) }
    if (s && typeof s === 'object') checkCommand(s, `${w}(${ns[0] ?? '?'})`, false)
  })
}

checkCommand(spec, command, true)
if (!spec.subcommands?.length && !spec.options?.length && !spec.args) warn(command, 'spec has no subcommands, options or args: it will never suggest anything')

for (const w of warnings) console.log(`warning  ${w}`)
for (const e of errors) console.log(`ERROR    ${e}`)
const count = n => (n.subcommands ?? []).reduce((a, s) => a + count(s), (n.subcommands ?? []).length)
console.log(errors.length ? `\n${errors.length} error(s): fix these before using the spec.` : `\nOK: ${count(spec)} subcommand(s), ${(spec.options ?? []).length} top-level option(s).`)
process.exit(errors.length ? 1 : 0)
