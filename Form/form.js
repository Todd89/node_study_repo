const express = require('express');
const fs = require('fs');
const path = require('path');

const dataVAlidation = require('./dataValidation')

const webserver = express();

webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());

const port = 7380;

const mainPage = path.join(__dirname, 'page.html');
const pageWithData= path.join(__dirname, 'dataPage.html');

let savedData = {};

webserver.get('/page', (req, res) => {
	res.sendFile(mainPage)
})

webserver.post('/savedData', (req, res) => {
	res.send(savedData)
})

webserver.post('/clearData', (req, res) => {
	savedData = {...savedData, ...{}};

	res.send('');
})

webserver.get('/dataPage', (req, res) => {
	res.sendFile(pageWithData)
})

webserver.post('/data', (req, res) => {
	const data = req.body;

	savedData = {...savedData, ...{
		name: data.name || '',
		pass: data.pass || '',
		email: data.email || '',
	}};

	const isCorrectData = dataVAlidation(data);

	if(!isCorrectData)
		return res.redirect(301, '/page')

	savedData = {};

	const queryParams = new URLSearchParams();

	queryParams.append('name', data.name);
	queryParams.append('pass', data.pass);
	queryParams.append('email', data.email);

	res.redirect(301, '/dataPage?'+ queryParams)
})

webserver.listen(port,()=>{
    console.log('Server started')
});

