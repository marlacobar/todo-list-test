import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../services/userService'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()


  useEffect(() => {
    const hasRefreshToken = document.cookie.includes('refreshToken');
    if (hasRefreshToken) {
      navigate('/catalog');
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      toast.error('Por favor, completa todos los campos')
      return
    }

    try {
      const response = await login(username, password);
      toast.success('Inicio exitosamente.');
      setUsername('');
      setPassword('');
      navigate('/catalog');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrar');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <button type="submit">Entrar</button>
      <p>¿No tienes cuenta? <Link to="/register">Crear cuenta</Link></p>
    </form>
  )
}

export default Login
