import React from 'react'
import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import Header from '../Header';
import StudentSideBar from './StudentSideBar';
import { useNavigate } from 'react-router-dom';
import StudentCoursecard from './StudentCard';
const Student = () => {
    const { stid} = useContext(idcontext);
    const { name} = useContext(idcontext);
  const navigate = useNavigate();
    const{setcourseid}=useContext(idcontext);
    const{setcoursename}=useContext(idcontext);
    const [coursesData, setCoursesData] = useState([]);
    const {setclassid } = useContext(idcontext);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('http://localhost:8000/Student', { stid });
          setCoursesData(response.data.courses); // Log the state inside useEffect
        } catch (error) {
          console.error('Error fetching data from the backend:', error);
        }
      };
  
      fetchData();
      console.log('CoursesData:', coursesData);
    }, [stid]); // Make sure to include tid in the dependency array if it's used in the fetchData function
  
    const handleCourseClick = (courseId, ClassID) => {
      setcourseid(courseId);
      setclassid(ClassID);
      navigate("/Student/review");
      // You can perform additional actions based on the clicked course ID
    };
  return (
    <>

    <Header/>
    <StudentSideBar/>
    <h1 className='heading'>Dashboard</h1>
    <h1 className='name'>Welcome {name}</h1>
    <h1 className='subheading'>Course Enrolled</h1>
    <hr/>
    <div className="courses-container">
      {coursesData.map(
        (course) =>
          course && (
            <StudentCoursecard
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

export default Student
