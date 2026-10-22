import classes from "./TaskItemFooterS.module.css";

const TaskItemFooterS = (props) => {
  return (
    <div className={classes["task-footer"]}>
      <span>{props.numOfTasks} items left</span>

      <span className={classes.clear} onClick={props.onClear}>
        Clear Completed
      </span>
    </div>
  );
};

export default TaskItemFooterS;
