import React, { useState } from 'react';
import { User, Shield, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
// import usenavigate from 'react-router-dom'
export default function LoginPage() {
  const [userType, setUserType] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    id: '',
    password: ''
  });
  const url = 'http://localhost:3000'

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };
  // const navigate = usenavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    // Static UI - no backend functionality
    console.log('Login attempt:', { userType, ...credentials });
    // alert(`${userType === 'employee' ? 'Employee' : 'HR'} login attempted with ID: ${credentials.id}`);
    if (userType === 'employee') {
      const newUrl = url + '/api/emp/login';

      axios.post(newUrl,  credentials )
        .then((response) => {
          console.log("Logged in successfully!", response.data);
          // you can also do other actions here, e.g., redirect
        })
        .catch((error) => {
          console.error("Login failed:", error.response ? error.response.data : error.message);
        });
    }
    else if (userType === 'hr') {
      const newurl = url + '/api/hr/login'
      axios.post(newUrl, credentials)
        .then((response) => {
          console.log("Logged in successfully!", response.data);
          // you can also do other actions here, e.g., redirect
        })
        .catch((error) => {
          console.error("Login failed:", error.response ? error.response.data : error.message);
        });
    }

  };

  return (

    <>
      <Navbar />
      <div className="app">
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/emp_dashboard' element={<Login />}></Route>
          <Route path='/hr_dashboard' element={<Login />}></Route>
         

        </Routes>
      </div>
    </>

  )
}

export default App;