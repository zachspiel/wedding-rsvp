import React from "react";
import { weddingDateString } from "./components/easterEggs";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./database/database";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuestList from "./pages/guestList/GuestList";
import Home from "./pages/home/Home";
import {
  showFailureNotification,
  showSuccessNotification,
} from "./components/notifications/notifications";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/guestList",
    element: <GuestList />,
  },
]);

function App(): JSX.Element {
  const { REACT_APP_EMAIL, REACT_APP_PASS } = process.env;

  React.useEffect(() => {
    console.log(weddingDateString);

    if (REACT_APP_EMAIL !== undefined && REACT_APP_PASS !== undefined) {
      signInWithEmailAndPassword(auth, REACT_APP_EMAIL, REACT_APP_PASS)
        .then((userCredential) => {
          showSuccessNotification("You have successfully signed in.");
        })
        .catch((error) => {
          showFailureNotification();
        });
    } else {
      signOut(auth);
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
