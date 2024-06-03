import Image from "next/image";

const Logo = (): JSX.Element => {
  return (
    <Image
      src="/assets/images/rivera-wedding-logo.webp"
      width={100}
      height={100}
      alt="Rivera Wedding Logo"
    />
  );
};

export default Logo;
