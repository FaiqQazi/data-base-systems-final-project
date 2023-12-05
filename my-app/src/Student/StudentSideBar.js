import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Studentsidebar.css';

const StudentSideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
      <header className="sidebar-header" role="banner">
        <h1 className="logo">
          <a>
            Hello <span>STUDENT</span>
          </a>
        </h1>
        <div className="nav-wrap">
          <nav className="main-nav" role="navigation">
            <ul className="unstyled list-hover-slide">
              <li>
                <Link to="/student">
                  <a>DASHBOARD</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/profile">
                  <a>PROFILE</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/view">
                  <a>COURSES</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/attendence">
                  <a>ATTENDANCE</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/assignment">
                  <a>Assignment</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default StudentSideBar;