const ms = require('ms');
const userModel = require('../models/userModel');

module.exports = {
  /**
   * Inserta un nuevo usuario al portal.
   *
   * @async
   * @function insUser
   * @param {import('express').Request} req Objeto de solicitud HTTP, con el cuerpo que contiene los datos del usuario.
   * @param {import('express').Response} res Objeto de respuesta HTTP.
   * @returns {Promise<void>}
   */
  insUser: async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const result = await userModel.insUser(username, password, role);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Verifica al usuario por username y contraseña.
   * También establece una cookie con el token de actualización.
   *
   * @async
   * @function logInUser
   * @param {import('express').Request} req Objeto de solicitud HTTP, con `req.body.username` y `req.body.password`.
   * @param {import('express').Response} res Objeto de respuesta HTTP.
   * @returns {Promise<void>}
   */
  logInUser: async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await userModel.selUser_ByUserPass(
        username,
        password
      );

      res.cookie('refreshToken', result.data.refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: ms('1h'),
        path: '/'
      });

      res.status(200).json({
        message: 'Autorizado',
        data: {
          accessToken: result.data.accessToken,
          userId: result.data.userId
        }
      });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}