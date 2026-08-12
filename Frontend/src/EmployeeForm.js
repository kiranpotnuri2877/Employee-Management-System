import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Defined API Base URL
const API_BASE_URL = 'http://3.110.208.105:5000';

const EmployeeForm = ({ onAddEmployee, onUpdateEmployee, selectedEmployee, onClearSelection }) => {
  const [employee, setEmployee] = useState({ name: '', position: '' });

  useEffect(() => {
    if (selectedEmployee) {
      setEmployee({ name: selectedEmployee.name, position: selectedEmployee.position });
    } else {
      setEmployee({ name: '', position: '' });
    }
  }, [selectedEmployee]);

  const handleInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const addOrUpdateEmployee = () => {
    if (selectedEmployee) {
      axios.put(`${API_BASE_URL}/employees/${selectedEmployee.id}`, employee)
        .then(response => {
          onUpdateEmployee(response.data);
          onClearSelection();
        })
        .catch(error => console.error(error));
    } else {
      axios.post(`${API_BASE_URL}/employees`, employee)
        .then(response => {
          onAddEmployee(response.data);
          setEmployee({ name: '', position: '' });
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input type="text" id="name" className="form-control" name="name" value={employee.name} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="position" className="form-label">Position:</label>
            <input type="text" id="position" className="form-control" name="position" value={employee.position} onChange={handleInputChange} />
          </div>
          <button type="button" className={`btn ${selectedEmployee ? 'btn-warning' : 'btn-primary'}`} onClick={addOrUpdateEmployee}>
            {selectedEmployee ? 'Update Employee' : 'Add Employee'}
          </button>
          {selectedEmployee && (
            <button type="button" className="btn btn-secondary ms-2" onClick={onClearSelection}>Cancel</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
