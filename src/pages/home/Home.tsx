import React from "react";
import { Container, SimpleGrid } from "@mantine/core";
import AdminViewToggle from "../../components/common/AdminViewToggle";
import FlowerImage from "../../components/common/FlowerImage";
import Gallery from "./components/gallery/Gallery";
import GuestBook from "./components/guestBook/GuestBook";
import WhenAndWhere from "./components/whenAndWhere/WhenAndWhere";
import useSignInStatus from "../../hooks/signInStatus";
import Jumbotron from "./components/Jumbotron";
import RsvpSection from "./components/guestRsvpForm/RsvpSection";
import Registry from "./components/Registry";

const Home = (): JSX.Element => {
  const { isSignedIn } = useSignInStatus();

  return (
    <>
      <Jumbotron />
      <WhenAndWhere />
      <FlowerImage />

      <Container fluid>
        <Container sx={{ padding: "0" }}>
          <SimpleGrid cols={1} sx={{ paddingBottom: "5rem", paddingTop: "3rem" }}>
            <RsvpSection />
          </SimpleGrid>
        </Container>
      </Container>

      <GuestBook />
      <FlowerImage />

      <Container fluid>
        <Container sx={{ padding: "0" }}>
          <SimpleGrid cols={1} sx={{ paddingBottom: "5rem", paddingTop: "3rem" }}>
            <Gallery />
          </SimpleGrid>
        </Container>
      </Container>

      <Registry />

      {isSignedIn && <AdminViewToggle />}
    </>
  );
};

export default Home;
