import React from "react";

const TaskList = ({ tasks, fetchTasks }) => {
  const API_URL = 'https://task-manager-backend-911407792100.us-central1.run.app/'
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status === "pending" ? "completed" : "pending" }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className={task.status === "completed" ? "completed" : ""}>
          <div className="task-details">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
          <div className="task-actions">
            <button onClick={() => handleToggleStatus(task._id, task.status)}>
              {task.status === "pending" ? "Complete" : "Undo"}
            </button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
