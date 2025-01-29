const mysql = require('../mysql').pool;

exports.getDevelopers = (req, res, next) => {
	mysql.getConnection((error, conn) => {
		conn.query('SELECT * FROM developer', (error, result, fields) => {
			conn.release();
			if (error) return res.status(500).send({ error: error });

			const response = {
				quantidade: result.length,
				developers: result.map(dev => {
					return {
						iddeveloper: dev.iddeveloper,
						name: dev.developer_name,
						description: dev.description,
						request: {
							type: "GET",
							description: "Read of a singular developer from the database.",
							url: "http://localhost:3000/developers/" + dev.iddeveloper
						}
					}
				})
			}

			return res.status(200).send(response);
		});
	});
}

exports.getDeveloperById = (req, res, next) => {
	const developerId = req.params.developerId;

	mysql.getConnection((error, conn) => {
		conn.query('SELECT * FROM developer WHERE iddeveloper = ?', [developerId], (error, result, fields) => {
			conn.release();
			if (error) return res.status(500).send({ error: error });
			if (result.length == 0) return res.status(404).send({ error: "There is no developer with such id" });

			const response = {
				iddeveloper: result[0].iddeveloper,
				name: result[0].developer_name,
				description: result[0].description,
				request: {
					type: "GET",
					description: "Read of a singular developer from the database.",
					url: "http://localhost:3000/developers/" + result[0].iddeveloper
				}
			}
			return res.status(200).send(response);
		});
	});
}

exports.postDeveloper = (req, res, next) => {
	const inputDeveloper = {
		name: req.body.name,
		description: req.body.description
	}

	mysql.getConnection((error, conn) => {
		if (error) return res.status(500).send({ error: error });
		conn.query('INSERT INTO developer (developer_name, description) VALUES (?, ?)', [inputDeveloper.name, inputDeveloper.description], (error, result, fields) => {
			conn.release();
			if (error) return res.status(500).send({ error: error });

			const response = {
				message: "Developer inserted successfully",
				insertedDeveloper: inputDeveloper,
				request: {
					type: "GET",
					description: "Read all developers",
					url: "http://localhost:3000/developers"
				}
			}
			return res.status(201).send(response);
		});
	});
}

exports.patchDeveloperById = (req, res, next) => {
    const inputDeveloper = {
        name: req.body.name,
        description: req.body.description
    }

    const idToChange = req.body.idToChange;

    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query('UPDATE developer SET developer_name = ?, description = ? WHERE iddeveloper = ?', [inputDeveloper.name, inputDeveloper.description, idToChange], (error, result, fields) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });

            const response = {
                message: "Developer updated successfully",
                updatedDeveloper: inputDeveloper,
                request: {
                    type: "GET",
                    description: "Read all developers",
                    url: "http://localhost:3000/developers"
                }
            }
            return res.status(202).send(response);
        });
    });
}

exports.deleteDeveloperById = (req, res, next) => {
    const idToDelete = req.body.idToDelete;

    mysql.getConnection((error, conn) => {
        conn.query('DELETE FROM developer WHERE iddeveloper = ?', [idToDelete], (error, result, fields) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });

            const response = {
                message: "Developer successfully deleted",
                developerId: idToDelete,
                request: {
                    type: "GET",
                    description: "Read all developers",
                    url: "http://localhost:3000/developers"
                }
            }
            return res.status(202).send(response);
        });
    });
}