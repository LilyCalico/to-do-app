import classes from "./TaskItemFooterCommand.module.css";

const TaskItemFooterCommand = (props) => {
  const activeClass = `${props.active ? "active" : ""}`;

  return (
    <div className={classes.status}>
      <span className={activeClass} onClick={props.onShowAll}>
        All
      </span>
      <span className={activeClass} onClick={props.onShowActive}>
        Active
      </span>
      <span className={activeClass} onClick={props.onShowCompleted}>
        Completed
      </span>
    </div>
  );
};

export default TaskItemFooterCommand;
