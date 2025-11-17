import { Request, Response } from 'express';
import { getData as getFetchData } from '../services/getDataServices'

const isDataType = (v: unknown): v is DataType => v === 'games' || v === 'news'


export const getData = async (req: Request, res: Response<responeData>): Promise<void> => {
    const { type } = req.query as { type: "games" | "news" }
    if (!isDataType(type)) {
        res.status(400).json({
            status: 'error',
            uptime: process.uptime(),
            data: null,
            message: '缺少或无效的参数: type'
        })
        return
    }
    let resData: Object = {}
    const data = await getFetchData(type) as { data: NEWS_DATA | GAMES_DATA }
    resData = data.data

    res.json({
        status: 'ok',
        uptime: process.uptime(),
        message: 'Hello, Express + TypeScript!',
        data: resData
    })
}