import { createContext, useContext, useState, ReactNode } from 'react';
import { SignJWT } from 'jose'; // Importamos SignJWT y jwtVerify
import crypto from 'crypto-js';
import { API_KEY } from '../config/config.ts';
import { API_EMPLOYEE_URL } from '../config/config.ts';

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  token: string;
  role: string;
  name: string;
  email: string;
  position: string;
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  );

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
      name: foundUser.name,
      role: foundUser.position, // Aquí asumimos que el cargo es el rol
      iat: Math.floor(Date.now() / 1000), // Timestamp actual
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expira en 1 hora
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    // Creamos el objeto de usuario con toda la información relevante
    const userData: User = {
      token,
      role: foundUser.role,
      name: foundUser.name,
      email: foundUser.email,
      position: foundUser.position,
    };

    // Guardamos el objeto usuario en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};