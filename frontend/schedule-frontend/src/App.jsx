import React, { useState } from 'react';
import Schedule from './components/Schedule';
import TaskForm from './components/TaskForm';
import AddTask from './components/AddTask';
import UserForm from './components/AddUser';
import WeekSelector from './components/WeekSelector';
import LoginForm from './components/LoginForm';
import './App.css';

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showWeekForm, setShowWeekForm] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(1);

  return (
    <div>
      <h1>Weekly  Schedule</h1>
      <div className="button-container">
        <button onClick={() => setShowTaskForm(true)}>+ Task</button>
        <button onClick={() => setShowAddUser(true)}>+ User </button>
        <button onClick={() => setShowWeekForm(true)}> * Week </button>
        <button onClick={() => setShowLoginForm(true)}>Login</button>
      </div>
      {showTaskForm && (
        <>
          <div className="overlay" onClick={() => setShowTaskForm(false)}></div>
          <div className="modal" id="loc-123">
            <TaskForm />
          </div>
        </>
      )}
      {showAddUser && (
        <>
          <div className="overlay" onClick={() => setShowAddUser(false)}></div>
          <div className="modal">
            <UserForm />
          </div>
        </>
      )}
      {showAddTask && (
        <>
          <div className="overlay" onClick={() => setShowAddTask(false)}></div>
          <div className="modal">
            <AddTask />

          </div>
        </>
      )}
      {showWeekForm && (
        <>
          <div className="overlay" onClick={() => setShowWeekForm(false)}></div>
          <div className="modal">
            <WeekSelector
              onWeekChange={(year, week) => {
                setSelectedYear(year);
                setSelectedWeek(week);
              }}
            />
          </div>
        </>
      )}
      {showLoginForm && (
        <>
          <div className="overlay" onClick={() => setShowLoginForm(false)}></div>
          <div className="modal">
            <LoginForm />
          </div>
        </>
      )}
      <Schedule selectedYear={selectedYear} selectedWeek={selectedWeek} />
      <br />
    </div>
  );
};

export default App;
