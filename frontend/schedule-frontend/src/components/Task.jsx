import React,{useState} from 'react';

const Task = ({ task }) => {
  const { description, time_init, duration_estimated } = task;

  const startHour = new Date(time_init).getUTCHours();
  const startMinutes = new Date(time_init).getUTCMinutes();

  const durationInMinutes = duration_estimated;
  const heightPerHour = 2 * 37.8;
  const heightPercent = (durationInMinutes / 60) * heightPerHour;
  const [isHovered, setIsHovered] = useState(false);

  const taskStyle = {
    position: 'absolute',
    top: `${(startHour - 5) * heightPerHour + (startMinutes / 60) * heightPerHour}px`,
    height: `${heightPercent}px`,
    background: 'linear-gradient(to right, #A45DB7, #F2A6C0)',
    border: '1px solid #B93C7E', 
    borderRadius: '8px',
    padding: '10px',
    boxSizing: 'border-box',
    width: '100%',
    color: 'white', 
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.5)' : '0 4px 10px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const hourss = date.getUTCHours().toString().padStart(2,'0');
    const minutess = date.getUTCMinutes().toString().padStart(2,'0');
    const concat = hourss + ':' + minutess;
    return concat;
  };

  return (
    <div style={taskStyle}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      {formatTime(time_init)}
      <br/>
      {description}  
    </div>
  );
};

export default Task;
