import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';
import { useContext} from 'react';
import { idcontext } from './Idprovider';
export default function Login() {

    const { setstid } = useContext(idcontext);
    const { tid,settid } = useContext(idcontext);
    const { setname } = useContext(idcontext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
       if(userType==='student'){
        try {
            const response = await axios.post('http://localhost:8000/loginst', {
                email: email,
                password: password,
            });

            // Handle the response, e.g., set authentication token or navigate to the next page
            console.log(response.data);
            setstid(response.data.user.id);
            setname(response.data.user.name)
            // Example: navigate to the dashboard after successful login
            navigate('/student');
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error('Login failed:', error.message);
        }
       }
       else{
        try {
            const response = await axios.post('http://localhost:8000/loginte', {
                email: email,
                password: password,
            });

            // Handle the response, e.g., set authentication token or navigate to the next page
            console.log(response.data);
            settid(response.data.user.id);
            setname(response.data.user.name)
            // Example: navigate to the dashboard after successful login
            console.log(tid)
            navigate('/teacher');
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error('Login failed:', error.message);
        }
       }
    };

    return (
        <>
            <div className='main'>
                <div className="register-container1">
                    <div><p>Login form</p></div>
                    <hr className='hr'/>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="input-field"
                        />
                        <select value={userType} onChange={handleUserTypeChange} className="input-field">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>

                        <button type="submit" className="submit-button">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}


