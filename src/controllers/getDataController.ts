import { Request, Response } from 'express';
import { fetchJson } from '../services/httpClient';
import { REQUEST_OPTIONS } from '../config/request_options'
import fs from 'fs'

const getGameData = async (req: Request, res: Response) => {
    const response = fs.readFile(REQUEST_OPTIONS.GET_GMAE_URL, 'utf8', (err, data) => {
        if (err) {
            console.error('读取文件时出错:', err);
            return;
        }
        console.log('文件内容:', data);
    });
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        data: response
    })
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