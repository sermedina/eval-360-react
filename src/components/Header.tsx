import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const Header = () => {
  const { role, logout } = useAuth();

  return (
    <aside className="w-64 bg-blue-700 text-white h-screen p-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Prueba Técnica</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to='/' className="hover:text-blue-300 transition">Dashboard</Link>
          </li>
          {role && (
            <li>
              <Link to="/profile" className="hover:text-blue-300 transition">Perfil</Link>
            </li>
          )}
          {role === 'employee' && (
            <li>
              <Link to='/evaluation' className="hover:text-blue-300 transition">Evaluación</Link>
            </li>
          )}
          {role === 'admin' && (
            <>
              <li>
                <Link to="/employees" className="hover:text-blue-300 transition">Empleados</Link>
              </li>
              <li>
                <Link to="/evaluations" className="hover:text-blue-300 transition">Crear Evaluaciones</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <button 
        onClick={logout} 
        className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded transition w-full mt-6"
      >
        Logout
      </button>
    </aside>
  );
};

export default Header;