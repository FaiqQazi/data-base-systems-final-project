import React from 'react';
import Header from '../Header';
import StudentSideBar from './StudentSideBar';

const Studentprofile = () => {
  return (
    <>
     <Header/>
    <StudentSideBar/>
    <div className="profile-container">
      <h1 className='profheader'>Student Profile</h1>
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
  )
}

export default Studentprofile
