const express = require('express');

const path = require('path');

const dataVAlidation = require('./dataValidation');
const getForm = require('./getForm');

const webserver = express();

webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());

const port = 7380;

const pageWithData= path.join(__dirname, 'dataPage.html');

webserver.get('/dataPage', (req, res) => {
	res.sendFile(pageWithData)
})

webserver.get('/page', (req, res) => {
	const {name, pass, email} = req.query

	const isQueryParams = !!name || !!pass || !!email;

	if(!isQueryParams) {
		const form = getForm();

		return res.send(form);
	}

	const typeOfFormError = dataVAlidation(req.query);

	if (typeOfFormError.isError) {
		const form =  getForm(typeOfFormError, name, pass, email);

		return res.send(form)
	}

	// const queryParams = new URLSearchParams();

	// queryParams.append('name', name);
	// queryParams.append('pass', pass);
	// queryParams.append('email', email);
	
	// return res.redirect(302, '/dataPage?'+ queryParams);

	return res.send(`<div>You registered like ${name}</div>`)
})

webserver.listen(port,()=>{
    console.log('Server started')
});
