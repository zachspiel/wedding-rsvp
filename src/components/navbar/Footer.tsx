import { Container, Group, Anchor, Image } from "@mantine/core";
import { links } from "./links";
import classes from "./navbar.module.css";

const Footer = (): JSX.Element => {
  const items = links.map((link) => (
    <Anchor<"a"> c="white" key={link.label} href={link.link} size="md" fz="lg">
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
