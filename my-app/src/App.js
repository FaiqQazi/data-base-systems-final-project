// Import necessary libraries and components
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Homepage from './Home'; // Assuming this is the correct path to your Homepage component
import IdContextProvider from './Idprovider';
import Login from './Login';
import Teacher from './Teacher/Teacher';
import Student from './Student/Student';
import ViewCourses from './Teacher/ViewCourses';
import Teachercourseopen from './Teacher/Teachercourseopen';
import Attendence from './Teacher/Attendence';
import Takeattendance from './Teacher/Takeattendence';
import Assignment from './Teacher/Assignment';
import Giveassignment from './Teacher/Giveassignment';
import TeacherProfile from './Teacher/Teacherprofile';
import Assignmentschecking from './Teacher/Assignmentschecking';
import Studentreview from './Student/Studentreview';
import StudentViewCourses from './Student/Stview';
import Stassignment from './Student/Stassignment';
import Stgiveassignment from './Student/Stgiveassignment';
import Studentprofile from './Student/Studentprofile';
import StudentAttendence from './Student/StudentAttendence';
import Attendencedetails from './Student/Attendencedetails';

// Your main App component
const App = () => {
  return (
    <>
    <IdContextProvider>
    <Router>
    <Routes>
    <Route exact path="/login" element={<Login/>} />
      <Route exact path="/" element={<Homepage/>} />

      
      <Route exact path="/student" element={<Student/>} />
      <Route exact path="/Student/review" element={<Studentreview/>} />
      <Route exact path="/Student/view" element={<StudentViewCourses/>} />
      <Route exact path="/Student/assignment" element={<Stassignment/>} />
      <Route exact path="/Student/giveassignment" element={<Stgiveassignment/>} />
      <Route exact path="/Student/profile" element={<Studentprofile/>} />
      <Route exact path="/Student/attendence" element={<StudentAttendence/>} />
      <Route exact path="/Student/viewattendence" element={<Attendencedetails/>} />
  

      <Route exact path="/teacher" element={<Teacher/>} />
      <Route exact path="/teacher/view" element={<ViewCourses/>} />
      <Route exact path="/teacher/coursereview" element={<Teachercourseopen/>} />
      <Route exact path="/teacher/attendence" element={<Attendence/>} />
      <Route exact path="/teacher/takeattendence" element={<Takeattendance/>} />
      <Route exact path="/teacher/assignment" element={<Assignment/>} />
      <Route exact path="/teacher/giveassignment" element={<Giveassignment/>} />
      <Route exact path="/teacher/profile" element={<TeacherProfile/>} />
      <Route exact path="/teacher/assignmentchecking" element={<Assignmentschecking/>} />

    </Routes>
  </Router>
    </IdContextProvider>
    </>
  );
};

export default App;
