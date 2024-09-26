import { createContext, useContext, useState, ReactNode } from 'react';
import { SignJWT } from 'jose'; // Importamos SignJWT y jwtVerify
import crypto from 'crypto-js';
import { API_KEY } from '../config/config.ts';
import { API_EMPLOYEE_URL } from '../config/config.ts';

interface AuthContextProps {
  token: string | null;
  role: string | null;
  name: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [name, setName] = useState<string | null>(localStorage.getItem('name'));

  const secret = new TextEncoder().encode('mi-secreto'); 



  const login = async (username: string, password: string) => {


    // Buscamos al usuario en la base de datos mockup
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
    const employees = data.record;

    // Buscar usuario por username
    const foundUser = employees.find((emp: Employee) => emp.username === username);

    const hashedPassword = crypto.SHA256(password).toString();
    if (!foundUser || foundUser.password !== hashedPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generamos el JWT
    const payload = {
      sub: String(foundUser.id), 
      name: foundUser.username,
      role: foundUser.role,
      iat: Math.floor(Date.now() / 1000), // Timestamp actual
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expira en 1 hora
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret); // Firmamos el JWT

    // Guardamos el token y rol en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', foundUser.role);
    localStorage.setItem('name', foundUser.name);
    setToken(token);
    setRole(foundUser.role);
    setName(foundUser.name);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
