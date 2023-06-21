import { useContext } from "react";
import { SignInStatusContext } from "@spiel-wedding/context/SignInStatus";
import { SignInStatusContextType } from "@spiel-wedding/types/SignInStatusContext";

const useSignInStatus = (): SignInStatusContextType => {
  const signInStatusContext = useContext(SignInStatusContext) as SignInStatusContextType;

  return { ...signInStatusContext };
};

export default useSignInStatus;
