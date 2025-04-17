// src/todoFunctions.js
import axios from "axios";

const API_URL = "https://todo-list-w-api.onrender.com/api/todos/";

export const fetchTasks = async (setTasks) => {
    try {
        const response = await axios.get(`${API_URL}fetch`);
        setTasks(response.data);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};

export const addTask = async (task, tasks, setTasks, setTask) => {
    if (task.trim() === "") return;
    const newTask = { title: task, completed: false };

    try {
        const response = await axios.post(`${API_URL}create`, newTask);
        setTasks([...tasks, response.data]);
        setTask("");
    } catch (error) {
        console.error("Error adding task:", error);
    }
};

export const markCompleted = async (id, tasks, setTasks) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    try {
        const response = await axios.put(`${API_URL}${id}/update`, updatedTask);
        setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

export const editTaskHandler = (id, tasks, setTask, setEditId) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (taskToEdit) {
        setTask(taskToEdit.title);
        setEditId(id);
    }
};

export const updateTask = async (editId, task, tasks, setTasks, setEditId, setTask) => {
    if (!editId || task.trim() === "") return;
    const updatedTask = { title: task, completed: false };

    try {
        const response = await axios.put(`${API_URL}${editId}/update`, updatedTask);
        setTasks(tasks.map((t) => (t.id === editId ? response.data : t)));
        setEditId(null);
        setTask("");
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

export const removeTask = async (id, tasks, setTasks) => {
    try {
        await axios.delete(`${API_URL}${id}/delete`);
        setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};
