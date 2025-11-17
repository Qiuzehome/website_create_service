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