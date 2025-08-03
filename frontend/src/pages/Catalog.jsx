import '../styles/Catalog.css'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [locationForm, setLocationForm] = useState({
    latitude: '',
    longitude: ''
  });

  const fetchCars = async () => {
    try {
      const res = await axios.get('/car');
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const hasRefreshToken = document.cookie.includes('refreshToken');
    if (!hasRefreshToken) {
      navigate('/');
    }
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCars();
    const interval = setInterval(fetchCars, 10000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Maneja el cambio de los campos del formulario.
   * 
   * @async
   * @function handleChange
   * @param {Object} e - Evento de cambio del formulario.
   * @param {string} e.target.name - Nombre del campo que cambió.
   * 
   * @returns {void} 
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Maneja el envío del formulario para agregar o editar un automóvil.
   * 
   * @async
   * @function handleSubmit
   * @param {Object} e - Evento de envío del formulario.
   * 
   * @returns {Promise<void>}
   * */
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

  /**
   * Maneja la edición de un automóvil.
   * 
   * @async
   * @function handleEdit
   * @param {Object} car - Objeto del automóvil a editar.
   * @param {number} car.car_id - ID del automóvil.
   * @param {string} car.license_plate - Placas del automóvil.
   * @param {string} car.brand - Marca del automóvil.
   * @param {string} car.model - Modelo del automóvil.
   * @param {string} car.color - Color del automóvil.
   * @param {number} car.latitude - Latitud del automóvil.
   * @param {number} car.longitude - Longitud del automóvil.
   *  
   * @returns {void}
   */
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

  /**
   * Maneja la eliminación de un automóvil.
   * 
   * @async
   * @function handleDelete
   * @param {number} carId - ID del automóvil a eliminar.
   * 
   * @returns {Promise<void>}
   */
  const handleDelete = async (carId) => {
    if (!window.confirm('¿Estás segura/o de eliminar este automóvil?')) return;

    try {
      await axios.delete(`/car/${carId}`);
      fetchCars();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  /**
   * Maneja el cierre del modal de agregar/editar automóvil.
   * 
   * @async
   * @function handleCloseModal
   * 
   * @return {void}
   */
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

  /**
   * Maneja la apertura del modal para actualizar la posición de un automóvil.
   * 
   * @async
   * @function handleOpenLocationModal
   * @param {Object} car - Objeto del automóvil seleccionado.
   * @param {number} car.car_id - ID del automóvil.
   * @param {number} car.latitude - Latitud del automóvil.
   * @param {number} car.longitude - Longitud del automóvil.
   * 
   * @return {void}
   */
  const handleOpenLocationModal = (car) => {
    setSelectedCar(car);
    setLocationForm({
      latitude: car.latitude || '',
      longitude: car.longitude || ''
    });
    setShowLocationModal(true);
  };

  /** 
   * Maneja el envío del formulario para actualizar la posición de un automóvil.
   * 
   * @async
   * @function handleUpdateLocation
   * @param {Object} e - Evento de envío del formulario.
   * 
   * @returns {Promise<void>}
   */
  const handleUpdateLocation = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`/car/${selectedCar.car_id}/position`, locationForm);
      fetchCars();
      handleCloseLocationModal();

    } catch (err) {
      console.error('Error al actualizar posición:', err);
    }
  };

  /** 
   * Componente para ajustar los límites del mapa según las posiciones de los autos.
   * 
   * @async
   * @function MapBounds
   * @param {Object} props - Props del componente.
   * @param {Array} props.cars - Lista de autos con sus posiciones.
   * 
   * @returns {null}
   */
  function MapBounds({ cars }) {
    const map = useMap();

    useEffect(() => {
      if (!cars || cars.length === 0) return;

      // Filtrar solo autos con latitud/longitud
      const validCars = cars.filter(car => car.latitude && car.longitude);

      if (validCars.length === 0) return;

      // Crear un array de posiciones [latitud/longitud]
      const positions = validCars.map(car => [parseFloat(car.latitude), parseFloat(car.longitude)]);

      // Crear bounds con Leaflet
      const bounds = L.latLngBounds(positions);

      // Ajustar vista
      map.fitBounds(bounds, { padding: [50, 50] });
    }, [cars, map]);

    return null;
  };

  /**
   * Maneja el cierre del modal de actualización de posición.
   * 
   * @async
   * @function handleCloseLocationModal
   * 
   * @return {void}
   */
  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
    setSelectedCar(null);
    setLocationForm({
      latitude: '',
      longitude: ''
    });
  };


  return (
    <div className='catalog-container'>
      <h2>Catálogo de Autos</h2>
      <button onClick={() => setShowModal(true)} className='add-btn'>
        Agregar auto
      </button>

      <ul className='car-list'>
        {cars.map((car) => (
          <li key={car.car_id} className='car-item'>
            <strong>{car.license_plate}</strong> - {car.brand} {car.model} ({car.color})
            <button className='edit-btn' onClick={() => handleEdit(car)}>Editar</button>
            <button className='delete-btn' onClick={() => handleDelete(car.car_id)}>Eliminar</button>
            <button className='location-btn' onClick={() => handleOpenLocationModal(car)}>Actualizar posición</button>
          </li>
        ))}
      </ul>

      {/* Mapa de autos */}
      <MapContainer id='map' center={[20.6736, -103.344]} zoom={8} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cars.map((car) =>
          car.latitude && car.longitude ? (
            <Marker key={car.car_id} position={[car.latitude, car.longitude]}>
              <Popup>
                <strong>{car.license_plate}</strong><br />
                {car.brand} {car.model}
              </Popup>
            </Marker>
          ) : null
        )}
        <MapBounds cars={cars} />
      </MapContainer>


      {/* Modal para agregar/editar automóvil */}
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h3>{editingCarId ? 'Editar automóvil' : 'Agregar automóvil'}</h3>
            <form onSubmit={handleSubmit} className='form'>
              <input name='license_plate' value={form.license_plate} onChange={handleChange} placeholder='Placas' required />
              <input name='brand' value={form.brand} onChange={handleChange} placeholder='Marca' />
              <input name='model' value={form.model} onChange={handleChange} placeholder='Modelo' />
              <input name='color' value={form.color} onChange={handleChange} placeholder='Color' />
              <input name='latitude' value={form.latitude} onChange={handleChange} placeholder='Latitud' />
              <input name='longitude' value={form.longitude} onChange={handleChange} placeholder='Longitud' />

              <div className='form-buttons'>
                <button type='submit'>Guardar</button>
                <button type='button' onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal para editar la posición de un automóvil */}
      {showLocationModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h3>Actualizar posición</h3>
            <form onSubmit={handleUpdateLocation} className='form'>
              <input
                name='latitude'
                value={locationForm.latitude}
                onChange={(e) => setLocationForm({ ...locationForm, latitude: e.target.value })}
                placeholder='Latitud'
                required
              />
              <input
                name='longitude'
                value={locationForm.longitude}
                onChange={(e) => setLocationForm({ ...locationForm, longitude: e.target.value })}
                placeholder='Longitud'
                required
              />

              <div className='form-buttons'>
                <button type='submit'>Actualizar</button>
                <button type='button' onClick={handleCloseLocationModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
