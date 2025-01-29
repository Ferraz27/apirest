//Imports
const express = require('express');
const app = express();
const gamesRoute = require('./routes/games');
const developersRoute = require('./routes/developers')
const publishersRoute = require('./routes/publishers')
const usersRoute = require('./routes/users')
const morgan = require('morgan');
const bodyParser = require('body-parser')


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Routes
app.use('/games', gamesRoute);
app.use('/developers', developersRoute);
app.use('/publishers', publishersRoute);
app.use('/users', usersRoute);

app.use((req, res, next) => {
	const error = new Error('not found');
	error.status = 404;
	next(error)
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	return res.send({
		error: {
			message: error.message
		}
	});
});

module.exports = app;