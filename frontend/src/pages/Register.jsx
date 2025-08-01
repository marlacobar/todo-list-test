import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { register } from '../services/userService'
import { useEffect } from 'react'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')
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
      await register(username, password);
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
      <button type="submit">Registrarse</button>
    </form>
  )
}

export default Register
