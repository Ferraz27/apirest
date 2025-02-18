const jwt = require('jsonwebtoken');

exports.required = (req, res, next) => {
	

	try{
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, "secret");
		req.user = decode;
		next();

	} catch(error){
		res.status(401).send({message: "Authentication failed"})
	}

}

exports.optional = (req, res, next) => {
	

	try{
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, "secret");
		req.user = decode;
		next();

	} catch(error){
		next();
	}

}