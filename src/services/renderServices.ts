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
  const html = env!.render(relPath, data)
  generateDist(html)
  return html
}

async function copyDir(src: string, dest: string) {
  await fs.promises.mkdir(dest, { recursive: true })
  const entries = await fs.promises.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(s, d)
    } else {
      await fs.promises.copyFile(s, d)
    }
  }
}

async function generateDist(code: string) {
  const projectRoot = process.cwd()
  const outputDir = path.join(projectRoot, 'dist')
  const outputPath = path.join(outputDir, 'index.html')
  const staticSrc = path.join(projectRoot, 'tpl', 'tpl_static')
  const staticDest = path.join(outputDir, 'tpl_static')
  try {
    await fs.promises.mkdir(outputDir, { recursive: true })
    await fs.promises.writeFile(outputPath, code, 'utf8')
    try {
      const stat = await fs.promises.stat(staticSrc)
      if (stat.isDirectory()) {
        await copyDir(staticSrc, staticDest)
      }
    } catch {}
    console.log('文件写入成功')
  } catch (err) {
    console.error('写入文件失败:', err)
  }
}