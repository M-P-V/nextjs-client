import type { NextApiRequest, NextApiResponse } from "next";
import Wrapper from "../../ironSession/handler";
import { createHash, Encoding, Hash } from "crypto";

declare class Request {
  code: string;
}

export default Wrapper(handler);

async function handler(req: NextApiRequest, res: NextApiResponse<Session>) {
  const payload = req.body as Request;

  const data = new URLSearchParams();
  data.append("client_id", process.env.CLIENT_ID ?? "");
  data.append("client_secret", process.env.CLIENT_SECRET ?? "");
  data.append("grant_type", "authorization_code");
  data.append("code", payload.code);
  data.append("redirect_uri", `${process.env.APP_URL ?? ""}api/callback`);
  data.append("code_verifier", req.session.session.cv);
  const url = `${process.env.AUTH_URL ?? ""}connect/token`;
  const tokenRes = await fetch(url, {
    method: "post",
    body: data,
  });

  if (tokenRes.ok) {
    const responseData = await tokenRes.json();
    req.session.session.loggedIn = true;
    req.session.session.jwt = responseData["access_token"];
    await req.session.save();
  }

  res.status(200).redirect("/");
}
