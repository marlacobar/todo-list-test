const express = require('express');
const router = express.Router();
const { refreshToken, logOut } = require('../services/authService/jwtService');

router.post("/auth/refresh", refreshToken);
router.post("/auth/logout", logOut);

module.exports = router;