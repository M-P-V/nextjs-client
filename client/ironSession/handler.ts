import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionOptions } from "./setup";

export default (handler: NextApiHandler) => withIronSessionApiRoute(handler, sessionOptions);