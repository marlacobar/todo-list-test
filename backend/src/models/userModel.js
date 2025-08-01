const bcrypt = require('bcrypt')

const db = require('../services/dbConfig')
const { getAccessToken, getRefreshToken } = require('../services/authService/jwtService')


/**
 * Compara una contraseña en texto plano con su hash usando bcrypt.
 * @param {string} plainPassword - Contraseña sin cifrar.
 * @param {string} storedHash - Contraseña hasheada.
 * @returns {Promise<boolean>} - Retorna `true` si coinciden, `false` si no.
 */
async function compareHash(plainPassword, storedHash) {
  return await bcrypt.compare(plainPassword, storedHash);
}

class UserModel {
  /**
   * Inserta un nuevo usuario a base de datos.
   *
   * @async
   * @function insUser
   * @param {string} username - Nombre de usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<Object>} Retorna un objeto con `success` y `message` si se registra el usuario.
   * 
   * @throws {Error} Lanza un error si no se completa el proceso.
   */
  async insUser(username, password) {
    try {
      if (!username || !password) {
        throw new Error('Usuario y contraseña son requeridos.');
      }
      const existing = db.prepare('SELECT * FROM user WHERE username = @username')
        .get({ username });

      if (existing) {
        const err = new Error('El usuario ya existe.');
        err.code = 409;
        throw err;
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Guardar en la base
      const query = db.prepare(
        'INSERT INTO user (username, password_hash) VALUES (@username, @hashedPassword)'
      );
      query.run({
        username,
        hashedPassword,
      });

      return { success: true, message: 'Usuario creado con éxito' };
    } catch (error) {
      console.error(error);
      throw new Error('Error del servidor: ', error.message || 'Error al registrar el usuario');
    }
  }

  /**
   * Verifica las credenciales del usuario mediante su username y contraseña..
   *
   * @async
   * @function selUser_ByUserPass
   * @param {string} username - Nombre de usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<Object>} Objeto que contiene los tokens de acceso y actualización, y el ID del usuario.
   * 
   * @throws {Error} Lanza un error si no se completa el proceso.
   */
  async selUser_ByUserPass(username, password) {
    try {
      const existing = db.prepare('SELECT user_id, password_hash FROM user WHERE username = @username')
        .get({ username });

      if (!existing) {
        const error = new Error('El username es incorrecto. Favor de verificar');
        error.status = 401;
        throw error;
      }

      const isMatch = await compareHash(password, existing.password_hash);

      if (!isMatch) {
        const error = new Error('El username o la contraseña son incorrectos. Favor de verificar');
        error.status = 401;
        throw error;
      }

      const refreshToken = getRefreshToken(existing.user_id);
      const accessToken = getAccessToken(existing.user_id);

      return {
        message: 'Autorizado',
        data: {
          accessToken,
          refreshToken,
          userId: existing.user_id
        }
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error del servidor: ', error.message || 'Error al registrar el usuario');
    }
  }
}

module.exports = new UserModel();