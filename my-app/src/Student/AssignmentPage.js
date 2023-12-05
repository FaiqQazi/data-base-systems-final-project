import React from 'react';
//faiq is so beautifull
const AttendancePage = ({ course_name, class_name, present_days, total_days }) => {
  // Calculate attendance percentage
  const attendancePercentage = (present_days / total_days) * 100;

  return (
    <div className="attendance-container">
      <h1>Attendance Details</h1>
      <p><strong>Course ID:</strong> {course_name}</p>
      <p><strong>Course Name:</strong> {class_name}</p>

      <div className="attendance-info">
        <p><strong>Attendance:</strong></p>
        <div className="attendance-bar">
          <div
            className="attendance-progress"
            style={{ width: `${attendancePercentage}%` }}
          >
            <span>{attendancePercentage.toFixed(2)}%</span>
          </div>
        </div>
        <button onClick={() => onClick(course_id, class_id)}>View Details</button>
      </div>
    </div>
  );
};

export default AttendancePage;
