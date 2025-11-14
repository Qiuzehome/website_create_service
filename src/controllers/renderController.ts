import { Request, Response } from 'express';
import { renderTemplate } from '../services/renderServices';
import { getData } from '../services/getDataServices'

export async function render(req: Request, res: Response) {
  const { page, name, type } = req.query as { page: string, name: string, type: "games" | "news" }
  if (!type) {
    res.status(400).json({ error: '缺少参数: data_type' });
    return;
  }

  try {
    const data = await getData(page, name, type) as responeData
    const html = renderTemplate(page, name, data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || '渲染失败' });
  }
}

