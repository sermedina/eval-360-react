import React, { useEffect, useState } from 'react';
import { Card, Button, Table, TableHead, TableBody, TableRow, TableCell, TextInput , Text} from '@tremor/react';
import crypto from 'crypto-js';
import { API_KEY } from '../config/config.ts';
import { API_EMPLOYEE_URL } from '../config/config.ts';

interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
    username: string;
    password: string;
    role: 'admin' | 'employee';
}


const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState<Employee>({ id: 0, name: '', email: '', position: '', username: '', password: '', role: 'employee' });
    const [error, setError] = useState('');


    const fetchEmployees = async () => {
        try {
            const response = await fetch(API_EMPLOYEE_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los empleados');
            }

            const data = await response.json();
            console.log(data);
            setEmployees(data.record || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDeleteEmployee = (id: number) => {
        setEmployees(employees.filter(emp => emp.id !== id));
    };

    const handleCreateEmployee = async () => {
        if (newEmployee && newEmployee.name && newEmployee.email && newEmployee.position) {
            // Guardar el nuevo empleado en jsonbin.io

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

            if (response.ok) {
                const updatedEmployees = await response.json();
                setEmployees(updatedEmployees.record); // Actualizar estado con la nueva lista
                setShowForm(false);
                setNewEmployee({ id: 0, name: '', email: '', position: '', username: '', password: '', role: 'employee' });
                setError('');
            } else {
                setError('Error al guardar el empleado');
            }
        } else {
            setError('Todos los campos son obligatorios');
        }
    };

    const isEmailValid = (email: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const isFormValid = () => {
        return (
            newEmployee.name &&
            newEmployee.email &&
            newEmployee.position &&
            newEmployee.username &&
            newEmployee.password &&
            isEmailValid(newEmployee.email)
        );
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
<Card className="bg-white p-6 rounded-lg shadow-lg w-full">
  <h2 className="text-2xl font-semibold mb-6 text-center">Gestión de Empleados</h2>

  {!showForm && (
    <div>
      <Button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Crear Empleado
      </Button>
    </div>
  )}

  {showForm && (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Crear Nuevo Empleado</h3>

      <div>
        <Text className="block text-sm font-medium mb-2">Nombre</Text>
        <TextInput
          value={newEmployee?.name || ''}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          placeholder="Nombre"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div>
        <Text className="block text-sm font-medium mb-2">Email</Text>
        <TextInput
          value={newEmployee?.email || ''}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          placeholder="Email"
          type="email"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div>
        <Text className="block text-sm font-medium mb-2">Cargo</Text>
        <TextInput
          value={newEmployee?.position || ''}
          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
          placeholder="Cargo"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div>
        <Text className="block text-sm font-medium mb-2">Nombre de usuario</Text>
        <TextInput
          value={newEmployee.username}
          onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
          placeholder="Username"
          required
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div>
        <Text className="block text-sm font-medium mb-2">Contraseña</Text>
        <TextInput
          value={newEmployee.password}
          onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
          placeholder="Contraseña"
          type="password"
          required
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div>
        <Text className="block text-sm font-medium mb-2">Rol</Text>
        <select
          id="role"
          value={newEmployee?.role || 'employee'}
          onChange={(e) => setNewEmployee({ ...newEmployee!, role: e.target.value as 'admin' | 'employee' })}
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="admin">Admin</option>
          <option value="employee">Empleado</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex space-x-4">
        <Button
          onClick={handleCreateEmployee}
          disabled={!isFormValid()}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Guardar
        </Button>
        <Button
          onClick={() => setShowForm(false)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Cancelar
        </Button>
      </div>
    </div>
  )}

  {!showForm && (
    <Table className="min-w-full bg-white rounded-lg shadow overflow-hidden mt-6">
      <TableHead className="bg-gray-100">
        <TableRow>
          <TableCell className="px-4 py-2 font-semibold text-left">Nombre</TableCell>
          <TableCell className="px-4 py-2 font-semibold text-left">Email</TableCell>
          <TableCell className="px-4 py-2 font-semibold text-left">Cargo</TableCell>
          <TableCell className="px-4 py-2 font-semibold text-left">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id} className="border-t">
            <TableCell className="px-4 py-2">{employee.name}</TableCell>
            <TableCell className="px-4 py-2">{employee.email}</TableCell>
            <TableCell className="px-4 py-2">{employee.position}</TableCell>
            <TableCell className="px-4 py-2">
              <Button
                onClick={() => handleDeleteEmployee(employee.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
              >
                Borrar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</Card>
    );
};

export default Employees;