import React from "react";
import { Container, SimpleGrid } from "@mantine/core";
import Gallery from "./features/gallery/Gallery";
import Jumbotron from "./features/home/Jumbotron";
import Navbar from "./features/navbar/Navbar";
import RsvpForm from "./features/rsvp/RsvpForm";
import GuestBook from "./features/guestBook/GuestBook";
import FlowerImage from "./features/common/FlowerImage";
import WhenAndWhere from "./features/whenAndWhere/WhenAndWhere";
import { weddingDateString } from "./features/easterEggs/strings";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./features/database/database";
import { notifications } from "@mantine/notifications";
import AdminViewToggle from "./features/common/AdminViewToggle";
import useSignInStatus from "./hooks/signInStatus";

function App() {
  const { REACT_APP_EMAIL, REACT_APP_PASS } = process.env;
  const { isSignedIn } = useSignInStatus();

  React.useEffect(() => {
    console.log(weddingDateString);

    if (REACT_APP_EMAIL !== undefined && REACT_APP_PASS !== undefined) {
      signInWithEmailAndPassword(auth, REACT_APP_EMAIL, REACT_APP_PASS)
        .then((userCredential) => {
          notifications.show({
            title: "Success",
            message: "You have successfully signed in. ",
            color: "green",
          });
        })
        .catch((error) => {
          notifications.show({
            title: "Error",
            message: error.message,
            color: "red",
          });
        });
    }
  }, [REACT_APP_EMAIL, REACT_APP_PASS]);

  return (
    <>
      <Navbar />
      <Jumbotron />
      <WhenAndWhere />
      <FlowerImage />

      <Container>
        <SimpleGrid cols={1}>
          <RsvpForm />
        </SimpleGrid>
      </Container>

      <GuestBook />
      <FlowerImage />

      <Container>
        <SimpleGrid cols={1}>
          <Gallery />
        </SimpleGrid>
      </Container>

      {isSignedIn && <AdminViewToggle />}
      <Navbar />
    </>
  );
}

export default App;
