const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON in the request body
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for handling file buffers
const upload = multer({ storage: storage });
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Student@123",
    database: "lms"
});
//login student

app.post('/loginst', (req, res) => {
    const { email, password } = req.body;

    // Find the user in the sample data
    const query = 'SELECT StudentID,FirstName FROM student WHERE email=? AND password=?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            // Assuming the query returns an array of results
            const user = results[0];

            if (user) {
                // Extract only the necessary data from the user object
                const responseData = { message: 'Login successful', user: { email: email, id: user.StudentID,name:user.FirstName } };
                
                // Send the extracted data in the response
                res.json(responseData);
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
    });
});

//login teacher

app.post('/loginte', (req, res) => {
    const { email, password } = req.body;

    // Find the user in the sample data
    const query = 'SELECT InstructorID,FirstName FROM instructor WHERE email=? AND password=?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            // Assuming the query returns an array of results
            const user = results[0];

            if (user) {
                // Extract only the necessary data from the user object
                const responseData = { message: 'Login successful', user: { email: email, id: user.InstructorID,name:user.FirstName } };
                
                // Send the extracted data in the response
                res.json(responseData);
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
    });
});


//for the viewing of courses for now this has no function as i have used the attendence one 


app.post('/teacherco', async (req, res) => {
    const teacherId = req.body.tid; // Assuming stid is the correct key in req.body
    try {
        // First query to get course IDs
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT CourseID FROM class_course WHERE InstructorID=?", [teacherId], (err, results) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Extracting course IDs without using map
        const courseIds = results.map(result => result.CourseID);

        // Second query to get course details
        const courses = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM courses WHERE CourseID IN (?)", [courseIds], (err, courses) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                } else {
                    resolve(courses);
                }
            });
        });

        res.json({ courses });
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
//app listen
app.listen(8000, () => {
    console.log("Server is running on port 8000");
})

