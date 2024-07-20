import Image from "next/image";
import engagementPhoto from "./engagement-photo.webp";
import classes from "./jumbotron.module.css";

const Jumbotron = (): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.inner}>
        <Image
          src={engagementPhoto}
          alt="Engagement Photo"
          priority
          placeholder="blur"
          quality={80}
          fill
          style={{ objectFit: "cover", transform: "translate3d(0, 0, 0)" }}
        />
      </div>
    </div>
  );
};

export default Jumbotron;
