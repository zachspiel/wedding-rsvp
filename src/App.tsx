import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuestList from "./pages/guestList/GuestList";
import TrackRsvps from "./pages/rsvps/TrackRsvps";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";

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
  {
    path: "/login",
    element: <Login />,
  },
]);

function App(): JSX.Element {
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
      <Navbar />
    </>
  );
}

export default App;
