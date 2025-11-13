import { Request, Response } from 'express';
import { fetchJson } from '../services/httpClient';
import { REQUEST_OPTIONS } from '../config/request_options'
import { promises as fs } from 'fs'
import path from 'path'

const getGameData = async (req: Request, res: Response) => {
    try {
        const filePath = path.resolve(process.cwd(), REQUEST_OPTIONS.GET_GMAE_URL)
        const text = await fs.readFile(filePath, 'utf8')
        const json = JSON.parse(text)
        res.json({
            status: 'ok',
            uptime: process.uptime(),
            data: json
        })
    } catch (err: any) {
        res.status(500).json({ error: err?.message || '读取本地数据失败' })
    }
}
const getNewsData = async (req: Request, res: Response) => {
    const response = await fetchJson(REQUEST_OPTIONS.GET_NEWS_LISTS_URL, {
        method: "POST", data: {
            "pageSize": 1000, "page": 1, "domain": "hoxilk.net"
        }
    });
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        data: response.data
    })
}
export const getData = async (req: Request, res: Response) => {
    const data_type = req.query.type as "games" | "news"
    if (data_type == "games") {
        return await getGameData(req, res)
    }
    else if (data_type == "news") {
        return await getNewsData(req, res)
    }
    res.status(400).json({ error: '缺少或无效的参数: type' })
}