import { fetchJson } from "./httpClient";
import { promises as fs } from 'fs'
import path from 'path'
import { REQUEST_OPTIONS } from '../config/request_options'

class Games_Data {
    constructor() {
        this.data = {} as GAMES_DATA
    }
    data: GAMES_DATA
    async getDataLIst(): Promise<GAMES_DATA> {
        try {
            const filePath = path.resolve(process.cwd(), REQUEST_OPTIONS.GET_GMAE_URL)
            const text = await fs.readFile(filePath, 'utf8')
            const data = JSON.parse(text)
            this.data = data
            return data
        } catch (err: any) {
            throw new Error(err?.message || '读取本地数据失败')
        }
    }
}

class News_Data {
    constructor() {
        this.data = {} as NEWS_DATA
    }
    data: NEWS_DATA
    async getDataLIst(): Promise<NEWS_DATA> {
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

export function isNewsData(instance: News_Data | Games_Data): instance is News_Data {
    return 'getDetailData' in instance;
}

export const getData = async (page: string, name: string, type: DataType): Promise<News_Data | Games_Data> => {
    if (type === 'games') {
        const instance = new Games_Data();
        instance.data = await instance.getDataLIst();
        return instance
    }
    if (type === 'news') {
        const instance = new News_Data();
        instance.data = await instance.getDataLIst();
        return instance
    }
    throw new Error('无效的参数: type')
}
