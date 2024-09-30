
import { API_KEY, API_EMPLOYEE_URL } from '../config/config';
import { Employee } from '../types';
import crypto from 'crypto-js';
export const fetchEmployees = async () => {
    try {
        const response = await fetch(API_EMPLOYEE_URL, {
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching employees');
        }

        const data = await response.json();
        return data.record;
    } catch (error) {
        console.error(error);
    }

}

export const saveEmployee = async (employees: Employee[], newEmployee: Employee) => {
    const hashedPassword = crypto.SHA256(newEmployee.password).toString();
    
    const response = await fetch(API_EMPLOYEE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify([
        ...employees,
        { ...newEmployee, id: employees.length + 1, password: hashedPassword },
      ]),
    });
  
    if (!response.ok) {
      throw new Error('Error al guardar el empleado');
    }
    
    const updatedEmployees = await response.json();
    return updatedEmployees.record; // Ajusta según la estructura de tu respuesta
  };


  export const deleteEmployee = async (id: number, employees: Employee[]) => {
    const updatedEmployees = employees.filter(employee => employee.id !== id);

    try {
      const response = await fetch(API_EMPLOYEE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(updatedEmployees),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el empleado en jsonbin.io');
      }

      return updatedEmployees;
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };