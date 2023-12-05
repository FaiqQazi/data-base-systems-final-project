import React from 'react'
import Header from '../Header'
import StudentSideBar from './StudentSideBar'
import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
const Attendencedetails = () => {
    const { stid, settid } = useContext(idcontext);
    const { classid, setclassid } = useContext(idcontext);
    const{courseid,setcourseid}=useContext(idcontext);
    const [coursesData, setCoursesData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post('http://localhost:8000/Student/attendencereview', { stid,courseid,classid });
            setCoursesData(response.data.attendance);
          } catch (error) {
            console.error('Error fetching data from the backend:', error);
          }
        };
    
        fetchData();
      }, [stid]);
  return (
   <>
   <Header/>
   <StudentSideBar/>
   <h1 className='heading'>Attendence Details</h1>
   <hr/>
   <div className="courses-container3">
      {coursesData.map((course, index) => (
        <div className="course-item" key={index}>
          {/* Extract date part only using toLocaleDateString() */}
          <p className={course.is_present =="P"? 'present' : 'not-present'}>
            {course.is_present === 'P' ? 'Present' : 'Not Present'} | {new Date(course.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
   </>
  )
}

export default Attendencedetails
