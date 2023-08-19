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

webserver.get('/page', (req, res) => {
	res.sendFile(mainPage)
})

webserver.get('/dataPage', (req, res) => {
	res.sendFile(pageWithData)
})

webserver.post('/page', (req, res) => {
	const data = req.body;

	const isCorrectData = dataVAlidation(data);

	if(!isCorrectData) {
		return res.send(data)
	}

	const queryParams = new URLSearchParams();

	queryParams.append('name', data.name);
	queryParams.append('pass', data.pass);
	queryParams.append('email', data.email);

	return res.redirect(302, '/dataPage?'+ queryParams)
})

webserver.listen(port,()=>{
    console.log('Server started')
});

