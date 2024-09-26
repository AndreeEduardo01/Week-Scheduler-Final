import React, { useState, useEffect } from 'react';

const TaskForm = () => {
  const [kindoftasks, setKindoftasks] = useState([]);
  const [selectedKindoftask, setSelectedKindoftask] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    const fetchKindoftasks = async () => {
      try {
        const response = await fetch('/kindoftasks');
        const data = await response.json();
        console.log(data);
        setKindoftasks(data);
      } catch (error) {
        console.error('Error fetching kind of tasks:', error);
      }
    };

    fetchKindoftasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedKindoftask || !description) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const task = {
      id_kindoftask: parseInt(selectedKindoftask, 10),
      description
    };
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        },
    body: JSON.stringify(task),
      });
  if (response.ok) {
    setSelectedKindoftask('');
    setDescription('');
    setError('');
    setFormVisible(false);

  } else {
    setError('Error al crear la tarea.');
  }
} catch (error) {
  setError('Error en la solicitud.');
}
  };
if (!formVisible) {
  return <p>Task Successfully Created !</p>;
}
return (
  <form onSubmit={handleSubmit} id="div-add-task-form">
    <h2>Create a task!</h2>
    <div className="form-group">
      <label>Kind of Task:</label>
      <select
        value={selectedKindoftask}
        onChange={(e) => setSelectedKindoftask(e.target.value)}
      >
        <option value="">Seleccione un tipo de tarea</option>
        {kindoftasks.map((kindoftask) => (
          <option key={kindoftask.id_kindoftask} value={kindoftask.id_kindoftask}>
            {kindoftask.name_kindoftask}
          </option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label>Description: </label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
    <button type="submit">Add Task</button>
    {error && <p>{error}</p>}
  </form>
);
};
export default TaskForm;