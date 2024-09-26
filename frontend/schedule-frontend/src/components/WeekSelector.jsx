import React, { useState } from 'react';


const getWeekNumber = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfWeek = startOfYear.getDay();
  const firstMonday = dayOfWeek === 1 ? startOfYear : new Date(startOfYear.setDate(startOfYear.getDate() + (8 - dayOfWeek) % 7));
  const daysSinceFirstMonday = Math.floor((date - firstMonday) / 86400000);
  return daysSinceFirstMonday >= 0 ? Math.floor(daysSinceFirstMonday / 7) + 1 : 1;
};

const WeekSelector = ({ onWeekChange }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [week, setWeek] = useState(getWeekNumber(new Date()));

  const getWeeksInYear = (year) => {
    const lastDayOfYear = new Date(year, 11, 31);
    const dayOfWeek = new Date(year, 0, 1).getDay();
    const firstMonday = dayOfWeek === 1 ? new Date(year, 0, 1) : new Date(year, 0, 1 + (8 - dayOfWeek) % 7);
    const dayDifference = (lastDayOfYear - firstMonday) / 86400000;
    return Math.ceil(dayDifference / 7) + 1; 
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear);
    setWeek(getWeekNumber(new Date(newYear, 0, 1)));
    onWeekChange(newYear, week);
  };

  const handleWeekChange = (e) => {
    const newWeek = parseInt(e.target.value);
    setWeek(newWeek);
    onWeekChange(year, newWeek);
  };

  return (
    <form id="div-add-task-form">
      <h2>Choose a week</h2>
      <div className="form-group">
        <label htmlFor="year">Year:</label>
        <select id="year" value={year} onChange={handleYearChange}>
          {[...Array(10).keys()].map((i) => {
            const displayYear = new Date().getFullYear() - i;
            return (
              <option key={displayYear} value={displayYear}>
                {displayYear}
              </option>
            );
          })}
        </select>
      </div>
      <div className="form-group">    
        <label htmlFor="week">Week:</label>
        <select id="week" value={week} onChange={handleWeekChange}>
          {Array.from({ length: getWeeksInYear(year) }, (_, i) => i + 1).map((weekNum) => (
            <option key={weekNum} value={weekNum}>
              Week {weekNum}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default WeekSelector;
