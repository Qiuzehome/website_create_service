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
// export const getNewsData = async (): Promise<{}> => {
//     const response = await fetchJson(REQUEST_OPTIONS.GET_NEWS_LISTS_URL, {
//         method: "POST", data: {
//             "pageSize": 1000, "page": 1, "domain": "hoxilk.net"
//         }
//     });
//     const datalist = response?.data
//     return datalist ?? null
// }


class NewsData {
    constructor() {
        this.data = {} as NEWS_DATA
    }
    data: NEWS_DATA | { list: [any] }
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


export const getData = async (page: string, name: string, type: DataType): Promise<NewsData | Games_Data> => {
    if (type === 'games') {
        const instance = new Games_Data();
        instance.data = await instance.getDataLIst();
        return instance
        // return await getGameData()
    }
    if (type === 'news') {
        const instance = new NewsData();
        instance.data = await instance.getDataLIst();
        return instance
        // const Data = new NewsData()
        // if (page == "detail") {
        //     Data.data.list.map(async item => {
        //         await Data.getDetailData(item.id)
        //     })
        // }
        // return await Data.getDataLIst()
    }
    throw new Error('无效的参数: type')
}
