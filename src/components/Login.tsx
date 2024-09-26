import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        // Intentamos hacer login
        await login(username, password);
        navigate('/'); // Redirigimos al dashboard si el login es exitoso
      } catch (err) {
        console.error('Error during login:', err); // Depuración del error
        setError('Credenciales inválidas'); // Mostramos mensaje de error en la UI
      }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-6 rounded-lg shadow-md w-96">
    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1">Usuario:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-400"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1">Contraseña:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-400"
      />
    </div>
    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    <button 
      onClick={handleLogin} 
      className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-500 transition w-full"
    >
      Login
    </button>
  </div>
</div>
  );
};

export default Login;