
interface responeData {
    status: 'ok' | 'error';
    uptime?: number;
    data: any;
    message?: string;
}
type DataType = 'games' | 'news'

interface GameItem {
    gameId: number;
    id: number;
    categoryId: number;
    categoryName: string;
    name: string;
    url: string;
    image: number;
    description: string;
    type: number;
    status: number;
    score: number;
}

interface GAMES_DATA {
    detail?: {},
    list: GameItem[];
}

interface NEWS_ITEM {
    img: string,
    author: string,
    showTime: string,
    id: number,
    title: string,
    category: string,
    categoryId: number,
    content: string
}
interface NEWS_DATA {
    total: number,
    pages: number,
    size: number,
    pageSize: number,
    detail?: {},
    list: NEWS_ITEM[]
}