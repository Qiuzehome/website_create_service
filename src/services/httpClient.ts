import { request as httpRequest } from 'http'
import { request as httpsRequest } from 'https'
import { URL } from 'url'

const GET_NEWS_LISTS_URL = "https://asq.pazzy.net/game/news/site/list"
const GET_NEWS_CATEGORY_URL = "https://asq.pazzy.net/game/news/site/categories"
const GET_NEWS_DETAIL_URL = "https://asq.pazzy.net/game/news/site/detail"
const GET_GMAE_URL = "/onfig/game.json"

export async function fetchJson(urlStr: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(urlStr)
      const lib = url.protocol === 'https:' ? httpsRequest : httpRequest
      const req = lib(url, { method: 'GET' }, res => {
        let data = ''
        res.setEncoding('utf8')
        res.on('data', chunk => {
          data += chunk
        })
        res.on('end', () => {
          try {
            const json = JSON.parse(data)
            resolve(json)
          } catch (e) {
            reject(new Error('Response is not valid JSON'))
          }
        })
      })
      req.on('error', reject)
      req.end()
    } catch (err) {
      reject(err)
    }
  })
}