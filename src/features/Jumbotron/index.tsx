import classes from "./jumbotron.module.css";

const Jumbotron = (): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.inner}></div>
    </div>
  );
};

export default Jumbotron;