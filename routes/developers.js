const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');
const developerController = require('../controllers/developers-controller')

const storage = multer.diskStorage({
	destination: function(req, file, cb){
			cb(null, './uploads/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}

});
const upload = multer({storage})
// GET that shows a list of developers
router.get('/', login.optional, developerController.getDevelopers);

// GET that shows a specific developer by ID
router.get('/:developerId', login.optional, developerController.getDeveloperById);

// POST that inserts a new developer in the database
router.post('/', login.required,developerController.postDeveloper);

// PATCH that updates a developer in the database
router.patch('/', login.required,developerController.patchDeveloperById);

// DELETE that deletes a developer in the database
router.delete('/', login.required,developerController.deleteDeveloperById);

module.exports = router;