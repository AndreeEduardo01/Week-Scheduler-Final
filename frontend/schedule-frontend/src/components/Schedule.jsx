import React, { useEffect, useState } from 'react';
import Task from './Task.jsx';
import WeekSelector from './WeekSelector.jsx';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getStartOfWeek = (year, week) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const dayOfWeek = firstDayOfYear.getDay() || 7;
  const dayOffset = week * 7 - (dayOfWeek - 1);
  return new Date(year, 0, dayOffset);
};

const getEndOfWeek = (startOfWeek) => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return endOfWeek;
};

const Schedule = ({ selectedYear, selectedWeek }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const startOfWeek = getStartOfWeek(selectedYear, selectedWeek);
    const endOfWeek = getEndOfWeek(startOfWeek);

    fetch(`/scheduled?start=${startOfWeek.toISOString()}&end=${endOfWeek.toISOString()}`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [selectedYear, selectedWeek]);

  const getTasksForDay = (day) => {
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.time_init);
      const taskDay = taskDate.getDay();
      return taskDay === (day === 0 ? 7 : day);
    });
    return filteredTasks;
  };

  return (
    <div>
      <br />
      <div style={{ display: 'flex', justifyContent: 'space-between', height: '1500px', border: '1px solid white', overflowX: 'auto', overflowY: 'hidden' }}>
        {daysOfWeek.map((day, index) => (
          <div key={day} style={{ flex: 1, borderLeft: '1px solid white', padding: '3px', position: 'relative',width:'130px'}}>
            <h3>{day}</h3>
            <div style={{ position: 'relative', height: '1060px' }}>
              {getTasksForDay(index + 1).length === 0 ? (
                <small>No task today</small>
              ) : (
                getTasksForDay(index + 1).map((task) => (
                  <Task key={`${task.id_task}-${task.time_init}`} task={task} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
