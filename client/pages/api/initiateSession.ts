import type { NextApiRequest, NextApiResponse } from 'next';
import Wrapper from "../../ironSession/handler";
import { randomBytes } from 'crypto';

export default Wrapper(handler);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const sessionVals = {
      loggedIn: false,
      cv:randomBytes(40).toString('hex'),
    } as Session;

    req.session.session = sessionVals;

    await req.session.save();

    res.status(200).end();
  }
  