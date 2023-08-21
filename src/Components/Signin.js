import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignInComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validateForm = () => {
    const errors = {};

    if (email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (password.trim() === '') {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length === 0) {
      setErrors({}); // Clear the error message
      return true;
    } else {
      setErrors(errors);
      return false;
    }
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (errors.email) {
      validateForm(); // Re-validate only if the email had an error
    }
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (errors.password) {
      validateForm(); // Re-validate only if the email had an error
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email,
      password
    }
    try {
      if (validateForm()) {
        const resp = await axios.post('http://localhost:4000/login', data)
        if (resp.status === 200) {
          if (resp?.data?.role === "employee") {
            localStorage.setItem("token", resp.data.token)
            navigate('/employee/dashboard', { state: { employeeid: resp.data.employeeId } });
          }
          else {
            localStorage.setItem("token", resp.data.token)
            navigate('/manager/dashboard');
          }
        }
        else {
          setError('invalid email or password')
        }
      }
    }
    catch (error) {
      setError(error?.response?.data?.message)
    }

  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">

      <Form onSubmit={handleSubmit} className="w-50 p-4 bg-light rounded">
        {error && <Alert variant="danger">{error}</Alert>}
        <h2 className="mb-4">Sign In</h2>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleEmailChange}
          />
          <Form.Label>{errors.email && <p className="text-danger">{errors.email}</p>} </Form.Label>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Form.Label>  {errors.password && <p className="text-danger">{errors.password}</p>} </Form.Label>
        </Form.Group>
        <Button variant="primary" type="submit" className='mt-4'>
          Sign In
        </Button>
        <div className="mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Form>
    </div>
  );
};

export default SignInComponent;
