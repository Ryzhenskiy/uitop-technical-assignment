import { createNestExpressApp } from './main';

let cachedServer: any;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const { expressApp } = await createNestExpressApp();
    cachedServer = expressApp;
  }
  return cachedServer(req, res);
}
