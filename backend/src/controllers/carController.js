const carModel = require('../models/carModel');

module.exports = {
  /**
   * Listado de los automóviles dependiendo del rol del usuario.
   *
   * @async
  * @function selCarsByUserRol
   * @param {import('express').Request} req Objeto de solicitud HTTP, con el cuerpo que contiene los datos.
   * @param {import('express').Response} res Objeto de respuesta HTTP.
   * @returns {Promise<void>}
   */
  selCarsByUserRol: async (req, res) => {
    try {
      const userId = req.user.userId;

      const result = await carModel.selCarsByUserRol(userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Inserta un nuevo automóvil.
   *
   * @async
   * @function insCar
   * @param {import('express').Request} req Objeto de solicitud HTTP, con el cuerpo que contiene los datos del automóvil.
   * @param {import('express').Response} res Objeto de respuesta HTTP.
   * @returns {Promise<void>}
   */
  insertCar: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { license_plate, brand, color, model, latitude, longitude } = req.body;

      const result = await carModel.insertCar(license_plate, brand, color, model, latitude, longitude, userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Actualiza un automóvil.
   *
   * @async
   * @function updateCar
   * @param {import('express').Request} req Objeto de solicitud HTTP, con el cuerpo que contiene los datos del automóvil.
   * @param {import('express').Response} res Objeto de respuesta HTTP.
   * @returns {Promise<void>}
   */
  updateCar: async (req, res) => {
    try {
      const { car_id } = req.params;
      const { license_plate, brand, color, model, latitude, longitude } = req.body;

      const result = await carModel.updateCar(car_id, license_plate, brand, color, model, latitude, longitude);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Actualiza la latitud y longitud de un automóvil.
   *
   * @async
   * @function updCarPosition
   * @param {import('express').Request} req Objeto de solicitud HTTP, con el cuerpo que contiene los datos del automóvil.
   * @param {import('express').Response} res Objeto de respuesta HTTP.
   * @returns {Promise<void>}
   */
  updCarPosition: async (req, res) => {
    try {
      const { car_id } = req.params;
      const { latitude, longitude } = req.body;

      const result = await carModel.updCarPosition(car_id, latitude, longitude);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Eliminar un automóvil.
   *
   * @async
   * @function deleteCar
   * @param {import('express').Request} req Objeto de solicitud HTTP, con el car_id en params.
   * @param {import('express').Response} res Objeto de respuesta HTTP.
   * @returns {Promise<void>}
   */
  deleteCar: async (req, res) => {
    try {
      const { car_id } = req.params;
      const userId = req.user.userId;

      const result = await carModel.deleteCar(car_id, userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
}