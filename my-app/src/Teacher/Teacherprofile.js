import React from 'react';
import './Sidebar.css'; // Import your CSS file
import Header from '../Header';
import TeacherSideBar from './TeacherSideBar';

const TeacherProfile = () => {
  return (
    <>
     <Header/>
    <TeacherSideBar/>
    <div className="profile-container">
      <h1 className='profheader'>Teacher Profile</h1>
      <hr/>
      <div className="profile-info">
        <p>
          <strong>First Name:</strong> John
        </p>
        <p>
          <strong>Last Name:</strong> Doe
        </p>
        <p>
          <strong>Email:</strong> john.doe@example.com
        </p>
        <p>
          <strong>ID:</strong> 123456
        </p>
        <p>
          <strong>City:</strong> Example City
        </p>
        <p>
          <strong>Date of Birth:</strong> January 1, 1990
        </p>
      </div>
    </div>
    </>
   
  );
}

export default TeacherProfile;

