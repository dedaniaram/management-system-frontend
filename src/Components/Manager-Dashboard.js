import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AddManger from './Manage-Departments';
import './datatable.scss'
import DepModal from './Department-Modal';

const ManagerDashboard = () => {
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [depShow, setDepshow] = useState(false)
    const [editingData, setEditingData] = useState(null);
    const [deleteId, setDeleteId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [nextVal, setnext] = useState(false)
    const navigate = useNavigate()
    let token = localStorage.getItem("token")


    const handleRowClick = (row) => {
        setSelectedRow(row);
        setDepshow(true);
    };

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const handledepshow = () => {
        setDepshow(false)
    }
    useEffect(() => {
        if (deleteId) {
            axios.delete(`http://localhost:4000/manager/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    getdata(currentPage)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [deleteId])


    const getdata = (page) => {
        axios
            .get(`http://localhost:4000/manager/read/${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setData(response.data);
                if (response.data.length >= 5) {
                    setnext(false)
                }
                else {
                    setnext(true)
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };


    const columns = [
        {
            name: 'Id',
            selector: 'id',
            sortable: true,
        },
        {
            name: 'Department Name',
            selector: 'department_name',
            sortable: true,
        },
        {
            name: 'Category Name',
            selector: 'category_name',
            sortable: true,
        },
        {
            name: 'Location',
            selector: 'location',
            sortable: true,
        },
        {
            name: 'Salary',
            selector: 'salary',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <Button onClick={() => handleEdit(row)}>Edit</Button>
                    <Button style={{ marginLeft: "5px", backgroundColor: "red", border: 'red' }} onClick={() => handleDelete(row)}>Delete</Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        if (token) {
            getdata(currentPage);
        }
    }, [token, currentPage]);

    const handleEdit = (row) => {
        setEditingData(row);
        setModalShow(true);
    };

    const handleDelete = (row) => {
        setDeleteId(row.id)
    }

    const handleShow = () => {
        setModalShow(false)
        setEditingData("")
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleLogout = () => {
        // Clear any user-related data or tokens from local storage
        localStorage.removeItem('token'); // Assuming you're using a token for authentication
        navigate('/'); // Redirect to the home page
    };

    return (
        <div className='container'>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginTop: '20px' }}>
                <h1>{`Welcome`}</h1>
                <p>Click on department name to assign employees</p>
                <div>
                    <Button onClick={() => setModalShow(true)}>Add department</Button>
                    <Button variant="danger" onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</Button>
                </div>
            </div>
            <div className="datatable-container">
                <DataTable
                    title="Departments"
                    columns={columns}
                    data={data}
                    striped
                    onRowClicked={handleRowClick}
                />
            </div>
            <>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', alignItems: "center" }}>
                    <Button onClick={handlePreviousPage}>Previous</Button>
                    <p style={{ margin: '0 10px', fontWeight: 'bold' }}>Page: {currentPage}</p>
                    <Button style={{ marginLeft: '10px' }} onClick={handleNextPage} disabled={nextVal}>Next</Button>
                </div>
            </>
            {
                modalShow && <AddManger handleShow={handleShow} modalShow={modalShow} token={token} editingData={editingData} getdata={(currentPage) => getdata(currentPage)} currentPage={currentPage} />
            }
            {selectedRow && depShow && <DepModal handleShow={handledepshow} modalShow={depShow} token={token} selectedRow={selectedRow} />}
        </div>
    );
};

export default ManagerDashboard;
