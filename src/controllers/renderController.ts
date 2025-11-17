import { Request, Response } from 'express';
import { renderTemplate } from '../services/renderServices';
import { copyStaticSource } from "../services/buildServices"
import { getData } from '../services/getDataServices'
import fs from "fs"
import path from "path"

export async function render(req: Request, res: Response) {
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  const { q } = req.query as { q: string }
  if (!q) {
    res.status(400).json({ error: '缺少参数: data' });
    return;
  }
  const query: { data: DataType, domain: string, pages: { page: string, name: string }[] } = JSON.parse(q)

  const { data, domain = "hoxilk.net", pages } = query

  try {
    const instance = await getData(data, domain)
    instance.data.domain = domain
    // let html = ''
    pages.forEach(async item => {
      const { page, name } = item

      if (page == "detail") {
        const promise = instance.data.list.map(async item => {
          const detail = await instance.getDetailData(item.id)
          instance.data.detail = detail
          return await renderTemplate(page, name, instance.data, item.id);
        })
        await Promise.all(promise)
      } else {
        await renderTemplate(page, name, instance.data);
      }
    })


    await copyStaticSource()
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send({
      status: 'ok',
      message: "创建成功"
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || '渲染失败' });
  }
}

