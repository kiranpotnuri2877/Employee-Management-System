import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from './components/EmployeeForm';
// import other components as needed...

// Define API URL using EC2 Public IP
const API_BASE_URL = 'http://3.110.208.105:5000';

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // 1. Fetch Employees on Load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/employees`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  // 2. Delete Employee
  const handleDeleteEmployee = (id) => {
    axios.delete(`${API_BASE_URL}/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(emp => emp.id !== id));
      })
      .catch(error => console.error('Error deleting employee:', error));
  };

  // ... rest of your App.js functions
