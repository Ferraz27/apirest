const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');

exports.signup = (req, res, next) => {

	const inputUser = {
		email: req.body.email,
		password: req.body.password
	}

	mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
		conn.query('SELECT * FROM users WHERE email = ?',
			[inputUser.email],
			(error, result) => {
				if (result.length > 0) res.status(409).send({message: "This email is already being used"})
				else{
					bcrypt.hash(inputUser.password, 10, (errBcrypt, hash)=>{
						if(errBcrypt) return res.status(500).send({error: errBcrypt})
							conn.query('INSERT INTO users (email, password)  VALUES (?,?)',
						[req.body.email, hash],
						(error, results)=>{
							const response = {
								message: "User inserted sucessfully",
								insertedUser: inputUser,
								request: {
									type: "GET",
									description: "",
									url: "http://localhost:3000/users"
								}
							}
							if(error) return res.status(500).send({error: error});
							return res.status(201).send(response)
						});
					});
				}
			}
		);
		
	});

}

exports.login = (req, res, next) => {

	const inputUser = {
		email: req.body.email,
		password: req.body.password
	}

	mysql.getConnection((error, conn) => {
		if (error) return res.status(500).send({ error: error });
		conn.query('SELECT * FROM users WHERE email = ?',[inputUser.email], (error, result, fields) => {
			conn.release();
			if (error) return res.status(500).send({ error: error });
			if (result.length == 0) return res.status(401).send({message: "Authentication failed"});
			bcrypt.compare(inputUser.password, result[0].password, (err, results) => {
				if(err) return res.status(401).send({message: "Authentication failed"});
				if(result) {
					let token = jwt.sign({
						userId: result[0].iduser,
						email: result[0].email
					}, 'secret',
					{
						expiresIn: '1h'
					});
					return res.status(200).send({message: "Authenticated with success", token: token});
				}
				return res.status(401).send({message: "Authentication failed"});
			});
		});
	});
}