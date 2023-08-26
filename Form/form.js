const express = require('express');

const path = require('path');

const dataVAlidation = require('./dataValidation');
const getForm = require('./getForm');

const webserver = express();

webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());

const port = 7380;

webserver.get('/dataPage', (req, res) => {
	const {name, pass, email} = req.query;

	const dataPage = `<div>
		<p>NAME:</p>
		<div>${name}</div>
		<p>PASS:</p>
		<div>${pass}</div>
		<p>EMAIL:</p>
		<div>${email}</div>
	</div>`

	res.send(dataPage)
})

webserver.get('/page', (req, res) => {
	const form = getForm();

	return res.send(form);
})

webserver.post('/page', (req, res) => {
	const {name, pass, email} = req.body;

	const isQueryParams = !!name || !!pass || !!email;

	if(!isQueryParams) {
		const form = getForm();

		return res.send(form);
	}

	const typeOfFormError = dataVAlidation(req.body);

	if (typeOfFormError.isError) {
		const form =  getForm(typeOfFormError, name, pass, email);

		return res.send(form)
	}

	const queryParams = new URLSearchParams();

	queryParams.append('name', name);
	queryParams.append('pass', pass);
	queryParams.append('email', email);
	
	return res.redirect(302, '/dataPage?'+ queryParams);
})

webserver.listen(port,()=>{
    console.log('Server started')
});
