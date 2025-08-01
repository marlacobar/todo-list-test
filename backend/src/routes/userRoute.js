const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post("/register", userController.insUser);
router.post("/login", userController.logInUser);

module.exports = router;
