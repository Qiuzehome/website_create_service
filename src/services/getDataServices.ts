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
    const datalist = response?.data
    return datalist ?? null
}

type NEWS_DATA = {
    total: number,
    pages: number,
    size: number,
    pageSize: number,
    list: [{
        img: string,
        author: string,
        showTime: string,
        id: number,
        title: string,
        category: string,
        categoryId: number,
        content: string
    }]
}
class NewsData {
    constructor() {
        this.data = { list: [{}] }
        this.getDataLIst()
    }
    data: NEWS_DATA | { list: [any] }
    async getDataLIst(): Promise<{}> {
        const response = await fetchJson(REQUEST_OPTIONS.GET_NEWS_LISTS_URL, {
            method: "POST", data: {
                "pageSize": 1000, "page": 1, "domain": "hoxilk.net"
            }
        });
        const res = response?.data
        this.data = res
        return res ?? null
    }

    async getCategoryList(): Promise<{}> {
        const response = await fetchJson(REQUEST_OPTIONS.GET_NEWS_CATEGORY_URL, {
            method: "POST", data: {
                "domain": "hoxilk.net"
            }
        });
        const res = response?.data
        return res ?? null
    }
    async getDetailData(id: number): Promise<{}> {
        const response = await fetchJson(REQUEST_OPTIONS.GET_NEWS_DETAIL_URL, {
            method: "POST", data: {
                "domain": "hoxilk.net",
                "newsId": id
            }
        });
        const res = response?.data
        return res ?? null
    }
    async getDataByCategory(categoryId: number) {
        return this.data.list.filter((item) => item.categoryId == categoryId)
    }
}


export const getData = async (page: string, name: string, type: DataType): Promise<{}> => {
    if (type === 'games') {
        return await getGameData()
    }
    if (type === 'news') {
        const Data = new NewsData()
        return await Data.getDataLIst()
    }
    throw new Error('无效的参数: type')
}
