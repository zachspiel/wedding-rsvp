import React from "react";
import { createStyles, Image } from "@mantine/core";

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
      src={"/assets/images/The-Spielbergers-Wedding-Logo-Variant.webp"}
      className={classes.logo}
      width={56}
      height={56}
      alt="The Spielbergers Wedding Logo"
    />
  );
};

export default Logo;
