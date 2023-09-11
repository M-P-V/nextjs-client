import type { NextApiRequest, NextApiResponse } from "next";
import Wrapper from "../../ironSession/handler";
import { randomBytes, createHash } from "crypto";
import { LoginParams } from "@/Models/LoginParams";

export default Wrapper(handler);

async function handler(req: NextApiRequest, res: NextApiResponse<LoginParams>) {
  const sessionVals = {
    loggedIn: false,
    cv: randomBytes(50).toString("ascii"),
  } as Session;

  req.session.session = sessionVals;

  await req.session.save();

  res.status(200).json({
    cv: createHash("sha256")
      .update(sessionVals.cv)
      .digest("base64url"),
    appUrl: process.env.APP_URL ?? "",
    url: process.env.AUTH_URL ?? "",
    clientId: process.env.CLIENT_ID ?? "",
  });
}
