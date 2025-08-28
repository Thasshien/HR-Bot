import React from "react";
import "./App.css";
import { Route, Routes } from 'react-router-dom'
import Login from './screens/Login'

const App = () => {

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