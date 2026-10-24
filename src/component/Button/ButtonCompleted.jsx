import IconCheck from "../../assets/svg/IconCheck";
import classes from "./ButtonCompleted.module.css";

const ButtonCompleted = (props) => {
  return (
    <div className={classes["btn-div"]}>
      <button className={classes.btn} type={props.type} onClick={props.onClick}>
        <IconCheck className={classes.icon} />
      </button>
    </div>
  );
};

export default ButtonCompleted;
