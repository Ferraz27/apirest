const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');
const publisherController = require('../controllers/publishers-controller')

const storage = multer.diskStorage({
	destination: function(req, file, cb){
			cb(null, './uploads/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}

});
const upload = multer({storage})

router.get('/', login.optional,publisherController.getPublihshers);

router.get('/:publisherId', login.optional,publisherController.getPublisherbyId);

router.post('/', login.required,publisherController.postPublisher);

router.patch('/', login.required,publisherController.patchPublisherById);

router.delete('/', login.required,publisherController.deletePublisherById);

module.exports = router;