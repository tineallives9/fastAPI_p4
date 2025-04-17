import { useState, useEffect } from "react";
import axios from 'axios';
import './TodoList.css'; // Import the CSS file

const API_URL = "https://todo-list-w-api.onrender.com/api/todos/";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editId, setEditId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        document.body.classList.toggle('light-mode', !darkMode);
        fetchTasks();
    }, [darkMode]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("https://todo-list-w-api.onrender.com/api/todos/fetch");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async () => {
        if (task.trim() === "") return;
        const newTask = { title: task, completed: false };
    
        try {
            // This should be the correct URL for your FastAPI backend
            const response = await axios.post("http://127.0.0.1:8000//tasks", newTask); // Ensure the endpoint is correct
            setTasks([...tasks, response.data]); // Add the new task to your task list
            setTask(""); // Clear the input field after adding the task
        } catch (error) {
            console.error("Error adding task:", error);  // In case something goes wrong
        }
    };
    
    const markCompleted = async (id) => {
        const taskToUpdate = tasks.find((t) => t.id === id);
        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

        try {
            const response = await axios.put(`http://127.0.0.1:8000`, updatedTask);
            setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find((t) => t.id === id);
        if (taskToEdit) {
            setTask(taskToEdit.title);
            setEditId(id);
        }
    };

    const updateTask = async () => {
        if (!editId || task.trim() === "") return;

        const updatedTask = { title: task, completed: false };

        try {
            const response = await axios.put(`https://todo-list-w-api.onrender.com/api/todos/${editId}/update`, updatedTask);
            setTasks(tasks.map((t) => (t.id === editId ? response.data : t)));
            setEditId(null);
            setTask("");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const removeTask = async (id) => {
        try {
            await axios.delete(`https://todo-list-w-api.onrender.com/api/todos/${id}/delete`);
            setTasks(tasks.filter((t) => t.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const filteredTasks = tasks.filter((t) => {
        if (filter === "all") return true;
        if (filter === "completed") return t.completed;
        return !t.completed;
    });

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("theme", darkMode ? "light" : "dark");
    };

    return (
        <div className="todo-list-container">
            <button
                onClick={toggleDarkMode}
                className="dark-mode-button"
            >
                {darkMode ? '☀️ ' : '🌙 '}
            </button>

            <div className="todo-box">
                <div style={{ textAlign: 'center' }}>
                    <h2>✅ Todo-List App</h2>
                </div>

                <div className="task-input">
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                    <button
                        onClick={editId ? updateTask : addTask}
                        className={editId ? 'update' : ''}
                    >
                        {editId ? 'Update' : '➕ Add'}
                    </button>
                </div>

                <div className="filter-buttons">
                    {["all", "completed", "pending"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={filter === status ? 'active' : ''}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                <ul className="task-list">
                    {filteredTasks.length === 0 ? (
                        <p>No tasks listed.</p>
                    ) : (
                        filteredTasks.map((t) => (
                            <li key={t.id}>
                                <span className={t.completed ? 'completed' : ''}>
                                    {t.title}
                                </span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => markCompleted(t.id)}>✔️</button>
                                    <button onClick={() => editTask(t.id)}>✏️</button>
                                    <button onClick={() => removeTask(t.id)}>❌</button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
