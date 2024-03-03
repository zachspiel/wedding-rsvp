import Image from "next/image";
import classes from "./navbar.module.css";

const Logo = (): JSX.Element => {
  return (
    <Image
      src="/assets/images/The-Spielbergers-Wedding-Logo-Variant.webp"
      className={classes.logo}
      width={100}
      height={90}
      alt="The Spielbergers Wedding Logo"
    />
  );
};

export default Logo;
