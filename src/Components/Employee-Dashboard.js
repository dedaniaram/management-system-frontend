import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card } from 'react-bootstrap';

const EmpDashboard = () => {
  let token = localStorage.getItem("token")
  const location = useLocation();
  const { employeeid } = location?.state;
  const [employeeData, setEmployeeData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);
  let navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    axios
      .get(`http://localhost:4000/employee/dashboard/${employeeid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setEmployeeData(resp.data.employee); // Set the employee data in the state
        setDepartmentData(resp.data.department); // Set the employee data in the state
      })
      .catch((error) => {
      });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="container">
      <div className="d-flex justify-between" style={{ justifyContent: "space-between", marginBottom: "20px", marginTop: "20px" }}>
        <h1>Welcome to Employee Dashboard</h1>
        <Button variant="danger" onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</Button>
      </div>
      {employeeData ? (
        <Card>
          <Card.Body>
            <Card.Title>Employee Details:</Card.Title>
            <Card.Text>First Name: {employeeData.first_name}</Card.Text>
            <Card.Text>Last Name: {employeeData.last_name}</Card.Text>
            <Card.Text>Gender: {employeeData.gender}</Card.Text>
            <Card.Text>Hobbies: {employeeData.hobbies}</Card.Text>
          </Card.Body>
        </Card>
      ) : <p>No records to display</p>}
      <br />
      {departmentData ? (
        <Card>
          <Card.Body>
            <Card.Title>Employee Department Details:</Card.Title>
            <Card.Text>Department: {departmentData.department_name}</Card.Text>
            <Card.Text>Category: {departmentData.category_name}</Card.Text>
            <Card.Text>Salary: {departmentData.salary}</Card.Text>
            <Card.Text>Location: {departmentData.location}</Card.Text>
          </Card.Body>
        </Card>
      ) : <p>No records to display</p>}
    </div>
  );
};

export default EmpDashboard;
