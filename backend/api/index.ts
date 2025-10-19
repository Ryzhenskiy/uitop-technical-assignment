/* eslint-disable @typescript-eslint/no-unsafe-call */
// /api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

type ExpressLikeHandler = (req: VercelRequest, res: VercelResponse) => unknown;

let cachedHandler: ExpressLikeHandler | null = null;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  try {
    if (!cachedHandler) {
      // Import from compiled output
      // @ts-ignore
      const mod: {
        createNestExpressApp: () => Promise<{
          // Express app is a callable handler; we cast to our Vercel-compatible type
          expressApp: unknown;
        }>;
      } = await import('../dist/main.js');

      const { createNestExpressApp } = mod;
      const { expressApp } = await createNestExpressApp();

      // Express' handler signature is compatible with Node's req/res that Vercel passes.
      cachedHandler = expressApp as ExpressLikeHandler;
    }

    // In case the handler isn't Promise-based, normalize it.
    await Promise.resolve(cachedHandler(req, res));
  } catch (err) {
    res
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .status(500)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .send(err instanceof Error ? (err.stack ?? err.message) : String(err));
  }
}
