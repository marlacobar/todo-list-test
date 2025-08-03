const jwt = require('jsonwebtoken');

const ACCESS_JWT_EXPIRATION = process.env.ACCESS_JWT_EXPIRATION;
const REFRESH_JWT_EXPIRATION = process.env.REFRESH_JWT_EXPIRATION;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

/**
 * Genera un access token JWT de acceso usando el ID del usuario.
 *
 * @param {number} userId - El ID del usuario.
 * @returns {string} El token de acceso generado.
 */
const getAccessToken = (userId) => {
  return jwt.sign({ userId }, TOKEN_SECRET, { expiresIn: ACCESS_JWT_EXPIRATION });
};
/**
 * Genera un refresh token JWT de acceso usando el ID del usuario.
 *
 * @param {number} userId - El ID del usuario.
 * @returns {string} El token de acceso generado.
 */
const getRefreshToken = (userId) => {
  return jwt.sign({ userId }, TOKEN_SECRET, { expiresIn: REFRESH_JWT_EXPIRATION });
};

/**
 * Middleware para verificar si el token JWT es válido, leyendo el token desde la cookie `accessToken`.
 *
 * @param {Object} req - El objeto de la solicitud (Express).
 * @param {Object} res - El objeto de la respuesta (Express).
 * @param {Function} next - La función para pasar al siguiente middleware.
 * @returns {void}
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

/**
   * Refresca el token de acceso utilizando el refresh token proporcionado.
   *
   * @param {Object} req - El objeto de la solicitud que contiene el refresh token en las cookies.
   * @param {Object} res - El objeto de la respuesta.
   * @returns {Object} Un objeto con el nuevo token de acceso.
   * @throws {Error} Si el refresh token no es proporcionado o es inválido.
   */
const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: 'Refresh Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const accessToken = getAccessToken(decoded.userId);

    return res.json({ accessToken });

  } catch (error) {
    console.error('Refresh Token inválido o expirado:', error);
    return res.status(401).json({ message: 'Refresh Token inválido o expirado' });
  }
}

/**
 * Cierra la sesión eliminando el refresh token de las cookies.
 *
 * @param {Object} req - El objeto de la solicitud.
 * @param {Object} res - El objeto de la respuesta.
 * @returns {Object} Un objeto con el mensaje de sesión cerrada.
 */
const logOut = (req, res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.json({ message: "Sesión cerrada correctamente" });
}

module.exports = { getAccessToken, getRefreshToken, verifyToken, refreshToken, logOut };