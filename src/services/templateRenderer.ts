import path from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'

type TplEntry = { type: string; name: string; path: string }

const TPL_ROOT = path.resolve(process.cwd(), 'tpl')
let env: nunjucks.Environment | null = null
let tplIndex: TplEntry[] | null = null

function ensureEnv() {
  if (!env) {
    env = nunjucks.configure(TPL_ROOT, { autoescape: true, noCache: true })
  }
}

function ensureTplIndex() {
  if (!tplIndex) {
    const idxPath = path.join(TPL_ROOT, 'tpl.json')
    const raw = fs.readFileSync(idxPath, 'utf8')
    tplIndex = JSON.parse(raw) as TplEntry[]
  }
}

function resolveTemplatePath(type: string, name: string): string {
  ensureTplIndex()
  const found = tplIndex!.find(e => e.type === `${type}/${name}`)
  if (!found) {
    throw new Error(`Template not found: ${type}/${name}`)
  }
  return found.path
}

export function renderTemplate(type: string, name: string, data: any): string {
  ensureEnv()
  console.log('数据', data)
  const relPath = resolveTemplatePath(type, name)
  return env!.render(relPath, data)
}

