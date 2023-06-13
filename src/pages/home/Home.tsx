import React from "react";
import { Container, SimpleGrid } from "@mantine/core";
import AdminViewToggle from "../../components/common/AdminViewToggle";
import FlowerImage from "../../components/common/FlowerImage";
import useSignInStatus from "../../hooks/signInStatus";
import Gallery from "./gallery/Gallery";
import GuestBook from "./guestBook/GuestBook";
import RsvpSection from "./guestRsvpForm/RsvpSection";
import Jumbotron from "./Jumbotron";
import Registry from "./Registry";
import WhenAndWhere from "./whenAndWhere/WhenAndWhere";
import ResponsiveHeader from "../../components/navbar/Navbar";
import Footer from "../../components/navbar/Footer";
import { weddingDateString } from "../../components/easterEggs";

const Home = (): JSX.Element => {
  const { isSignedIn } = useSignInStatus();

  React.useEffect(() => {
    console.log(weddingDateString);
  }, []);

  return (
    <>
      <ResponsiveHeader />
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

      <Footer />
    </>
  );
};

export default Home;
