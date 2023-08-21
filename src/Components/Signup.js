import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const SignUpComponent = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hobbies, setHobbies] = useState("");
    const [role, setRole] = useState("")
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const hobbyOptions = [
        "Reading",
        "Painting",
        "Sports",
        "Cooking",
        "Music",
        // Add more options as needed
    ];


    const validateForm = () => {
        const errors = {};

        if (email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,20})/;
        const isPasswordValid = passwordRegex.test(password);

        if (password.trim() === '') {
            errors.password = 'Password is required';
        } else if (!isPasswordValid) {
            errors.password = 'Password should be 8 to 20 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.';
        }


        if (firstName.trim() === '') {
            errors.firstName = 'First Name is required';
        }

        if (lastName.trim() === '') {
            errors.lastName = 'Last Name is required';
        }

        if (role.trim() === '') {
            errors.role = 'Role is required';
        }

        if (gender.trim() === '') {
            errors.gender = 'Gender is required';
        }

        if (hobbies.trim() === '') {
            errors.hobbies = 'Hobbies is required';
        }

        if (Object.keys(errors).length === 0) {
            setErrors({}); // Clear the error message
            return true;
        } else {
            setErrors(errors);
            return false;
        }
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        if (errors.firstName) {
            validateForm(); // Re-validate only if the email had an error
        }
    };

    const handleRoleChange = (event) => {
        const newRole = event.target.value;
        setRole(newRole);

        // Clear the role error when a role is selected
        if (errors.role) {
            setErrors((prevErrors) => ({ ...prevErrors, role: '' }));
        }
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        if (errors.lastName) {
            validateForm(); // Re-validate only if the email had an error
        }
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
        if (errors.gender) {
            setErrors((prevErrors) => ({ ...prevErrors, gender: '' }));
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (errors.email) {
            validateForm(); // Re-validate only if the email had an error
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        if (errors.password) {
            validateForm(); // Re-validate only if the email had an error
        }
    };

    const handleHobbiesChange = (event) => {
        setHobbies(event.target.value);
        if (errors.hobbies) {
            validateForm(); // Re-validate only if the email had an error
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            gender: gender,
            hobbies: hobbies
        }
        try {
            if (validateForm()) {
                if (role === "employee") {
                    const resp = await axios.post('http://localhost:4000/employee/signup', data)
                    if (resp.status === 201) {
                        localStorage.setItem("token", resp.data.token)
                        navigate('/employee/dashboard', { state: { employeeid: resp.data.employeeId } })
                    }
                } else {
                    const resp = await axios.post('http://localhost:4000/manager/signup', data)
                    if (resp.status === 201) {
                        localStorage.setItem("token", resp.data.token)
                        navigate('/manager/dashboard')
                    }
                }

            }

        }

        catch (error) {
            setError(error?.response?.data?.message)
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center ">
            <Form onSubmit={handleSubmit} className="w-50 p-4 bg-light rounded">
                {error && <Alert variant="danger">{error}</Alert>}
                <h2 className="mb-4">Sign Up</h2>
                <Form.Group controlId="formBasicFirstName">
                    <Form.Label>First Name*</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={handleFirstNameChange}
                    />
                    <Form.Label> {errors.firstName && <p className="text-danger">{errors.firstName}</p>} </Form.Label>

                </Form.Group>

                <Form.Group controlId="formBasicLastName">
                    <Form.Label>Last Name*</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={handleLastNameChange}
                    />
                    <Form.Label> {errors.lastName && <p className="text-danger">{errors.lastName}</p>} </Form.Label>

                </Form.Group>

                <Form.Group>
                    <Form.Label>Gender*</Form.Label>
                    <div className='d-flex'>
                        <Form.Check
                            type="radio"
                            label="Male"
                            name="gender"
                            value="male"
                            onChange={handleGenderChange}
                            checked={gender === 'male'}

                        />
                        <Form.Check
                            type="radio"
                            label="Female"
                            name="gender"
                            value="female"
                            onChange={handleGenderChange}
                            checked={gender === 'female'}
                            style={{ marginLeft: "15px" }}
                        />
                        <Form.Check
                            type="radio"
                            label="Other"
                            name="gender"
                            value="other"
                            onChange={handleGenderChange}
                            checked={gender === 'other'}
                            style={{ marginLeft: "15px" }}
                        />
                    </div>
                    <Form.Label> {errors.gender && <p className="text-danger">{errors.gender}</p>} </Form.Label>

                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address*</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <Form.Label> {errors.email && <p className="text-danger">{errors.email}</p>} </Form.Label>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password*</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Form.Label>     {errors.password && <p className="text-danger">{errors.password}</p>} </Form.Label>
                </Form.Group>

                <Form.Group controlId="formBasicHobbies">
                    <Form.Label>Hobbies*</Form.Label>
                    <div>
                        <Form.Control
                            as="select"
                            value={hobbies}
                            onChange={handleHobbiesChange}
                        >
                            <option value="">Select a hobby</option>
                            {hobbyOptions.map((hobby, index) => (
                                <option key={index} value={hobby}>
                                    {hobby}
                                </option>
                            ))}
                        </Form.Control>
                    </div>
                    <Form.Label>{errors.hobbies && <p className="text-danger">{errors.hobbies}</p>}</Form.Label>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Role*</Form.Label>
                    <div className='d-flex'>
                        <Form.Check
                            type="radio"
                            label="Employee"
                            name="role"
                            value="employee"
                            onChange={handleRoleChange}
                            checked={role === 'employee'}

                        />
                        <Form.Check
                            type="radio"
                            label="Manager"
                            name="role"
                            value="manager"
                            onChange={handleRoleChange}
                            checked={role === 'manager'}
                            style={{ marginLeft: "15px" }}
                        />

                    </div>
                    <Form.Label>     {errors.role && <p className="text-danger">{errors.role}</p>} </Form.Label>
                </Form.Group>

                <Button variant="primary" type="submit" className='mt-4'>
                    Sign Up
                </Button>

                <div className="mt-3">
                    Already have an account? <Link to="/">Sign In</Link>
                </div>
            </Form>
        </div>
    );
};

export default SignUpComponent;
