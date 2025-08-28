import React from "react";
import "./App.css";
import { Route, Routes } from 'react-router-dom'
import Login from './screens/Login'
import Employee from './screens/Employee'
import HR from './screens/HR'

const App = () => {

  return (

    <>
      
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