import { Fragment, useRef, useState, useContext } from "react";
import ListContext from "../../store/list-context";
import Button from "../Button/Button";
import IconSun from "../../assets/svg/IconSun";
import IconMoon from "../../assets/svg/IconMoon";
import useFetch from "../../hooks/use-fetch";
import classes from "./Form.module.css";

const Form = (props) => {
  const ctx = useContext(ListContext);
  const { taskIdsArray, putTaskIdsArray } = ctx;

  const { err, sendRequest } = useFetch();
  const inputTextRef = useRef("");
  const [taskIsValid, setTaskIsValid] = useState(true);
  const [theme, setTheme] = useState("light");

  const submitHandler = (e) => {
    e.preventDefault();

    const text = inputTextRef.current.value;
    const id = new Date().getTime().toString();

    if (text.trim().length === 0) {
      e.target[1].placeholder = "Please write a task here...";
      setTaskIsValid(false);
      return;
    }

    setTaskIsValid(true);
    const newTask = { id, text, completed: false };

    props.onAddTask(newTask);

    sendRequest(
      {
        method: "POST",
        body: newTask,
        headers: { "Content-Type": "application/json" },
      },
      () => {}
    );

    const idArray = [...taskIdsArray];
    idArray.push(id);
    putTaskIdsArray(idArray);

    const baseUrl = import.meta.env.REACT_APP_FIREBASE_URL;
    const endpoint = "taskIds.json";
    sendRequest(
      {
        url: baseUrl + endpoint,
        method: "PUT",
        body: idArray,
        headers: { "Content-Type": "application/json" },
      },
      () => {}
    );

    e.target[1].placeholder = "Create a new todo...";
    inputTextRef.current.value = "";
  };

  const formClasses = `${classes.form} ${!taskIsValid ? classes.invalid : ""}`;

  const toggleThemeHandler = () => {
    if (theme === "light") {
      setTheme("dark");
      document.body.dataset.theme = "dark";
    } else {
      setTheme("light");
      document.body.dataset.theme = "light";
    }
  };

  return (
    <Fragment>
      <div className={classes.title}>
        <h1>todo</h1>
        {theme === "light" && (
          <IconMoon className={classes.icon} onClick={toggleThemeHandler} />
        )}
        {theme === "dark" && (
          <IconSun className={classes.icon} onClick={toggleThemeHandler} />
        )}
      </div>
      <form className={formClasses} onSubmit={submitHandler}>
        <Button type="submit" />
        <input
          ref={inputTextRef}
          className={classes.input}
          type="text"
          placeholder="Create a new todo..."
          autoComplete="off"
        />
      </form>
      {err && <p>Something went wrong!</p>}
    </Fragment>
  );
};

export default Form;
