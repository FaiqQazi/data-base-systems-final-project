import React, { useEffect, useState, useContext } from 'react';
import { idcontext } from '../Idprovider';
import axios from 'axios';
import './Sidebar.css';
import TeacherSideBar from './TeacherSideBar';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

const Assignmentschecking = () => {
    const [pdfList, setPdfList] = useState([]);
    const[AssignmentID,setAssignmentID]=useContext(idcontext)
    useEffect(() => {
        axios
          .get(`http://localhost:8000/pdf-listgetass?AssignmentID=${AssignmentID}`)
          .then((response) => {
            setPdfList(response.data);
          })
          .catch((error) => {
            console.error('Error fetching PDF list:', error);
          });
      }, [pdfList]);
      const viewPdf = (SubmissionID) => {
        axios
          .get(`http://localhost:8000/pdfgetass/${SubmissionID}`, { responseType: 'arraybuffer' })
          .then((response) => {
            console.log(response.data)
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, '_blank');
          })
          .catch((error) => {
            console.error('Error fetching PDF:', error);
          });
      };
  return (
  <>
  <Header/>
  <TeacherSideBar/>
  <h1 className='heading'>Assigments recieved</h1>
  <div className="pdf-list-container">
        <h1 className='h1'>Uploaded Content</h1>
        <hr/>
        <ul className="pdf-list">
          {pdfList.map((pdf) => (
            <li key={pdf.id} className="pdf-list-item" onClick={() => viewPdf(pdf.SubmissionID)}>
              <div className="pdf-info">
                <div className='date'>
                  Uploaded on: {pdf.date_of_submission ? new Date(pdf.date_of_submission).toLocaleString() : 'Date Not Available'}
                </div>
                <div>
                   {pdf.SubmissionID}
                   </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
  </>
  )
}

export default Assignmentschecking
