import { minify } from 'html-minifier-terser'
import path from "path"
import fs from "fs"

const minifyConfig = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    sortAttributes: true,
    sortClassName: true
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

export async function generateDist(code: string, name: string, pathName?: string | number) {
    let uriParts: string[] = [name];
    if (pathName) {
        uriParts.push(String(pathName));
    }
    const uri = path.join(...uriParts);

    const projectRoot = process.cwd()
    const outputDir = path.join(projectRoot, 'dist')
    const outputPath = path.join(outputDir, `${uri}.html`)

    try {
        const minifiedHtml = await minify(code, minifyConfig);

        await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.promises.writeFile(outputPath, minifiedHtml, 'utf8')
    } catch (err) {
        console.error('写入文件失败:', err)
    }
}