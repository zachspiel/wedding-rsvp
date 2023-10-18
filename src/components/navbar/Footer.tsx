import { Container, Group, Anchor, rem } from "@mantine/core";
import { links } from "./links";
import Logo from "./Logo";
import classes from "./navbar.module.css";

const Footer = (): JSX.Element => {
  const items = links.map((link) => (
    <Anchor<"a"> c="dimmed" key={link.label} href={link.link} size="md">
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Logo />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
};

export default Footer;
