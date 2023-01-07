/* eslint-disable no-useless-escape */
import React from "react";
import "./App.css";
import { Container, SimpleGrid } from "@mantine/core";
import Gallery from "./features/gallery/Gallery";
import Jumbotron from "./features/home/Jumbotron";
import Footer from "./features/navbar/Footer";
import Navbar from "./features/navbar/Navbar";
import RsvpForm from "./features/rsvp/RsvpForm";
import GuestBook from "./features/guestBook/GuestBook";
import FlowerImage from "./features/common/FlowerImage";
import WhenAndWhere from "./features/whenAndWhere/WhenAndWhere";
import { weddingDateString } from "./features/easterEggs/strings";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./features/database/database";
import { showNotification } from "@mantine/notifications";

function App() {
  const { REACT_APP_EMAIL, REACT_APP_PASS } = process.env;

  React.useEffect(() => {
    console.log(weddingDateString);

    if (REACT_APP_EMAIL !== undefined && REACT_APP_PASS !== undefined) {
      signInWithEmailAndPassword(auth, REACT_APP_EMAIL, REACT_APP_PASS)
        .then((userCredential) => {
          showNotification({
            title: "Success",
            message: "You have successfully signed in. ",
            color: "green",
          });
        })
        .catch((error) => {
          showNotification({
            title: "Error",
            message: error.message,
            color: "red",
          });
        });
    }
  }, [REACT_APP_EMAIL, REACT_APP_PASS]);

  return (
    <>
      <Navbar
        links={[
          { link: "#whenAndWhere", label: "WHEN & WHERE" },
          { link: "#gallery", label: "GALLERY" },
          { link: "#guestBook", label: "GUEST BOOK" },
          { link: "#rsvp", label: "RSVP" },
        ]}
      />
      <Jumbotron />
      <WhenAndWhere />
      <Container>
        <SimpleGrid cols={1}>
          <Gallery />
        </SimpleGrid>
      </Container>

      <GuestBook />

      <FlowerImage />

      <Container>
        <SimpleGrid cols={1}>
          <RsvpForm />
        </SimpleGrid>
      </Container>

      <Footer />
    </>
  );
}

export default App;
