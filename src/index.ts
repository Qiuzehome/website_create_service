import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { root } from './controllers/homeController';
import { render } from './controllers/renderController';
import { getData } from './controllers/getDataController'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tpl_static', express.static(path.resolve(process.cwd(), 'tpl', 'tpl_static')));

// 路由
app.get('/', root);


app.get('/getData', getData);
// 模板渲染路由：/render/:type/:name?api=<third_party_json_url>
app.get('/render/:type/:name', render);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
