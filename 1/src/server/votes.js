const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const webserver = express();

webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());

const port = 7380;

const staticDataPath = path.join(__dirname, 'votesStatistic.json');
const variantsDataPath = path.join(__dirname, 'votesVariants.json');
const pageWithVotesButtonsPath = path.join(__dirname, 'page.html');

const getVoteVariants = () => {
	return JSON.parse(
		fs.readFileSync(variantsDataPath)
	)
}

const getVoteStatistic = () => {
	return JSON.parse(
		fs.readFileSync(staticDataPath)
	)
}

const setNewStatistic = (vote) => {
	const staticDataParsed = getVoteStatistic();

	staticDataParsed[vote] = +staticDataParsed[vote] + 1;
	
}

const updateStatistic = (staticDataParsed) => {
	const newStatistic = {...staticDataParsed};
	const newStatisticStringify = JSON.stringify(newStatistic);

	fs.writeFileSync(staticDataPath, newStatisticStringify)
}

webserver.get('/variants', (req, res) => {
	const staticVariantsParsed = getVoteVariants();

    res.send(staticVariantsParsed)
})

webserver.get('/stats', (req, res) => { 
	const staticDataParsed = getVoteStatistic();

    res.send(staticDataParsed)
})

webserver.get('/page', (req, res) => {
	res.sendFile(pageWithVotesButtonsPath)
})

webserver.post('/vote', (req, res) => {
	const {voteName} = req.body;

	updateStatistic(voteName);

	console.log(getVoteStatistic(), 'XXX')
})

webserver.listen(port,()=>{
    console.log('Server started')
});

