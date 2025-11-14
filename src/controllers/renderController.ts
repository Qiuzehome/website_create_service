import { Request, Response } from 'express';
import fs from "fs"
import { renderTemplate, copyStaticSource } from '../services/renderServices';
import { getData } from '../services/getDataServices'

export async function render(req: Request, res: Response) {
  const { page, name, type } = req.query as { page: string, name: string, type: "games" | "news" }
  if (!type) {
    res.status(400).json({ error: '缺少参数: data_type' });
    return;
  }

  try {
    const data = await getData(page, name, type) as { data: NEWS_DATA | GAMES_DATA }
    let html = ''
    if (page == "detail") {
      data.data.list.map(async item => {
        html = await renderTemplate(page, name, data, item.id);
      })
    } else if (page == "home") {
      html = await renderTemplate(page, name, data.data);
    }

    await copyStaticSource()
    // const data = await getData(page, name, type) as responeData
    // const html = renderTemplate(page, name, data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send({
      status: 'ok',
      message: "创建成功"
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || '渲染失败' });
  }
}

