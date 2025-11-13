import { Request, Response } from 'express';
import { fetchJson } from '../services/httpClient';
import { REQUEST_OPTIONS } from '../config/request_options'

export const getGameData = async (req: Request, res: Response) => {
    const response = await fetchJson(REQUEST_OPTIONS.GET_GMAE_URL, {
        method: "GET"
    });

    res.json({
        status: 'ok',
        uptime: process.uptime(),
        data: response.data
    })
}
export const getNewsData = async (req: Request, res: Response) => {
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