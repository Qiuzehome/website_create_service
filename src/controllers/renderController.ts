import { Request, Response } from 'express';
import { fetchJson } from '../services/httpClient';
import { renderTemplate } from '../services/templateRenderer';
import { REQUEST_OPTIONS } from '../config/request_options'

export async function render(req: Request, res: Response) {
  const { type, name } = req.params;
  const data_type = req.query.type as "news" | "games";
  if (!data_type) {
    res.status(400).json({ error: '缺少参数: data_type' });
    return;
  }
  if (data_type == "news") {
    try {
      const data = await fetchJson(REQUEST_OPTIONS.GET_NEWS_LISTS_URL, {
        method: "POST", data: {
          "pageSize": 1000, "page": 1, "domain": "hoxilk.net"
        }
      })
      const html = renderTemplate(type, name, data.data);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || '渲染失败' });
    }
  }

}

