import path from "path"
import fs from "fs"

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