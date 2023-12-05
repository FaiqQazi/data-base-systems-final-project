import React, { createContext, useState } from 'react';

export const idcontext = createContext(null);

const IdContextProvider = ({ children }) => {
  const [stid, setstid] = useState("");
  const [tid, settid] = useState("");
  const [courseid, setcourseid] = useState("");
  const [coursename, setcoursename] = useState("");
  const[classid,setclassid]=useState("")
  const[name,setname]=useState("")
  const[AssignmentID,setAssignmentID]=useState("")
  return (
    <idcontext.Provider value={{ stid, setstid, tid, settid,courseid, setcourseid,coursename, setcoursename,classid,setclassid,name,setname,AssignmentID,setAssignmentID }}>
      {children}
    </idcontext.Provider>
  );
};

export default IdContextProvider;
