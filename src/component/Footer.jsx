import { Fragment } from "react";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <Fragment>
      <p className={classes.explanation}>Drag and drop to reorder list</p>
      {/* <div className={classes.attribution}>
        Coded by{" "}
        <a
          href="https://yurioda.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Yuri Oda
        </a>
        .
      </div> */}
    </Fragment>
  );
};

export default Footer;
