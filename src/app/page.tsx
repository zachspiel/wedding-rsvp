import Gallery from "@spiel-wedding/features/Gallery";
import GuestBook from "@spiel-wedding/features/GuestBook";
import WhenAndWhere from "@spiel-wedding/features/WhenAndWhere";
import Registry from "@spiel-wedding/features/Registry";
import Jumbotron from "@spiel-wedding/features/Jumbotron";
import ZachAndSedona from "@spiel-wedding/features/ZachAndSedona";
import RSVP from "@spiel-wedding/features/RSVP";


export default function Home() {
  return (
    <main>
      <Jumbotron />
      <ZachAndSedona />
      <WhenAndWhere />
      <RSVP />
      <GuestBook />
      <Registry />
      <Gallery />
    </main>
  );
}
