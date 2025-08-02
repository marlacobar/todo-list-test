const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { verifyToken } = require('../services/authService/jwtService');

router.get("/car", verifyToken, carController.selCarsByUserRol);
router.post("/car", verifyToken, carController.insertCar);
router.put("/car/:car_id", verifyToken, carController.updateCar);
router.delete("/car/:car_id", verifyToken, carController.deleteCar);

module.exports = router;
