import { Container, Group, Anchor } from "@mantine/core";
import classes from "./footer.module.css";
import { links } from "../common";

const Footer = (): JSX.Element => {
  const items = links.map((link) => (
    <Anchor<"a">
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
