import { useMediaQuery } from "react-responsive";
import { Droppable } from "react-beautiful-dnd";
import { useState, useContext } from "react";
import ListContext from "../../store/list-context";

import TaskItem from "./TaskItem";
import TaskItemFooter from "./TaskItemFooter";
import TaskItemFooterS from "./small/TaskItemFooterS";
import TaskItemFooterCommand from "./small/TaskItemFooterCommand";
import classes from "./Task.module.css";
import { Fragment } from "react";

const Task = (props) => {
  const ctx = useContext(ListContext);
  const { tasks: items } = ctx;

  const [showActive, setShowActive] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const isSmall = useMediaQuery({
    query: "(max-width: 500px)",
  });

  //----- handler-----//
  const onShowAllHandler = () => {
    setShowActive(false);
    setShowCompleted(false);
  };

  const onShowActiveHandler = (e) => {
    setShowActive(true);
    setShowCompleted(false);
  };

  const onShowCompletedHandler = () => {
    setShowCompleted(true);
    setShowActive(false);
  };

  //----- List -----//
  let taskDataArray;
  if (!showActive && !showCompleted) {
    taskDataArray = items;
  }

  if (showActive) {
    taskDataArray = items.filter((task) => task.completed === false);
    props.onFilteredTasks(taskDataArray);
  }

  if (showCompleted) {
    taskDataArray = items.filter((task) => task.completed === true);
    props.onFilteredTasks(taskDataArray);
  }

  const taskList = (
    <ul>
      {taskDataArray.map((task, index) => {
        return (
          <TaskItem
            key={task.id}
            id={task.id}
            text={task.text}
            completed={task.completed}
            onDelete={props.onDelete}
            onToggle={props.onToggle}
            onEdit={props.onEdit}
            index={index}
          />
        );
      })}
    </ul>
  );

  return (
    <Fragment>
      <div className={classes.task}>
        <Droppable droppableId="todo">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {taskList}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {!isSmall && (
          <TaskItemFooter
            onShowAll={onShowAllHandler}
            onShowActive={onShowActiveHandler}
            onShowCompleted={onShowCompletedHandler}
            onClear={props.onClear}
            numOfTasks={props.numOfTasks}
          />
        )}
        {isSmall && (
          <TaskItemFooterS
            numOfTasks={props.numOfTasks}
            onClear={props.onClear}
          />
        )}
      </div>
      {isSmall && (
        <TaskItemFooterCommand
          onShowAll={onShowAllHandler}
          onShowActive={onShowActiveHandler}
          onShowCompleted={onShowCompletedHandler}
        />
      )}
    </Fragment>
  );
};

export default Task;
