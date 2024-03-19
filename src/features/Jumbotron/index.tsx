import Image from "next/image";
import classes from "./jumbotron.module.css";

const Jumbotron = (): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.inner}>
        <Image
          src="/assets/images/engagement-photo.webp"
          alt="Enagement Photo"
          fill
          loading="eager"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default Jumbotron;
