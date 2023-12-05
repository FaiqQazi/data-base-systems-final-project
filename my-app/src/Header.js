import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom'; // Change the import to useNavigate

const Header = () => {
  const navigate = useNavigate(); // Use useNavigate instead of calling Navigate()

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(intervalId);
  }, []);

  const logoutHandler = () => {
    navigate('/'); // Use navigate to go to the specified route
  };

  const headingStyles = {
    color: 'blue',
    fontSize: '24px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
  };

  return (
    <div className="header">
      <div className="time">{currentTime}</div>
      <h1 style={headingStyles}>NUST</h1>
      <div className="header-right">
        <button className="logout" onClick={logoutHandler}>
          LOG OUT
        </button>
      </div>
    </div>
  );
};

export default Header;
