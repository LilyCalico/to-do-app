import IconCheck from "../../assets/svg/IconCheck";
import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <div className={classes["btn-div"]}>
      <button
        className={classes.btn}
        id={props.id}
        type={props.type}
        onClick={props.onClick}
      >
        <IconCheck className={classes.icon} />
      </button>
    </div>
  );
};

export default Button;
