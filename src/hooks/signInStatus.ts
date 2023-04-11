import { useContext } from "react";
import { SignInStatusContext } from "../context/SignInStatus";
import { SignInStatusContextType } from "../types/SignInStatusContext";

const useSignInStatus = (): SignInStatusContextType => {
  const signInStatusContext = useContext(SignInStatusContext) as SignInStatusContextType;

  return { ...signInStatusContext };
};

export default useSignInStatus;
