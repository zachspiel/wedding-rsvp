import React from "react";
import { createStyles, Image } from "@mantine/core";
import logo from "../../assets/images/The-Spielbergers-Wedding-Logo-Variant.webp";

const useStyles = createStyles((theme) => ({
  logo: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const Logo = (): JSX.Element => {
  const { classes } = useStyles();
  return (
    <Image
      src={logo}
      className={classes.logo}
      width={56}
      height={56}
      alt="The Spielbergers Wedding Logo"
    />
  );
};

export default Logo;
