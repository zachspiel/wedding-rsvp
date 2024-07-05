import { Anchor, Container, Group } from "@mantine/core";
import { links } from "../common";
import classes from "./footer.module.css";

const Footer = (): JSX.Element => {
  const items = links.map((link) => (
    <Anchor
      c="white"
      key={link.label}
      href={link.link}
      size="md"
      fz="lg"
      className={link.label === "RSVP" ? classes.highlightedLink : ""}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
};

export default Footer;
