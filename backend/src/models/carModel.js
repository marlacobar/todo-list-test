const db = require('../services/dbConfig')

class UserModel {
  /**
   * Obtiene un listado de automóviles dependiendo del rol del usuario.
   *
   * @async
   * @function selCarsByUserRol
   * @param {string} userId - ID del usuario.
   * 
   * @returns {Promise<Array>} Retorna un arreglo de objetos con los automóviles del usuario 
   * o todos si es admin.
   * @throws {Error} Lanza un error si no se completa el proceso.
   */
  async selCarsByUserRol(userId) {
    // Consulta si el usuario tiene el rol de admin
    const roles = db.prepare(
      `SELECT rol_name
        FROM rol
        WHERE rol_id = (SELECT rol_id FROM user_rol WHERE user_id = ?)`
    ).all(userId);

    const hasAdminRole = roles.some(r => r.rol_name === 'VIEWER_ALL');

    if (hasAdminRole) {
      // Retorna todos los autos
      return db.prepare(`
        SELECT c.car_id, c.license_plate, c.brand, c.color, c.model,
            c.latitude, c.longitude, u.username
          FROM car c
          INNER JOIN user_car uc ON uc.car_id = c.car_id
          INNER JOIN user u ON u.user_id = uc.user_id`).all();
    } else {
      // Retorna solo autos del usuario
      return db.prepare(
        `SELECT c.car_id, c.license_plate, c.brand, c.color, c.model,
            c.latitude, c.longitude, u.username
          FROM car c
          INNER JOIN user_car uc ON uc.car_id = c.car_id
          INNER JOIN user u ON u.user_id = uc.user_id
          WHERE uc.user_id = ?`
      ).all(userId);
    }
  }

  /**
   * Actualiza todos los datos de un automóvil especificado por `car_id`.
   *
   * @async
   * @function updateCar
   * @param {string} car_id - Id del automóvil.
   * @param {string} license - Placa del automóvil.
   * @param {string} brand - Marca del automóvil.
   * @param {string} color - Color del automóvil.
   * @param {string} model - Modelo del automóvil.
   * @param {string} latitude - Latitud del automóvil.
   * @param {string} longitude - Longitud del automóvil.
   * @returns {Promise<Object>} Retorna un objeto con `success` y `message` si se actualiza el automóvil.
   * 
   * @throws {Error} Lanza un error si no se completa el proceso.
   */
  async updateCar(car_id, license_plate, brand, color, model, latitude, longitude) {
    try {
      if (!car_id) {
        const err = new Error('El ID del automóvil es requerido.');
        err.code = 400;
        throw err;
      }
      if (!license_plate) {
        const err = new Error('El número de placas es requerido.');
        err.code = 400;
        throw err;
      }

      const existing = db.prepare('SELECT * FROM car WHERE car_id = @car_id')
        .get({ car_id });

      if (!existing) {
        const err = new Error('El automóvil no existe.');
        err.code = 404;
        throw err;
      }

      const updateCar = db.prepare(
        `UPDATE car
          SET license_plate = @license_plate,
              brand = @brand,
              color = @color,
              model = @model,
              latitude = @latitude,
              longitude = @longitude
          WHERE car_id = @car_id`
      );
      const resInsertCar = updateCar.run({
        license_plate, brand,
        color, model,
        latitude, longitude,
        car_id
      });

      return { success: true, message: 'Automóvil actualizado con éxito' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Actualiza la latitud y longitud de un automóvil especificado por `car_id`.
   *
   * @async
   * @function updCarPosition
   * @param {string} car_id - Id del automóvil.
   * @param {string} latitude - Latitud del automóvil.
   * @param {string} longitude - Longitud del automóvil.
   * @returns {Promise<Object>} Retorna un objeto con `success` y `message` si se actualiza el automóvil.
   * 
   * @throws {Error} Lanza un error si no se completa el proceso.
   */
  async updCarPosition(car_id, latitude, longitude) {
    try {
      if (!car_id) {
        const err = new Error('El ID del automóvil es requerido.');
        err.code = 400;
        throw err;
      }

      const existing = db.prepare('SELECT * FROM car WHERE car_id = @car_id')
        .get({ car_id });

      if (!existing) {
        const err = new Error('El automóvil no existe.');
        err.code = 404;
        throw err;
      }

      const updateCar = db.prepare(
        `UPDATE car
          SET latitude = @latitude,
            longitude = @longitude
          WHERE car_id = @car_id`
      );
      updateCar.run({
        latitude, longitude,
        car_id
      });

      return { success: true, message: 'Posición del automóvil actualizada' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Inserta un nuevo automóvil a base de datos.
   *
   * @async
   * @function insertCar
   * @param {string} license - Placa del automóvil.
   * @param {string} brand - Marca del automóvil.
   * @param {string} color - Color del automóvil.
   * @param {string} model - Modelo del automóvil.
   * @param {string} latitude - Latitud del automóvil.
   * @param {string} longitude - Longitud del automóvil.
   * @param {number} userId - ID del usuario que registra el automóvil.
   * @returns {Promise<Object>} Retorna un objeto con `success` y `message` si se registra el automóvil.
   * 
   * @throws {Error} Lanza un error si no se completa el proceso.
   */
  async insertCar(license_plate, brand, color, model, latitude, longitude, userId) {
    try {
      if (!license_plate) {
        const err = new Error('El número de placas es requerido.');
        err.code = 400;
        throw err;
      }
      const existing = db.prepare('SELECT * FROM car WHERE license_plate = @license_plate')
        .get({ license_plate });

      if (existing) {
        const err = new Error('Las placas ya están registradas.');
        err.code = 409;
        throw err;
      }

      const insertCar = db.prepare(
        `INSERT INTO car
        (license_plate, brand, color, model, latitude, longitude)
        VALUES
        (@license_plate, @brand, @color, @model, @latitude, @longitude)`
      );
      const resInsertCar = insertCar.run({
        license_plate, brand,
        color, model,
        latitude, longitude
      });

      const carId = resInsertCar.lastInsertRowid;

      // Guardar la relación con el usuario
      const insRelation = db.prepare(
        `INSERT INTO user_car
        (user_id, car_id)
        VALUES (@userId, @carId)`
      );
      insRelation.run({
        userId,
        carId
      });

      return { success: true, message: 'Automóvil guardado con éxito' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Elimina un automóvil especificado por `car_id`.
   * Elimina también la relación con el usuario.
   *
   * @async
   * @function deleteCar
   * @param {string} car_id - Id del automóvil a eliminar.
   * @param {number} userId - ID del usuario que registra el automóvil.
   * @returns {Promise<Object>} Retorna un objeto con `success` y `message` si se elimina el automóvil.
   * 
   * @throws {Error} Lanza un error si no se completa el proceso.
   */
  async deleteCar(car_id, userId) {
    try {
      if (!car_id) {
        const err = new Error('El ID del automóvil es requerido.');
        err.code = 400;
        throw err;
      }

      const existing = db.prepare('SELECT license_plate FROM car WHERE car_id = @car_id')
        .get({ car_id });

      if (!existing) {
        const err = new Error('El automóvil no existe.');
        err.code = 404;
        throw err;
      }

      // Eliminar relación con el usuario
      const deleteRelation = db.prepare(`DELETE FROM user_car WHERE car_id = @car_id
        AND user_id = @userId`);
      deleteRelation.run({ car_id, userId });

      // Eliminar automóvil
      const deleteCar = db.prepare('DELETE FROM car WHERE car_id = @car_id');
      deleteCar.run({ car_id });

      return { success: true, message: 'Automóvil eliminado con éxito' };

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = new UserModel();