import type { NextFunction, Request, Response } from "express";

/** Express 4 does not catch rejected promises; this forwards them to the error handler. */
export const wrap =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
