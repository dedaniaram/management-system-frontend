import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

const DepModal = (props) => {
  const { modalShow, handleShow, selectedRow, token } = props;
  const [data, setData] = useState([]);
  const [assigned, setAssigned] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/manager/employees/no-department`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => setData(resp.data.employees));
  }, []);

  useEffect(() => {
    let departmentId = selectedRow.id;
    axios
      .get(`http://localhost:4000/manager/assigned/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => setAssigned(resp.data.employees));
  }, []);

  const handleCheckboxChange = (employeeId) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleAssign = () => {
    const data = {
      departmentId: selectedRow?.id,
      employeeId: selectedEmployees
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.post('http://localhost:4000/manager/assign', data, config).then(resp => handleShow())
  }

  return (
    <>
      <Modal
        show={modalShow}
        onHide={handleShow}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedRow?.department_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Assigned Employees:</p>
          <div>
            {assigned?.map((item) => (
              <div>
                <label>{item.first_name}{item.last_name}</label>
              </div>
            ))}
          </div>
          <br />
          <p>Select employees to assign:</p>
          <div>
            {data?.map((item) => (
              <div key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(item.id)}
                    checked={selectedEmployees?.includes(item.id)}
                  />
                  {item.first_name} {item.last_name}
                </label>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAssign}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DepModal;
