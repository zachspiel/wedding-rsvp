import Image from "next/image";

const Logo = (): JSX.Element => {
  return (
    <Image
      src="/assets/images/The-Spielbergers-Wedding-Logo-Variant.webp"
      width={100}
      height={90}
      alt="The Spielbergers Wedding Logo"
    />
  );
};

export default Logo;
