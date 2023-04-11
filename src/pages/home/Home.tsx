import React from "react";
import { Container, SimpleGrid } from "@mantine/core";
import AdminViewToggle from "../../components/common/AdminViewToggle";
import FlowerImage from "../../components/common/FlowerImage";
import Gallery from "./components/gallery/Gallery";
import GuestBook from "./components/guestBook/GuestBook";
import RsvpForm from "./components/guestRsvpForm/GuestRsvpForm";
import WhenAndWhere from "./components/whenAndWhere/WhenAndWhere";
import useSignInStatus from "../../hooks/signInStatus";
import Jumbotron from "./components/Jumbotron";

const Home = (): JSX.Element => {
  const { isSignedIn } = useSignInStatus();

  return (
    <>
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
    </>
  );
};

export default Home;
