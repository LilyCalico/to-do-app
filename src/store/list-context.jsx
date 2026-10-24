import React, { useState, useCallback } from "react";

const ListContext = React.createContext({
  tasks: [],
  setTasks: (tasks) => {},
  taskIdsArray: [],
  putTaskIdsArray: () => {},
});

export const ListContextProvider = (props) => {
  const [tasks, setTasks] = useState([]);
  const [taskIds, setTaskIds] = useState([]);

  const putTaskIdsArray = useCallback(
    (newIds) => {
      setTaskIds(newIds);
    },
    [setTaskIds]
  );

  const setTaskHandler = useCallback(
    (newState) => {
      setTasks(newState);
    },
    [setTasks]
  );

  const listValue = {
    tasks: tasks,
    setTasks: setTaskHandler,
    taskIdsArray: taskIds,

    putTaskIdsArray: putTaskIdsArray,
  };

  return (
    <ListContext.Provider value={listValue}>
      {props.children}
    </ListContext.Provider>
  );
};

export default ListContext;