//for  pdf upload
app.post('/upload', upload.single('file'), (req, res) => {
    try {
      const course_id = req.body.course_id;
      const class_id=req.body.class_id;
      const fileBuffer = req.file.buffer; // Ensure that req.file is defined
      const formName = req.body.formName;
      const date = req.body.date;
  
      // Save the fileBuffer, formName, and formType to MySQL
      const sql = 'INSERT INTO contents (course_id, file_data, file_name, date,class_id) VALUES (?, ?, ?, ?,?)';
      db.query(sql, [course_id, fileBuffer, formName, date,class_id], (err, result) => {
        if (err) {
          console.error('Error inserting file data into MySQL:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ message: 'File uploaded successfully' });
        }
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  //for pdf viewing
  
  app.get('/pdf-list', (req, res) => {
    const courseId = req.query.courseid;
    const classId=req.query.classid;
    const sql = 'SELECT file_id, file_name,date FROM contents WHERE course_id=(?) and class_id=(?)';
    db.query(sql, [courseId,classId], (err, result) => {
      if (err) {
        console.error('Error retrieving PDF list from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  });
  
  app.get('/pdf/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    console.log('File ID:', fileId);
  
    const sql = 'SELECT file_data FROM contents WHERE file_id = ?';
    db.query(sql, [fileId], (err, result) => {
      if (err) {
        console.error('Error retrieving PDF from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (result.length > 0) {
          const fileBuffer = result[0].file_data;
  
          // Log the length of the file buffer and the first 10 bytes
          console.log('File Buffer Length:', fileBuffer.length);
          console.log('First 10 bytes of File Buffer:', fileBuffer.slice(0, 10).toString('hex'));
  
          // Send the PDF content as a buffer
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${fileId}.pdf"`);
          res.send(fileBuffer);
        } else {
          res.status(404).json({ error: 'PDF not found' });
        }
      }
    });
  });



  
  //for attendence
  //showing the classes the attendnec can be took
  app.post('/teacheratt', async (req, res) => {
    const teacherId = req.body.tid;
    try {
        // First query to get course IDs
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT CourseID,ClassID FROM class_course WHERE InstructorID=?", [teacherId], (err, results) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Extracting course IDs without using map
        const courseIds = results.map(result => ({ CourseID: result.CourseID, ClassID: result.ClassID }));

// Extracting CourseID and ClassID arrays
const courseIdsArray = courseIds.map(item => item.CourseID);
const classIdsArray = courseIds.map(item => item.ClassID);
// Second query to get course details
const courses = await new Promise((resolve, reject) => {
    db.query(
        "SELECT * FROM courses c JOIN class_course cc ON c.CourseID=cc.CourseID WHERE cc.CourseID IN (?) AND cc.ClassID IN (?)",
        [courseIdsArray, classIdsArray],
        (err, courses) => {
            if (err) {
                console.error('Database query error:', err.message);
                reject(err);
            } else {
                resolve(courses);
            }
        }
    );
   });

        res.json({ courses });
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//taking attendence
// and then saving that attendence

app.post('/takeatt', async (req, res) => {
  try {
    const courseid = req.body.courseid;
    const classid = req.body.classid;
    console.log(courseid);
    console.log(classid);

    // Assuming db.query returns a promise
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT s.StudentID, s.FirstName FROM student s JOIN enrollment e ON s.StudentID = e.StudentID JOIN class_course c ON e.ClassID = c.ClassID WHERE CourseID = (?) AND c.ClassID = (?)",
        [courseid, classid],
        (err, result) => {
          if (err) {
            console.error('Database query error:', err.message);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Extracting the list of students from the database query result
    const students = result.map((student) => ({
      studentID: student.StudentID,
      firstName: student.FirstName,
    }));

    // Sending the list of students to the frontend
    res.json({ success: true, students });
    console.log(students);
  } catch (error) {
    console.error('Error fetching student list:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.post('/saveattendance', async (req, res) => {
  try {
    const { attendanceData } = req.body;

    // Assuming you have a table named 'attendance' in your database
    // with columns: studentID, courseID, classID, date, isPresent

    // Loop through the attendanceData and insert/update records in the database
    for (const data of attendanceData) {
      const { studentId, courseid, classid, date, ispresent } = data;

      // Check if a record already exists for the student, course, class, and date
      const existingRecord =db.query(
        'SELECT * FROM attendence WHERE student_id = ? AND course_id = ? AND class_id= ? AND date = ?',
        [studentId, courseid, classid, date]
      );

      if (existingRecord.length > 0) {
        // If a record exists, update it
        db.query(
          'UPDATE attendence SET isPresent = ? WHERE student_id= ? AND course_id = ? AND class_id = ? AND date = ?',
          [ispresent, studentId, courseid, classid, date]
        );
      } else {
        // If a record doesn't exist, insert a new one
        db.query(
          'INSERT INTO attendence (student_id, course_id, class_id, date, is_present) VALUES (?, ?, ?, ?, ?)',
          [studentId, courseid, classid, date, ispresent]
        );
      }
    }

    res.json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendence:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//Assignment upload

app.post('/uploadass', upload.single('file'), (req, res) => {
  try {
    const course_id = req.body.course_id;
    const class_id=req.body.class_id;
    const fileBuffer = req.file.buffer; // Ensure that req.file is defined
    const formName = req.body.formName;
    const date = req.body.date;
    const deadline=req.body.deadline;

    // Save the fileBuffer, formName, and formType to MySQL
    const sql = 'INSERT INTO assignment (ClassID,CourseID,file_data,file_name,date,deadline_date) VALUES (?, ?, ?, ?,?,?)';
    db.query(sql, [class_id,course_id, fileBuffer, formName, date,deadline], (err, result) => {
      if (err) {
        console.error('Error inserting file data into MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'File uploaded successfully' });
      }
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assignment view


app.get('/pdf-listass', (req, res) => {
  const courseId = req.query.courseid;
  const classId=req.query.classid;
  const sql = 'SELECT AssignmentID, file_name,date,deadline_date FROM assignment WHERE CourseID=(?) and ClassID=(?)';
  db.query(sql, [courseId,classId], (err, result) => {
    if (err) {
      console.error('Error retrieving PDF list from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/pdfass/:AssignmentID', (req, res) => {
  const fileId = req.params.AssignmentID;
  console.log('File ID:', fileId);

  const sql = 'SELECT file_data FROM assignment WHERE AssignmentID = ?';
  db.query(sql, [fileId], (err, result) => {
    if (err) {
      console.error('Error retrieving PDF from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.length > 0) {
        const fileBuffer = result[0].file_data;

        // Log the length of the file buffer and the first 10 bytes
        console.log('File Buffer Length:', fileBuffer.length);
        console.log('First 10 bytes of File Buffer:', fileBuffer.slice(0, 10).toString('hex'));

        // Send the PDF content as a buffer
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileId}.pdf"`);
        res.send(fileBuffer);
      } else {
        res.status(404).json({ error: 'PDF not found' });
      }
    }
  });
});

// Assignment collection
  //Moiz and Father
app.get('/pdf-listgetass', (req, res) => {
  const AssignmentID = req.query.AssignmentID;
  const sql = 'SELECT SubmissionID FROM assignmentsubmission WHERE AssignmentID =(?)';
  db.query(sql, [AssignmentID], (err, result) => {
    if (err) {
      console.error('Error retrieving PDF list from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/pdfgetass/:SubmissionID', (req, res) => {
  const fileId = req.params.SubmissionID;
  console.log('File ID:', fileId);

  const sql = 'SELECT file_data FROM assignmentsubmission WHERE SubmissionID = ?';
  db.query(sql, [fileId], (err, result) => {
    if (err) {
      console.error('Error retrieving PDF from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.length > 0) {
        const fileBuffer = result[0].file_data;

        // Log the length of the file buffer and the first 10 bytes
        console.log('File Buffer Length:', fileBuffer.length);
        console.log('First 10 bytes of File Buffer:', fileBuffer.slice(0, 10).toString('hex'));

        // Send the PDF content as a buffer
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileId}.pdf"`);
        res.send(fileBuffer);
      } else {
        res.status(404).json({ error: 'PDF not found' });
      }
    }
  });
});

//profile teacher



//Student section
app.post('/Student', async (req, res) => {
  const studentId = req.body.stid;
  try {
      // First query to get course IDs
      const results = await new Promise((resolve, reject) => {
          db.query("SELECT c.CourseID,c.ClassID FROM student s join enrollment e on s.StudentID=e.StudentID join class_course c on c.ClassID=e.ClassID WHERE s.StudentID=?", [studentId], (err, results) => {
              if (err) {
                  console.error('Database query error:', err.message);
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });

      // Extracting course IDs without using map
      const courseIds = results.map(result => ({ CourseID: result.CourseID, ClassID: result.ClassID }));

// Extracting CourseID and ClassID arrays
const courseIdsArray = courseIds.map(item => item.CourseID);
const classIdsArray = courseIds.map(item => item.ClassID);
// Second query to get course details
const courses = await new Promise((resolve, reject) => {
  db.query(
      "SELECT * FROM courses c JOIN class_course cc ON c.CourseID=cc.CourseID WHERE cc.CourseID IN (?) AND cc.ClassID IN (?)",
      [courseIdsArray, classIdsArray],
      (err, courses) => {
          if (err) {
              console.error('Database query error:', err.message);
              reject(err);
          } else {
              resolve(courses);
          }
      }
  );
 });

      res.json({ courses });
  } catch (error) {
      console.error('Internal server error:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

//give assignment
app.post('/submitass', upload.single('file'), (req, res) => {
  try {
    const course_id = req.body.course_id;
    const class_id=req.body.class_id;
    const fileBuffer = req.file.buffer; // Ensure that req.file is defined
    const formName = req.body.formName;
    const date = req.body.date;
    const AssignmentID=req.body.AssignmentID;

    // Save the fileBuffer, formName, and formType to MySQL
    const sql = 'INSERT INTO assignmentsubmission (AssignmentID,class_id,course_id,file_data,file_name,date_of_submission) VALUES (?, ?, ?, ?,?,?)';
    db.query(sql, [AssignmentID,class_id,course_id, fileBuffer, formName, date], (err, result) => {
      if (err) {
        console.error('Error inserting file data into MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'File uploaded successfully' });
      }
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//attendence student
app.post('/Student/attendence', async (req, res) => {
  const studentId = req.body.stid;
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(`
        SELECT
          student_id,
          class_id,
          course_id,
          SUM(CASE WHEN is_present = 'P' THEN 1 ELSE 0 END) AS present_count,
          COUNT(*) AS total_days
        FROM
          attendence
        WHERE
          student_id = ?
        GROUP BY
          student_id,
          class_id,
          course_id
        HAVING
          present_count >= 0
      `, [studentId], (err, results) => {
        if (err) {
          console.error('Database query error:', err.message);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Assuming you want to send the attendance data back to the client
    res.json({ attendance: results });
    console.log(results)
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/Student/attendencereview', async (req, res) => {
  const studentId = req.body.stid;
  const course_id=req.body.courseid
  const class_id=req.body.classid
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('select is_present,date from attendence where class_id=(?) and course_id=(?) and student_id=(?)', [class_id,course_id,studentId], (err, results) => {
        if (err) {
          console.error('Database query error:', err.message);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Assuming you want to send the attendance data back to the client
    res.json({ attendance: results });
    console.log(results)
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});