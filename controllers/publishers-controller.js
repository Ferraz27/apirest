const mysql = require('../mysql').pool;

exports.getPublihshers = (req, res, next) => {
	mysql.getConnection((error, conn) => {
		conn.query('SELECT * FROM publisher', (error, result, fields) => {
			conn.release();
			if (error) return res.status(500).send({ error: error });

			const response = {
				quantidade: result.length,
				publishers: result.map(pub => {
					return {
						idpublisher: pub.idpublisher,
						name: pub.publisher_name,
						description: pub.description,
						request: {
							type: "GET",
							description: "Read of a singular publisher from the database.",
							url: "http://localhost:3000/publishers/" + pub.idpublisher
						}
					}
				})
			}

			return res.status(200).send(response);
		});
	});
}

exports.getPublisherbyId = (req, res, next) => {
	const publisherId = req.params.publisherId;

	mysql.getConnection((error, conn) => {
		conn.query('SELECT * FROM publisher WHERE idpublisher = ?', [publisherId], (error, result, fields) => {
			conn.release();
			if (error) return res.status(500).send({ error: error });
			if (result.length == 0) return res.status(404).send({ error: "There is no publisher with such id" });

			const response = {
				idpublisher: result[0].idpublisher,
				name: result[0].publisher_name,
				description: result[0].description,
				request: {
					type: "GET",
					description: "Read of a singular publisher from the database.",
					url: "http://localhost:3000/publishers/" + result[0].idpublisher
				}
			}
			return res.status(200).send(response);
		});
	});
}

exports.postPublisher = (req, res, next) => {
	const inputPublisher = {
		name: req.body.name,
		description: req.body.description
	}

	mysql.getConnection((error, conn) => {
		if (error) return res.status(500).send({ error: error });
		conn.query('INSERT INTO publisher (publisher_name, description) VALUES (?, ?)', [inputPublisher.name, inputPublisher.description], (error, result, fields) => {
			conn.release();
			if (error) return res.status(500).send({ error: error });

			const response = {
				message: "Publisher inserted successfully",
				insertedPublisher: inputPublisher,
				request: {
					type: "GET",
					description: "Read all publishers",
					url: "http://localhost:3000/publishers"
				}
			}
			return res.status(201).send(response);
		});
	});
}

exports.patchPublisherById = (req, res, next) => {
    const inputPublisher = {
        name: req.body.name,
        description: req.body.description
    }

    const idToChange = req.body.idToChange;

    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query('UPDATE publisher SET publisher_name = ?, description = ? WHERE idpublisher = ?', [inputPublisher.name, inputPublisher.description, idToChange], (error, result, fields) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });

            const response = {
                message: "Publisher updated successfully",
                updatedPublisher: inputPublisher,
                request: {
                    type: "GET",
                    description: "Read all publishers",
                    url: "http://localhost:3000/publishers"
                }
            }
            return res.status(202).send(response);
        });
    });
}

exports.deletePublisherById = (req, res, next) => {
    const idToDelete = req.body.idToDelete;

    mysql.getConnection((error, conn) => {
        conn.query('DELETE FROM publisher WHERE idpublisher = ?', [idToDelete], (error, result, fields) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });

            const response = {
                message: "Publisher successfully deleted",
                publisherId: idToDelete,
                request: {
                    type: "GET",
                    description: "Read all publishers",
                    url: "http://localhost:3000/publishers"
                }
            }
            return res.status(202).send(response);
        });
    });
}