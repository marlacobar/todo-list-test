import '../styles/Catalog.css'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../services/apiInstance';

const Catalog = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [form, setForm] = useState({
    license_plate: '',
    brand: '',
    model: '',
    color: '',
    latitude: '',
    longitude: '',
  });

  const fetchCars = async () => {
    try {
      const res = await axios.get('/car');
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCarId) {
        await axios.put(`/car/${editingCarId}`, form);
      } else {
        await axios.post('/car', form);
      }

      setShowModal(false);
      setForm({
        license_plate: '',
        brand: '',
        model: '',
        color: '',
        latitude: '',
        longitude: '',
      });
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (car) => {
    setEditingCarId(car.car_id);
    setForm({
      license_plate: car.license_plate || '',
      brand: car.brand || '',
      model: car.model || '',
      color: car.color || '',
      latitude: car.latitude || '',
      longitude: car.longitude || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('¿Estás segura/o de eliminar este automóvil?')) return;

    try {
      await axios.delete(`/car/${carId}`);
      fetchCars();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({
      license_plate: '',
      brand: '',
      model: '',
      color: '',
      latitude: '',
      longitude: '',
    });
  };

  useEffect(() => {
    const hasRefreshToken = document.cookie.includes('refreshToken');
    if (!hasRefreshToken) {
      navigate('/');
    }

    fetchCars();
  }, []);

  return (
    <div className="catalog-container">
      <h2>Catálogo de Autos</h2>
      <button onClick={() => setShowModal(true)} className="add-btn">
        Agregar auto
      </button>

      <ul className="car-list">
        {cars.map((car) => (
          <li key={car.car_id} className="car-item">
            <strong>{car.license_plate}</strong> - {car.brand} {car.model} ({car.color})
            <button className="edit-btn" onClick={() => handleEdit(car)}>Editar</button>
            <button className="delete-btn" onClick={() => handleDelete(car.car_id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingCarId ? 'Editar automóvil' : 'Agregar automóvil'}</h3>
            <form onSubmit={handleSubmit} className="form">
              <input name="license_plate" value={form.license_plate} onChange={handleChange} placeholder="Placas" required />
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="Marca" />
              <input name="model" value={form.model} onChange={handleChange} placeholder="Modelo" />
              <input name="color" value={form.color} onChange={handleChange} placeholder="Color" />
              <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitud" />
              <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitud" />

              <div className="form-buttons">
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
