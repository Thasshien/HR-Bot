import React from "react";
import "./App.css";
import { Route, Routes } from 'react-router-dom'
import Login from './screens/Login'
import Employee from './screens/Employee'
import HR from './screens/HR'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  return (

    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="app">
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/emp_dashboard' element={<Employee />}></Route>
          <Route path='/hr_dashboard' element={<HR />}></Route>
        </Routes>
      </div>
    </>

  )
}

export default App;