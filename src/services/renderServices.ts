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

export async function renderTemplate(page: string, name: string, data: any, pathName?: string | number): Promise<string> {
  ensureEnv()
  const relPath = resolveTemplatePath(page, name)

  const html = env!.render(relPath, data)
  await generateDist(html, page, pathName)
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

export async function copyStaticSource() {
  const projectRoot = process.cwd()
  const outputDir = path.join(projectRoot, 'dist')
  const staticSrc = path.join(projectRoot, 'tpl', 'static')
  const staticDest = path.join(outputDir, 'static')
  try {
    const stat = await fs.promises.stat(staticSrc)
    if (stat.isDirectory()) {
      await copyDir(staticSrc, staticDest)
    }
  } catch (err) {
    console.error('静态资源复制失败:', err)
  }
}

async function generateDist(code: string, name: string, pathName?: string | number) {
  let uriParts: string[] = [name];
  if (pathName) {
    uriParts.push(String(pathName)); // 确保 pathName 转为字符串
  }
  const uri = path.join(...uriParts);

  const projectRoot = process.cwd()
  const outputDir = path.join(projectRoot, 'dist')
  const outputPath = path.join(outputDir, `${uri}.html`)

  try {
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.promises.writeFile(outputPath, code, 'utf8')
  } catch (err) {
    console.error('写入文件失败:', err)
  }
}