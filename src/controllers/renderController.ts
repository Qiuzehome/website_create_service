import { Request, Response } from 'express';
import { isNewsData } from "../services/getDataServices"
import { renderTemplate, copyStaticSource } from '../services/renderServices';
import { getData } from '../services/getDataServices'


export async function render(req: Request, res: Response) {
  const { page, name, data, domain } = req.query as { page: string, name: string, data: "games" | "news", domain?: string }
  if (!data) {
    res.status(400).json({ error: '缺少参数: data' });
    return;
  }

  try {
    const instance = await getData(page, name, data, domain)
    // let html = ''
    if (page == "detail" && isNewsData(instance)) {
      const promise = instance.data.list.map(async item => {
        const detail = await instance.getDetailData(item.id)
        instance.data.detail = detail
        return await renderTemplate(page, name, instance.data, item.id);
      })
      await Promise.all(promise)
    } else if (page == "home") {
      await renderTemplate(page, name, instance.data);
    }

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

