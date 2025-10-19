import { createApp } from './main';
import express from 'express';

let cachedServer: express.Express;

export const handler = async (req: any, res: any) => {
  if (!cachedServer) {
    const expressApp = express();
    const app = await createApp(expressApp);
    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer(req, res);
};
