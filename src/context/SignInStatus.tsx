import { createContext, useEffect, useState } from "react";
import { supabase } from "@spiel-wedding/database/database";
import { FcProps } from "@spiel-wedding/types/fcProps";
import { SignInStatusContextType } from "@spiel-wedding/types/SignInStatusContext";

export const SignInStatusContext = createContext<SignInStatusContextType | undefined>(
  undefined
);

const SignInStatusProvider = (props: FcProps): JSX.Element => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | undefined>();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setIsSignedIn(false);
      } else if (session) {
        setIsSignedIn(true);
      }
    });
  }, []);

  return (
    <SignInStatusContext.Provider value={{ isSignedIn }}>
      {props.children}
    </SignInStatusContext.Provider>
  );
};

export default SignInStatusProvider;
