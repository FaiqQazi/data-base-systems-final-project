import React from 'react'
import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import TeacherSideBar from './TeacherSideBar';
import Header from '../Header';
import Coursecard from './Cards';
import './Sidebar.css'
import { useNavigate } from 'react-router-dom';
const Teacher = () => {
  const { name } = useContext(idcontext);
  const navigate = useNavigate();
    const { tid,settid } = useContext(idcontext);
    const{courseid,setcourseid}=useContext(idcontext);
    const{setcoursename}=useContext(idcontext);
    const [coursesData, setCoursesData] = useState([]);
    const { classid, setclassid } = useContext(idcontext);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('http://localhost:8000/teacheratt', { tid });
          setCoursesData(response.data.courses); // Log the state inside useEffect
        } catch (error) {
          console.error('Error fetching data from the backend:', error);
        }
      };
  
      fetchData();
      console.log('CoursesData:', coursesData);
    }, [tid]); // Make sure to include tid in the dependency array if it's used in the fetchData function
  
    const handleCourseClick = (courseId, ClassID) => {
      setcourseid(courseId);
      setclassid(ClassID);
      navigate("/teacher/coursereview");
      // You can perform additional actions based on the clicked course ID
    };
  return (
    <>
    <Header/>
    <TeacherSideBar/>
    <h1 className='heading'>DashBoard</h1>
     <h2 className='name'>Welcome {name}   </h2>
     <h1 className='subheading'>Course Enrolled</h1>
     <hr/>
     <div className="courses-container">
      {coursesData.map(
        (course) =>
          course && (
            <Coursecard
              key={course.CourseID}
              id={course.CourseID}
              ClassID={course.ClassID}
              name={course.CourseName}
              description={course.CourseDesc}
              onClick={() => handleCourseClick(course.CourseID, course.ClassID)}
            />
          )
      )}
    </div>
    </>
  )
}

export default Teacher
