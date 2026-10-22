import classes from "./TaskItemFooter.module.css";

const TaskItemFooter = (props) => {
  return (
    <div className={classes["task-footer"]}>
      <span>{props.numOfTasks} items left</span>

      <div className={classes.status}>
        <span onClick={props.onShowAll}>All</span>
        <span onClick={props.onShowActive}>Active</span>
        <span onClick={props.onShowCompleted}>Completed</span>
      </div>

      <span className={classes.clear} onClick={props.onClear}>
        Clear Completed
      </span>
    </div>
  );
};

export default TaskItemFooter;
