import React, { useState } from 'react';

const Attendancesheet = ({ id, name, date, onClick }) => {
  const [attendanceState, setAttendanceState] = useState('Present');

  const handleButtonClick = () => {
    // Toggle between "Present" and "Absent" states
    const newState = attendanceState === 'Present' ? 'Absent' : 'Present';
    setAttendanceState(newState);
    onClick(newState); // Pass the updated state to the parent component
  };

  return (
    <tr>
      <td style={tableCellStyle}>{id}</td>
      <td style={tableCellStyle}>{name}</td>
      <td style={tableCellStyle}>{date}</td>
      <td style={tableCellStyle}>
        <button style={buttonStyle(attendanceState)} onClick={handleButtonClick}>
          {attendanceState}
        </button>
      </td>
    </tr>
  );
};

const tableCellStyle = {
  borderBottom: '1px solid #ddd',
  padding: '12px',
  textAlign: 'center', // Center align the content
};

const buttonStyle = (state) => ({
  padding: '8px 16px',
  backgroundColor: state === 'Present' ? '#4caf50' : '#f44336', // Green for Present, Red for Absent
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
});

export default Attendancesheet;
