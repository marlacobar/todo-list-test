const jwt = require('jsonwebtoken');

// const SECRET_KEY = process.env.JWT_SECRET;
// const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const ACCESS_JWT_EXPIRATION = '15m';
const REFRESH_JWT_EXPIRATION = '1h';
const ACCESS_TOKEN_SECRET = 'b853065d2cea733efee3cff1865985778760bef7ab7de837b364d2dc5a0b6fc0adbb14a189668b4cb48f647a82c831350097ca61fbf8f994cd51b89851e88ae9';
const REFRESH_TOKEN_SECRET = 'ae098dae4f4441ce311239b21964f9380c0345e407da8368787336105ffceb3222d3e76da8bbcfe73c425c707bc937e198e130dfaf8d4c613874d25b65d1115e';

/**
 * Genera un access token JWT de acceso usando el ID del usuario.
 *
 * @param {number} userId - El ID del usuario.
 * @returns {string} El token de acceso generado.
 */
const getAccessToken = (userId) => {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_JWT_EXPIRATION });
};
/**
 * Genera un refresh token JWT de acceso usando el ID del usuario.
 *
 * @param {number} userId - El ID del usuario.
 * @returns {string} El token de acceso generado.
 */
const getRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_JWT_EXPIRATION });
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
    return res.status(403).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
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
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_JWT_EXPIRATION }
    );

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