import type { NextApiRequest, NextApiResponse } from 'next';
import Wrapper from "../../ironSession/handler";

export default Wrapper(handler);

function handler(
    req: NextApiRequest,
    res: NextApiResponse<Session>
  ) {
    res.status(200).json(req.session.session);
  }
  