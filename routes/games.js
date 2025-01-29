const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');
const gamesController = require('../controllers/games-controller')

const storage = multer.diskStorage({
	destination: function(req, file, cb){
			cb(null, './uploads/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}

});
const upload = multer({storage})

// GET that shows a list of games
router.get('/', login.optional, gamesController.getGames);

router.get('/:gameId', login.optional, gamesController.getGameById);

// POST that inserts a new game in the database
router.post('/' , upload.single('game_image'), login.required, gamesController.postGame)

//PATCH that updates a game in the database
router.patch('/', login.required, gamesController.patchGameById)

//DELETE that deletes a game in the database
router.delete('/', login.required,gamesController.deleteGameById);
module.exports = router;