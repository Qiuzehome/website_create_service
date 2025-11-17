import path from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'
import { generateDist } from "./buildServices"

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
  const found = tplIndex!.find(e => e.path === `${type}/${name}.njk`)
  if (!found) {
    throw new Error(`Template not found: ${type}/${name}`)
  }
  return found.path
}

export async function renderTemplate(page: string, name: string, data: any, pathName?: string | number): Promise<string> {
  ensureEnv()
  const relPath = resolveTemplatePath(page, name)

  const html = env!.render(relPath, data)
  await generateDist(html, page, pathName)
  return html
}