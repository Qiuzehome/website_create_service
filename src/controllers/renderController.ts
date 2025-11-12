import { Request, Response } from 'express';
import { fetchJson } from '../services/httpClient';
import { renderTemplate } from '../services/templateRenderer';

export async function render(req: Request, res: Response) {
  const { type, name } = req.params;
  const apiUrl = req.query.api as string;
  if (!apiUrl) {
    res.status(400).json({ error: '缺少参数: api' });
    return;
  }
  try {
    const data = await fetchJson(apiUrl);
    const html = renderTemplate(type, name, data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || '渲染失败' });
  }
}

