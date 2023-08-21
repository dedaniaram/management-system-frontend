import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from 'react-bootstrap';
import axios from "axios";

const AddManager = (props) => {
    const { handleShow, modalShow, token, editingData, getdata, currentPage } = props;
    const [dname, setDname] = useState('')
    const [location, setlocation] = useState('')
    const [salary, setSalary] = useState('')
    const [cname, setCname] = useState('')
    const [errors, setErrors] = useState({});
    const [error, setError] = useState()

    const Categoryoptions = [
        "Sales",
        "IT",
        "HR",
        "Product",
        "Marketing",
        // Add more options as needed
    ];

    const DepartmentOptions = [
        "Google",
        "ipangram",
        "Facebook",
        "wipro",
        "wallmart",
        // Add more options as needed
    ];

    const validateForm = () => {
        const errors = {};

        if (dname.trim() === '') {
            errors.dname = 'Department name is required';
        }

        if (cname.trim() === '') {
            errors.cname = 'Category name is required';
        }

        if (location.trim() === '') {
            errors.location = 'Location is required';
        }

        if (salary.trim() === '') {
            errors.salary = 'Salary is required';
        }

        if (Object.keys(errors).length === 0) {
            setErrors({}); // Clear the error message
            return true;
        } else {
            setErrors(errors);
            return false;
        }
    };

    useEffect(() => {
        if (editingData) {
            setCname(editingData.category_name);
            setDname(editingData.department_name);
            setSalary(editingData.salary);
            setlocation(editingData.location);

        }
    }, [editingData]);

    const emptydata = () => {
        setCname('');
        setDname('')
        setSalary('')
        setlocation('')
    }

    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            department_name: dname,
            category_name: cname,
            location: location,
            salary: salary,
            employee_id: ''
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            if (validateForm()) {
                if (editingData) {
                    axios.patch(`http://localhost:4000/manager/update/${editingData?.id}`, data, config).then(
                        (resp) => {
                            if (resp.status === 200) {
                                handleShow()
                                emptydata()
                                getdata(currentPage)
                            }
                        }
                    )
                } else {
                    axios.post('http://localhost:4000/manager/create', data, config).then(
                        (resp) => {
                            if (resp.status === 201) {
                                handleShow()
                                getdata(currentPage)
                            }
                        }
                    )
                }
            }
        }
        catch (error) {
            setError(error?.response?.data?.message)
        }
    }

    const handleDname = (e) => {
        setDname(e.target.value)
        if (errors.dname) {
            validateForm(); // Re-validate only if the email had an error
        }
    }

    const handleCname = (e) => {
        setCname(e.target.value)
        if (errors.cname) {
            validateForm(); // Re-validate only if the email had an error
        }
    }

    const handleSalary = (e) => {
        setSalary(e.target.value)
        if (errors.salary) {
            validateForm(); // Re-validate only if the email had an error
        }
    }
    const handleLocation = (e) => {
        setlocation(e.target.value)
        if (errors.location) {
            validateForm(); // Re-validate only if the email had an error
        }
    }
    return (
        <Modal
            show={modalShow}
            onHide={handleShow}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{error && <Alert variant="danger">{error}</Alert>} </Modal.Title>
                <Modal.Title>{editingData ? "Edit Department" : "Add Department"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Form fields */}
                <div className="mb-3">
                    <label htmlFor="departmentName" className="form-label">Department Name</label>
                    <select
                        value={dname}
                        onChange={handleDname}
                        className="form-control"
                    >
                        <option value="">Select a Department</option>
                        {DepartmentOptions.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    {errors.dname && <p className="text-danger">{errors.dname}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="salary" className="form-label">Salary</label>
                    <input type="number" className="form-control" id="salary" onChange={handleSalary} value={salary} />
                    {errors.salary && <p className="text-danger">{errors.salary}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="location" onChange={handleLocation} value={location} />
                    {errors.location && <p className="text-danger">{errors.location}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                    <select
                        value={cname}
                        onChange={handleCname}
                        className="form-control"
                    >
                        <option value="">Select a category</option>
                        {Categoryoptions.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    {errors.cname && <p className="text-danger">{errors.cname}</p>}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleShow}>Close</Button>
                <Button variant="primary" onClick={handleSave}>{editingData ? "Update" : "Save"}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddManager;
