import { useAuth } from '../services/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Panel de Control</h1>
      <p>Bienvenido, {user?.username}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}