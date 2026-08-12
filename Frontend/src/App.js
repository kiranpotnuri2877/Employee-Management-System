import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from './EmployeeForm'; // Fix: Removed ./components/

const API_BASE_URL = 'http://3.110.208.105:5000';

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch all employees on mount
  const fetchEmployees = () => {
    axios.get(`${API_BASE_URL}/employees`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle Add Employee
  const handleAddEmployee = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  // Handle Update Employee
  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
  };

  // Handle Delete Employee
  const handleDeleteEmployee = (id) => {
    axios.delete(`${API_BASE_URL}/employees/${id}`)
      .then(() => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      })
      .catch(error => console.error('Error deleting employee:', error));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Employee Management System</h1>
      <div className="row">
        <div className="col-md-5">
          <EmployeeForm
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            selectedEmployee={selectedEmployee}
            onClearSelection={() => setSelectedEmployee(null)}
          />
        </div>
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Employee List</h2>
              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.position}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => setSelectedEmployee(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteEmployee(emp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
