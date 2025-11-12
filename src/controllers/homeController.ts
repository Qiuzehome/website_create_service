import { Request, Response } from 'express';

export function root(req: Request, res: Response) {
  res.json({
    message: 'Hello, Express + TypeScript!',
    timestamp: new Date().toISOString()
  });
}

