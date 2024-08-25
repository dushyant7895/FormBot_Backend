const express = require('express');
const router = express.Router();
const { signup, login, updateUser, userDetails } = require('../controllers/auth');
const validateNewUser = require('../middleware/validateNewUser');
const validateLogin = require('../middleware/validateLogin');
const validateUserUpdate = require('../middleware/validateUserUpdate');

router.post('/signup', validateNewUser, signup);
router.post('/login', validateLogin, login);
router.put('/updateuser/:userId', validateUserUpdate, updateUser);
router.get('/userdetails/:id', userDetails);

module.exports = router;
