import React from "react";
import Image from "next/image";
import classes from "./navbar.module.css";
import logo from "../../assets/images/The-Spielbergers-Wedding-Logo-Variant.webp";

const Logo = (): JSX.Element => {
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
