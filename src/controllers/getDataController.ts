import { Request, Response } from 'express';
// import { getGameData, getNewsData } from '../services/getDataServices'

const isDataType = (v: unknown): v is DataType => v === 'games' || v === 'news'


export const getData = async (req: Request, res: Response<responeData>): Promise<void> => {
    const typeParam = req.query.type
    if (!isDataType(typeParam)) {
        res.status(400).json({
            status: 'error',
            uptime: process.uptime(),
            data: null,
            message: '缺少或无效的参数: type'
        })
        return
    }
    let resData: Object = {}
    if (typeParam === 'games') {
        // resData = await getGameData()

    }
    if (typeParam === 'news') {
        // resData = await getNewsData()
    }
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        message: 'Hello, Express + TypeScript!',
        data: resData
    })
}