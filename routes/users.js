const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');
const userController = require('../controllers/users-controller')

const storage = multer.diskStorage({
	destination: function(req, file, cb){
			cb(null, './uploads/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}

});
const upload = multer({storage})

router.post('/signup', userController.signup);

router.post('/login', userController.login);

module.exports = router;