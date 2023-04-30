import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuestList from "./pages/guestList/GuestList";
import Home from "./pages/home/Home";
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
    path: "/login",
    element: <Login />,
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
