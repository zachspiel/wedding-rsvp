import React from "react";
import { weddingDateString } from "./components/easterEggs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./database/database";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import GuestList from "./pages/guestList/GuestList";
import TrackRsvps from "./pages/rsvps/TrackRsvps";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
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
  {
    path: "/rsvps",
    element: <TrackRsvps />,
  },
]);

function App(): JSX.Element {
  const { REACT_APP_EMAIL, REACT_APP_PASS } = process.env;
  const location = useLocation();

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
    }
  }, []);

  return (
    <>
      <Navbar showHome={location.pathname.length > 0} />
      <RouterProvider router={router} />
      <Navbar footer />
    </>
  );
}

export default App;
