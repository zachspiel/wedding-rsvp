import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../features/database/database";
import { FcProps } from "../types/fcProps";
import { SignInStatusContextType } from "../types/SignInStatusContext";

export const SignInStatusContext = createContext<SignInStatusContextType | undefined>(
  undefined
);

const SignInStatusProvider = (props: FcProps): JSX.Element => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsSignedIn(user !== null);
    });
  }, []);

  return (
    <SignInStatusContext.Provider value={{ isSignedIn }}>
      {props.children}
    </SignInStatusContext.Provider>
  );
};

export default SignInStatusProvider;
