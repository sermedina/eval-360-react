import { useState, useEffect } from 'react';
import { Employee } from '../types';
import { fetchEmployees, saveEmployee, deleteEmployee } from '../services/employeeService';

export function useEmployees () {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .catch(() => setError('Error al cargar empleados'));
  }, []);

  const addEmployee = async (newEmployee: Employee) => {
    try {
      const updatedEmployees = await saveEmployee(employees, newEmployee);
      setEmployees(updatedEmployees);
      setError('');
    } catch {
      setError('Error al guardar el empleado');
    }
  };

  const removeEmployee = async (id: number) => {
    try {
      const updatedEmployees = await deleteEmployee(id, employees);
      if (updatedEmployees) {
        setEmployees(updatedEmployees);
        setError('');
      } else {
        setError('Error al eliminar el empleado');
      }
    } catch (error) {
      console.error(error);
      setError('Error al eliminar el empleado');
    }
  };

  return { employees, error, addEmployee, removeEmployee, setError };
};
