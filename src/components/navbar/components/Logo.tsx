import Image from "next/image";

const Logo = (): JSX.Element => {
  return (
    <Image
      src="/assets/images/rivera-wedding-logo.webp"
      width={80}
      height={80}
      alt="Rivera Wedding Logo"
    />
  );
};

export default Logo;
