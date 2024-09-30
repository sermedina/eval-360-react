import React, { useEffect, useState } from 'react';
import { Card, Button, Table, TableHead, TableBody, TableRow, TableCell, TextInput, Text } from '@tremor/react';
import { Employee } from '../types.ts';
import  { fetchEmployees, saveEmployee, deleteEmployee } from '../services/employeeService.ts';



const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({ id: 0, name: '', email: '', position: '', username: '', password: '', role: 'employee' });
  const [error, setError] = useState('');


  useEffect(() => {
    fetchEmployees()
    .then(setEmployees)
    .catch(console.error);
  }, []);

  const handleDeleteEmployee = async (id: number) => {
    try {
      const updatedEmployees = await deleteEmployee(id, employees);
      if (updatedEmployees) { 
        setEmployees(updatedEmployees);
      } else {
        setError('Error al eliminar el empleado');
      }
    } catch (error) {
      console.error(error);
      setError('Error al eliminar el empleado');
    }
  };

  const handleCreateEmployee = async () => {
    if (newEmployee && newEmployee.name && newEmployee.email && newEmployee.position) {
      try {
        const updatedEmployees = await saveEmployee(employees, newEmployee);
        setEmployees(updatedEmployees);
        setShowForm(false);
        setNewEmployee({
          id: 0,
          name: '',
          email: '',
          position: '',
          username: '',
          password: '',
          role: 'employee',
        });
        setError('');
      } catch {
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



  return (
    <Card className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Gestión de Empleados</h2>

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
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Crear Nuevo Empleado</h3>

          <div>
            <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre</Text>
            <TextInput
              value={newEmployee?.name || ''}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              placeholder="Nombre"
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300" // Ajuste aquí
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</Text>
            <TextInput
              value={newEmployee?.email || ''}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              placeholder="Email"
              type="email"
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300" 
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Cargo</Text>
            <TextInput
              value={newEmployee?.position || ''}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              placeholder="Cargo"
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300"
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre de usuario</Text>
            <TextInput
              value={newEmployee.username}
              onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
              placeholder="Username"
              required
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300" 
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Contraseña</Text>
            <TextInput
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              placeholder="Contraseña"
              type="password"
              required
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300" 
            />
          </div>

          <div>
            <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Rol</Text>
            <select
              id="role"
              value={newEmployee?.role || 'employee'}
              onChange={(e) => setNewEmployee({ ...newEmployee!, role: e.target.value as 'admin' | 'employee' })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="admin" className="dark:bg-gray-800 dark:text-gray-300">Admin</option>
              <option value="employee" className="dark:bg-gray-800 dark:text-gray-300">Empleado</option>
            </select>
          </div>

          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

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
        <Table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mt-6">
          <TableHead className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableCell className="px-4 py-2 font-semibold text-left text-gray-700 dark:text-gray-300">Nombre</TableCell>
              <TableCell className="px-4 py-2 font-semibold text-left text-gray-700 dark:text-gray-300">Usuario</TableCell>
              <TableCell className="px-4 py-2 font-semibold text-left text-gray-700 dark:text-gray-300">Email</TableCell>
              <TableCell className="px-4 py-2 font-semibold text-left text-gray-700 dark:text-gray-300">Cargo</TableCell>
              <TableCell className="px-4 py-2 font-semibold text-left text-gray-700 dark:text-gray-300">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="border-t border-gray-200 dark:border-gray-600">
                <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">{employee.name}</TableCell>
                <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">{employee.username}</TableCell>
                <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">{employee.email}</TableCell>
                <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-200">{employee.position}</TableCell>
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