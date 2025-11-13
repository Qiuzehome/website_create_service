import { Request, Response } from 'express';
import { renderTemplate } from '../services/templateRenderer';
import { getData } from '../services/getDataServices'

export async function render(req: Request, res: Response) {
  const { type, name } = req.params;
  const data_type = req.query.type as "news" | "games";
  if (!data_type) {
    res.status(400).json({ error: '缺少参数: data_type' });
    return;
  }

  try {
    const data = await getData(data_type) as responeData
    const html = renderTemplate(type, name, data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || '渲染失败' });
  }

}

