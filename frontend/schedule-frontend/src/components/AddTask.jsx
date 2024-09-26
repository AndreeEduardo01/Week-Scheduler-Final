import React, { useState, useEffect } from 'react';

const AddTask = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [timeInit, setTimeInit] = useState('');
  const [durationEstimated, setDurationEstimated] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    fetch('/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));

    fetch('/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log('Error fetching users:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const startTime = new Date(timeInit);
    const durationInMinutes = parseInt(durationEstimated, 10);
    console.log(durationInMinutes);
    const estimatedEndTime = new Date(startTime.getTime() + durationInMinutes * 60000 - (5*60*60000)); 
    console.log("Estimated en time: " + estimatedEndTime);
    const endTimeInPeru = estimatedEndTime.toLocaleString('es-PE', { timeZone: 'America/Lima' });
    console.log(endTimeInPeru); 
    console.log(startTime.getTime());
    console.log(startTime.getTime()+ durationInMinutes * 60000);
    const newSchedule = {
      id_task: parseInt(selectedTask, 10),
      time_init: timeInit,
      duration_estimated: durationInMinutes,
      assigned_to: parseInt(assignedTo, 10),
      time_end_estimated: estimatedEndTime
    };

    console.log("New Schedule: ", JSON.stringify(newSchedule));
    const token = localStorage.getItem('token');

    fetch('/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newSchedule),
    })
      .then((response) => response.json())
      .then((data) => {
        setFormVisible(false);
      })
      .catch((error) => {
        console.error('Error scheduling task:', error);
      });
  };

  if (!formVisible) {
    return <p>Scheduled!</p>; 
  }

  return (
    <form onSubmit={handleSubmit} id="div-add-task-form">
      <h2>Schedule Task</h2>
      <div className="form-group">
        <label>Task:</label>
        <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
          <option value="">Select a task</option>
          {tasks.map((task) => (
            <option key={task.id_task} value={task.id_task}>
              {task.description}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Assigned To:</label>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id_user} value={user.id_user}>
              {user.name_user}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Start Time:</label>
        <input
          type="datetime-local"
          value={timeInit}
          onChange={(e) => setTimeInit(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Estimated Duration (minutes):</label>
        <input
          type="number"
          value={durationEstimated}
          onChange={(e) => setDurationEstimated(e.target.value)}
          required
        />
      </div>
      <button type="submit">Schedule It!</button>
    </form>
  );
};
export default AddTask;