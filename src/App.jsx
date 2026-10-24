// APP
import { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Footer from "./component/Footer";
import Form from "./component/NewTask/Form";
import Task from "./component/Task/Task";
import useFetch from "./hooks/use-fetch";
import ListContext from "./store/list-context";
import Layout from "./ui/Layout";
import "./App.css";

//firebase
const App = () => {
	//CONTEXT
	const ctx = useContext(ListContext);
	const { column, tasks, setTasks, putTaskIdsArray, taskIdsArray } = ctx;

	//STATE, CUSTOM HOOK
	const [numOfTasks, setNumOfTasks] = useState();
	const { err, sendRequest } = useFetch();

	//----- Load Tasks from DB -----//
	useEffect(() => {
		const getTasks = async () => {
			let taskIds = [];

			const getTaskIds = (inputTaskIds) => {
				if (!inputTaskIds) {
					return;
				}

				taskIds = Object.values(inputTaskIds);
			};

			const baseUrl = import.meta.env.REACT_APP_FIREBASE_URL;
			const endpoint = "taskIds.json";
			await sendRequest(
				{
					url: baseUrl + endpoint,
				},
				getTaskIds,
			);

			const transformedTasks = (taskObj) => {
				const loadedTasks = [];

				for (const property in taskObj) {
					if (!taskObj[property]) {
						continue;
					}

					loadedTasks.push({
						id: taskObj[property].id,
						text: taskObj[property].text,
						completed: taskObj[property].completed,
					});
				}

				// taskIds の順に並べる。tasks に無い ID は捨て、taskIds に無いタスクは末尾に足す
				const sortedTasks = [...new Set(taskIds)]
					.map((id) => loadedTasks.find((task) => task.id === id))
					.filter(Boolean);
				const unsortedTasks = loadedTasks.filter(
					(task) => !taskIds.includes(task.id),
				);
				const orderedTasks = sortedTasks.concat(unsortedTasks);

				setTasks(orderedTasks);
				putTaskIdsArray(orderedTasks.map((task) => task.id));
				setNumOfTasks(
					orderedTasks.filter((task) => task.completed === false).length,
				);
			};

			await sendRequest({}, transformedTasks);
		};

		getTasks();
	}, [putTaskIdsArray, sendRequest, setTasks]);

	//----- task handler -----//
	const taskAddHandler = (newTask) => {
		setTasks((prevState) => prevState.concat(newTask));
		setNumOfTasks((prevState) => prevState + 1);
	};

	const deleteTaskHandler = (id) => {
		const newTasks = tasks.filter((task) => task.id !== id);
		const newTaskIds = taskIdsArray.filter((taskId) => taskId !== id);

		sendRequest({ method: "PUT", body: newTasks }, () => {});
		setTasks(newTasks);
		putTaskIdsArray(newTaskIds);
		setNumOfTasks((prevState) => prevState - 1);

		const baseUrl = import.meta.env.REACT_APP_FIREBASE_URL;
		const endpoint = "taskIds.json";
		sendRequest(
			{
				url: baseUrl + endpoint,
				method: "PUT",
				body: newTaskIds,
				headers: { "Content-Type": "application/json" },
			},
			() => {},
		);
	};

	const clearTasksHandler = () => {
		const remainingTasks = tasks.filter((task) => task.completed === false);
		const remainingTaskIds = taskIdsArray.filter((taskId) =>
			remainingTasks.some((task) => task.id === taskId),
		);
		sendRequest({ method: "PUT", body: remainingTasks }, () => {});
		setTasks(remainingTasks);
		putTaskIdsArray(remainingTaskIds);
		setNumOfTasks(
			remainingTasks.filter((task) => task.completed === false).length,
		);

		const baseUrl = import.meta.env.REACT_APP_FIREBASE_URL;
		const endpoint = "taskIds.json";
		sendRequest(
			{
				url: baseUrl + endpoint,
				method: "PUT",
				body: remainingTaskIds,
				headers: { "Content-Type": "application/json" },
			},
			() => {},
		);
	};

	//----- task STATUS -----//
	const toggleTaskStatusHandler = (id) => {
		const selectedTaskIndex = tasks.findIndex((task) => task.id === id);
		const selectedTask = tasks[selectedTaskIndex];
		const updatedTask = { ...selectedTask, completed: !selectedTask.completed };

		let updatedTasks;
		updatedTasks = [...tasks];
		updatedTasks[selectedTaskIndex] = updatedTask;

		sendRequest({ method: "PUT", body: updatedTasks }, () => {});
		setTasks(updatedTasks);
		setNumOfTasks(
			updatedTasks.filter((task) => task.completed === false).length,
		);
	};

	//----- task EDIT & REWRITE -----//
	const editTaskHandler = (editedTask, id) => {
		const selectedTaskIndex = tasks.findIndex((task) => task.id === id);
		const selectedTask = tasks[selectedTaskIndex];
		const updatedTask = { ...selectedTask, text: editedTask };
		let updatedTasks;
		updatedTasks = [...tasks];
		updatedTasks[selectedTaskIndex] = updatedTask;

		sendRequest({ method: "PUT", body: updatedTasks }, () => {});
		setTasks(updatedTasks);
	};

	//----- DRAG & DROP -----//
	let filteredTasks;
	const filteredTasksHandler = (taskDataArray) => {
		filteredTasks = taskDataArray;
	};

	const onDragEnd = (result) => {
		console.log(result);
		const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const prevIndex = taskIdsArray.findIndex((id) => id === draggableId);

		if (!filteredTasks) {
			filteredTasks = tasks;
		}

		const belowId = filteredTasks[destination.index].id;
		const belowIdIndex = taskIdsArray.findIndex((id) => belowId === id);
		const taskIdsArrayUntilBelowId = taskIdsArray.slice(0, belowIdIndex);
		const numOfCompletedTasks = taskIdsArrayUntilBelowId.flatMap(
			(element, index) => (element.completed === true ? index : []),
		).length;
		const destinationIndex = destination.index + numOfCompletedTasks;

		const newTaskIds = Array.from(taskIdsArray);
		newTaskIds.splice(prevIndex, 1);
		newTaskIds.splice(destinationIndex, 0, draggableId);
		putTaskIdsArray(newTaskIds);

		const baseUrl = import.meta.env.REACT_APP_FIREBASE_URL;
		const endpoint = "taskIds.json";
		sendRequest(
			{
				url: baseUrl + endpoint,
				method: "PUT",
				body: newTaskIds,
				headers: { "Content-Type": "application/json" },
			},
			() => {},
		);

		const sortedTasks = [];

		for (const el of newTaskIds) {
			const index = tasks.findIndex((item) => item.id === el);

			if (index === -1) {
				continue;
			}

			const item = tasks[index];
			sortedTasks.push(item);
		}
		setTasks(sortedTasks);
	};

	//-------------------//

	return (
		<Layout>
			<Form onAddTask={taskAddHandler} />
			<DragDropContext onDragEnd={onDragEnd}>
				<Task
					column={column}
					items={tasks}
					numOfTasks={numOfTasks}
					onClear={clearTasksHandler}
					onToggle={toggleTaskStatusHandler}
					onEdit={editTaskHandler}
					onDelete={deleteTaskHandler}
					onFilteredTasks={filteredTasksHandler}
				/>
			</DragDropContext>
			<Footer />
			{err && <p>Something went wrong!</p>}
		</Layout>
	);
};

export default App;
