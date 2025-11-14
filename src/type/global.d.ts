
interface responeData {
    status: 'ok' | 'error';
    uptime?: number;
    data: any;
    message?: string;
}
type DataType = 'games' | 'news'