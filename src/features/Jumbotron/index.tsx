import classes from "./jumbotron.module.css";
import engagementPhoto from "./engagement.jpg";
import Image from "next/image";

const Jumbotron = (): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.inner}>
        <Image
          src={engagementPhoto}
          alt="Engagement Photo"
          priority
          placeholder="blur"
          quality={100}
          fill
          style={{ objectFit: "cover", transform: "translate3d(0, 0, 0)" }}
        />
      </div>
    </div>
  );
};

export default Jumbotron;
