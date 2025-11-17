import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { root } from './controllers/homeController';
import { render } from './controllers/renderController';
import { getData } from './controllers/getDataController'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 允许跨域
app.use(cors());

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.resolve(process.cwd(), 'tpl', 'static')));

// 路由
app.get('/', root);

app.get('/getData', getData);
// 模板渲染路由：/render/:type/:name?api=<third_party_json_url>
app.get('/render', render);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
