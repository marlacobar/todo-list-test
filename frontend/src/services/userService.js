import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const register = (username, password) =>
  axios.post(`${API_URL}/register`, { username, password });


export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });

  const { accessToken } = response.data.data;

  // Guardar access token en sessionStorage
  sessionStorage.setItem('accessToken', accessToken);

  return response.data;
};