import React from "react";
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Signin from "./Components/Signin";
import SignUpComponent from "./Components/Signup";
import EmployeeDashboard from './Components/Employee-Dashboard'
import ManagerDashboard from './Components/Manager-Dashboard'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Signin />} />
          <Route exact path="/signup" element={<SignUpComponent />} />
          <Route exact path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route exact path="/manager/dashboard" element={<ManagerDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
