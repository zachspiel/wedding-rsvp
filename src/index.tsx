import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import SignInStatusProvider from "./context/SignInStatus";
import AdminViewProvider from "./context/AdminView";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import TrackRsvps from "./pages/trackRsvps/TrackRsvps";
import GuestList from "./pages/manageGuestList/GuestList";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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

root.render(
  <React.StrictMode>
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <Notifications position="top-right" />
      <SignInStatusProvider>
        <AdminViewProvider>
          <RouterProvider router={router} />
        </AdminViewProvider>
      </SignInStatusProvider>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
