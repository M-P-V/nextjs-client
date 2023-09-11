interface Session {
    jwt: string;
    cv: string; //code_verifier
    loggedIn: boolean;
  }