import { fetchJson } from "./httpClient";
import { promises as fs } from 'fs'
import path from 'path'
import { REQUEST_OPTIONS } from '../config/request_options'

export const getGameData = async (): Promise<{}> => {
    try {
        const filePath = path.resolve(process.cwd(), REQUEST_OPTIONS.GET_GMAE_URL)
        const text = await fs.readFile(filePath, 'utf8')
        const data = JSON.parse(text)
        return data
    } catch (err: any) {
        throw new Error(err?.message || '读取本地数据失败')
    }
}
export const getNewsData = async (): Promise<{}> => {
    const response = await fetchJson(REQUEST_OPTIONS.GET_NEWS_LISTS_URL, {
        method: "POST", data: {
            "pageSize": 1000, "page": 1, "domain": "hoxilk.net"
        }
    });
    return response?.data ?? null
}
type DataType = 'games' | 'news'
export const getData = async (type: DataType): Promise<{}> => {
    if (type === 'games') {
        return await getGameData()
    }
    if (type === 'news') {
        return await getNewsData()
    }
    throw new Error('无效的参数: type')
}
