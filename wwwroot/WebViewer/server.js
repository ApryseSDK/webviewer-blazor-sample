const express = require('express');
const opn = require('opn');
const ip = require('ip');

const app = express();

const options = process.argv.reduce((acc, arg) => {
	const pair = arg.split('=');
	if (pair.length === 2) {
		acc[pair[0]] = pair[1];
	}
	return acc;
}, {});

app.get('/ip', (req, res) => {
	res.send(ip.address());
});

app.get('/', (req, res) => {
	res.redirect('/samples');
});

app.get(/\/samples(.*)(\/|\.html)$/, (req, res, next) => {
	if (req.query.key || !options.key) {
		next();
	} else {
		if (req.originalUrl.slice(-10) === 'index.html') {
			res.redirect(`${req.originalUrl}?key=${options.key}`)
		} else {
			res.redirect(`./index.html?key=${options.key}`)
		}
	}
});

app.use('/samples', express.static('samples'));
app.use('/doc', express.static('doc'));
app.use('/lib', express.static('lib'));

app.listen(3000, '0.0.0.0', (err) => {
	if (err) {
		console.error(err);
	} else {
		console.info(`Listening at localhost:3000 (http://${ip.address()}:3000)`);
		if (process.argv[2] === 'samples') {
			opn(`http://localhost:3000/samples`);
		} else if (process.argv[2] === 'doc') {
			opn('http://localhost:3000/doc');
		}
	}
});