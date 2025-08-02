import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { register } from '../services/userService'
import { useEffect } from 'react'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')

  const [role, setRole] = useState('VIEWER_OWN');

  const navigate = useNavigate()


  useEffect(() => {
    const hasRefreshToken = document.cookie.includes('refreshToken');
    if (hasRefreshToken) {
      navigate('/catalog');
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== secondPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    try {
      const response = await register(username, password, role);
      console.log(response.data);
      toast.success('Usuario creado exitosamente. Ahora puedes iniciar sesión.');
      setUsername('');
      setPassword('');
      setSecondPassword('');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrar');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Repetir Contraseña"
        value={secondPassword}
        onChange={(e) => setSecondPassword(e.target.value)}
        required
      />

      <div className='role-group'>
        <p>Selecciona tu rol:</p>
        <label>
          <input
            type="radio"
            name="role"
            value="viewer"
            checked={role === 'VIEWER_OWN'}
            onChange={() => setRole('VIEWER_OWN')}
          />
          Usuario - solo ve sus vehículos
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="admin"
            checked={role === 'VIEWER_ALL'}
            onChange={() => setRole('VIEWER_ALL')}
          />
          Administrador - ve todos los vehículos
        </label>
      </div>

      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register
