
import http from 'http';
import https from 'https';
import { URL } from 'url'

type HttpMethod = 'GET' | 'POST';

interface FetchOptions {
  method?: HttpMethod;
  data?: Record<string, any>;
}

export async function fetchJson(
  urlStr: string,
  options: FetchOptions = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const { method = 'GET', data } = options;
      const url = new URL(urlStr);
      const lib = url.protocol === 'https:' ? https : http;

      // 处理GET请求参数
      if (method === 'GET' && data) {
        Object.entries(data).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      // 处理POST请求体
      let postData: string | undefined;
      if (method === 'POST' && data) {
        postData = JSON.stringify(data);
      }

      // 构建请求头
      const headers: http.OutgoingHttpHeaders = {};
      if (method === 'POST' && postData) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(postData);
      }

      // 创建请求
      const req = lib.request(
        url,
        {
          method,
          headers,
        },
        (res) => {
          let responseData = '';
          res.setEncoding('utf8');

          res.on('data', (chunk) => {
            responseData += chunk;
          });
          res.on('end', () => {
            try {
              // 处理空响应（如204 No Content）
              if (!responseData.trim()) {
                resolve(null);
                return;
              }
              const json = JSON.parse(responseData);
              resolve(json);
            } catch (e) {
              reject(new Error('Response is not valid JSON'));
            }
          });
        }
      );

      // 处理请求错误
      req.on('error', (err) => {
        reject(err);
      });

      // 发送POST数据
      if (method === 'POST' && postData) {
        req.write(postData);
      }

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}