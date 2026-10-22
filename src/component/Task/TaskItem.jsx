import { useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import Button from "../Button/Button";
import ButtonCompleted from "../Button/ButtonCompleted";
import classes from "./TaskItem.module.css";
import IconCross from "../../assets/svg/IconCross";

const TaskItem = (props) => {
  const taskRef = useRef();
  const [editTask, setEditTask] = useState(false);

  const completeToggleHandler = () => {
    props.onToggle(props.id);
  };

  const editToggleHandler = () => {
    if (props.completed) {
      return;
    }
    setEditTask((prevState) => !prevState);
  };

  const enterPressedHandler = (e) => {
    if (e.which === 13) {
      const editedTask = taskRef.current.value;
      props.onEdit(editedTask, props.id);
      setEditTask(false);
    }
  };

  const deleteTaskHandler = () => {
    props.onDelete(props.id);
  };

  //classes
  const edit = !editTask ? true : false;
  const inputClass = `${classes["task-input"]} ${
    props.completed ? classes.completed : ""
  }`;

  //id
  const listId = `list_${props.id}`;
  const buttonId = `button_${props.id}`;
  const crossId = `cross_${props.id}`;

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => {
        return (
          <li
            id={listId}
            className={classes["task-item"]}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {!props.completed ? (
              <Button
                id={buttonId}
                type="button"
                onClick={completeToggleHandler}
              />
            ) : (
              <ButtonCompleted id={buttonId} onClick={completeToggleHandler} />
            )}

            <div className={classes["input-div"]}>
              <input
                className={inputClass}
                defaultValue={props.text}
                ref={taskRef}
                type="text"
                readOnly={edit}
                onClick={editToggleHandler}
                onBlur={editToggleHandler}
                onKeyDown={enterPressedHandler}
              />
              <IconCross
                className={classes["icon-cross"]}
                onClick={deleteTaskHandler}
                id={crossId}
              />
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};

export default TaskItem;
