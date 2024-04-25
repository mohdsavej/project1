import React, { useState } from "react";
import "./App.css"; // Import CSS file for styles

const TaskForm = ({ project, onAddTask }) => {
  const [taskDescription, setTaskDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskDescription.trim() !== "") {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        description: taskDescription,
      };
      onAddTask(project, newTask);
      setTaskDescription("");
    } else {
      alert("Task description cannot be empty!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Enter task description..."
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

const ProjectTable = ({
  projects,
  onDelete,
  onEdit,
  onAddTask,
  onRemoveTask,
}) => {
  const [showTaskForm, setShowTaskForm] = useState(null);

  const handleAddTaskClick = (project) => {
    setShowTaskForm(project);
  };

  const handleRemoveTask = (project, taskId) => {
    onRemoveTask(project, taskId);
  };

  return (
    <table className="project-table">
      <thead>
        <tr>
          <th>Project Code</th>
          <th>Project Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.code}>
            <td>{project.code}</td>
            <td className="project-title">
              <div style={{ position: "relative" }}>
                {project.name}
                <ul className="task-list">
                  {project.tasks &&
                    project.tasks.map((task) => (
                      <li key={task.id} className="task-item">
                        {task.description}
                        <button
                          className="remove-task-btn"
                          onClick={() => handleRemoveTask(project, task.id)}
                        >
                          -
                        </button>
                      </li>
                    ))}
                </ul>
                <button
                  className="add-task-btn"
                  onClick={() => handleAddTaskClick(project)}
                >
                  +
                </button>
              </div>
              {showTaskForm === project && (
                <TaskForm project={project} onAddTask={onAddTask} />
              )}
            </td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(project)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(project.code)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ProjectForm = ({ project, onSave, onClose }) => {
  const [projectCode, setProjectCode] = useState(project ? project.code : "");
  const [projectName, setProjectName] = useState(project ? project.name : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ code: projectCode, name: projectName });
    setProjectCode("");
    setProjectName("");
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit} className="project-form">
          <label>
            Project Code:
            <input
              type="text"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
            />
          </label>
          <label>
            Project Name:
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

const ProjectTableContainer = () => {
  const [projects, setProjects] = useState([
    { code: 1, name: "Project 1", tasks: [] },
    { code: 2, name: "Project 2", tasks: [] },
    { code: 3, name: "Project 3", tasks: [] },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (code) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.code !== code)
    );
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowEditForm(true);
  };

  const handleCreateProject = () => {
    setShowForm(true);
    setSelectedProject(null);
  };

  const handleSave = (newProject) => {
    if (selectedProject) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.code === selectedProject.code ? newProject : project
        )
      );
      setShowEditForm(false);
    } else {
      setProjects((prevProjects) => [...prevProjects, newProject]);
      setShowForm(false);
    }
  };

  const handleAddTask = (project, newTask) => {
    const updatedProjects = projects.map((p) => {
      if (p.code === project.code) {
        return { ...p, tasks: [...p.tasks, newTask] };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleRemoveTask = (project, taskId) => {
    const updatedProjects = projects.map((p) => {
      if (p.code === project.code) {
        return {
          ...p,
          tasks: p.tasks.filter((task) => task.id !== taskId),
        };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredProjects = projects.filter((project) => {
    const codeMatch = project.code
      .toString()
      .toLowerCase()
      .includes(searchQuery);
    const nameMatch = project.name.toLowerCase().includes(searchQuery);
    return codeMatch || nameMatch;
  });

  return (
    <div>
      <h2>Project List</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by project code or name..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <button className="create-project-btn" onClick={handleCreateProject}>
        Create Project
      </button>
      {showForm && (
        <ProjectForm onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
      {showEditForm && (
        <ProjectForm
          project={selectedProject}
          onSave={handleSave}
          onClose={() => setShowEditForm(false)}
        />
      )}
      <ProjectTable
        projects={filteredProjects}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onAddTask={handleAddTask}
        onRemoveTask={handleRemoveTask}
      />
    </div>
  );
};

export default ProjectTableContainer;
