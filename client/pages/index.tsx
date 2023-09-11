import { LoginParams } from "@/Models/LoginParams";
import { useEffect, useState } from "react";

declare type LocalState = LoginParams & {
  loggedIn: boolean;
  jwt: string | null;
};

const getSession = async (): Promise<LocalState> => {
  const res = await fetch("./api/session");
  if (res.ok && res.body) {
    try {
      var body = await res.json();
      return body as LocalState;
    } catch (err) {}
  }

  return { loggedIn: false, appUrl: "", clientId: "", cv: "", url: "", jwt: ""};
};

const getParams = async (): Promise<LoginParams> => {
  var res = await fetch("./api/getLoginParams");

  if (res.ok && res.body) {
    try {
      var body = await res.json();
      return body as LoginParams;
    } catch (err) {}
  }

  throw new Error("Could not get params");
};

export default function Home() {
  const [state, setState] = useState<LocalState>();

  useEffect(() => {
    if (state === undefined) {
      getSession().then((s) => {
        if (!s.loggedIn) {
          getParams().then((r) => {
            setState({ loggedIn: false, jwt:null, ...r });
          });
        } else {
          setState(s);
        }
      });
    }
  }, [state]);

  return (
    <>
      {state?.loggedIn ? (
        <>
        <div style={{display:"flex", flexDirection: "row"}}>
          <label htmlFor="jwt">Token</label>
          <textarea  style={{flexGrow:"1", marginLeft: "20px"}} name="jwt" defaultValue={state.jwt ?? ""}/>
        </div>
        </>
      ) : (
        <form
          action={`${state?.url}connect/authorize`}
          method={"POST"}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <input name="client_id" defaultValue={state?.clientId} />
          <input name="idp" defaultValue={"Test"} />
          <input name="scope" defaultValue={"openid"} />
          <input name="response_type" defaultValue={"code"} />
          <input
            name="redirect_uri"
            defaultValue={`${state?.appUrl}api/callback`}
          />
          <input name="code_challenge" defaultValue={state?.cv ?? ""} />
          <input name="code_challenge_method" defaultValue={"S256"} />
          <input name="response_mode" defaultValue={"form_post"} />
          <button type="submit">Login</button>
        </form>
      )}
    </>
  );
}
