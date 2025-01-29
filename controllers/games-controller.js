const mysql = require('../mysql').pool

exports.getGames = (req, res, next) => {
	console.log(req.user);
	mysql.getConnection((error, conn) => {
		
		conn.query(
			`SELECT * 
			FROM game g
			JOIN publisher p on g.publisher_idpublisher = p.idpublisher 
			JOIN developer d on g.developer_iddeveloper = d.iddeveloper `,
			(error, result, fields) => {
				conn.release();
				if (error) return res.status(500).send({ error: error });

				const response = {
					count: result.length,								
					games: result.map(game => {
						return {
							idgame: game.idgames,
							name: game.game_name,
							release_date: game.release_date,
							publisher: game.publisher_name,
							developer: game.developer_name,
							description: game.description,
							request: {
								type: "GET",
								description: "Read of a singular game from the database.",
								url: "http://localhost:3000/games/" + game.idgames
							}
						}
					})					
				}

				return res.status(200).send(response)
			}

		);
	});


}

exports.getGameById = (req, res, next) => {

	gameId = req.params.gameId;

	mysql.getConnection((error, conn) => {
		
		conn.query(
			'SELECT * from game WHERE idgames = ?',
			[gameId],
			(error, result, fields) => {
				conn.release();
				if (error) return res.status(500).send({ error: error });
				if(result == 0) res.status(404).send({error: "there is no game with such id"});
				const response = {																		
					idgame: result[0].idgames,
					name: result[0].game_name,
					release_date: result[0].release_date,
					idpublisher: result[0].publisher_idpublisher,
					iddeveloper: result[0].developer_iddeveloper,
					description: result[0].description,
					request: {
						type: "GET",
						description: "Read of a singular game from the database.",
						url: "http://localhost:3000/games/" + result[0].idgames
					}									
				}
				return res.status(200).send(response)
			}

		);
	});


}

exports.postGame = (req, res, next) => {
	console.log(req.file);
	let inputGame = {
		name: req.body.name,
		releaseDate: req.body.releaseDate,
		publisherId: req.body.publisherId,
		developerId: req.body.developerId,
		gameDescription: req.body.description
	}

	mysql.getConnection((error, conn) => {
		if (error) return res.status(500).send({ error: error });
		conn.query(
			'INSERT INTO game (game_name, release_date, publisher_idpublisher, developer_iddeveloper, description) VALUES (?,?,?,?,?)',
			[inputGame.name, inputGame.releaseDate, inputGame.publisherId, inputGame.developerId, inputGame.gameDescription],
			(error, result, field) => {
				conn.release();
				if (error) {
					return res.status(500).send({
						error: error,
						response: null
					});
				}
				const response = {
					message: "Game inserted sucessfully",
					insertedGame: inputGame,
					request: {
						type: "GET",
						description: "",
						url: "http://localhost:3000/games"
					}
				}
				res.status(201).send(response);
			}
		);
	});

}

exports.patchGameById = (req, res, next) =>{

	let inputGame = {
		name: req.body.name,
		releaseDate: req.body.releaseDate,
		publisherId: req.body.publisherId,
		developerId: req.body.developerId,
		gameDescription: req.body.description
	}

	let idTochange = req.body.idToChange;

	mysql.getConnection((error, conn) => {
		if (error) { return res.status(500).send({ error: error }) }
		conn.query(
			'UPDATE game SET game_name = ?, release_date = ?, publisher_idpublisher = ?, developer_iddeveloper = ?, description = ? WHERE idgames = ?',
			[inputGame.name, inputGame.releaseDate, inputGame.publisherId, inputGame.developerId,inputGame.gameDescription, idTochange ],
			(error, result, field) => {
				conn.release();
				if (error) {
					return res.status(500).send({
						error: error,
						response: null
					});
				}
				response = {
					message: "Game updated successfully",
					inputGame: inputGame,
					request: {
						type: "GET",
						description: "",
						url: "http://localhost:3000/games"
					}
				}
				res.status(202).send(response);
			}
		);
	});
}

// Function called to delete a game by it's ID
exports.deleteGameById = (req, res, next) =>{

	let idToDelete = req.body.idToDelete;

	mysql.getConnection((error, conn) => {
		conn.query(
			'DELETE FROM game where idgames = ?',
			[idToDelete],
			(error, result, field) => {
				conn.release();
				if (error) return res.status(500).send({ error: error });
				const response = {
					message: "Game succesfully deleted",
					gamesId: idToDelete,
					request: {
						type: "GET",
						description: "",
						url: "http://localhost:3000/games"
					}
				}
				res.status(202).send(response);	
			}
		);
	});
}