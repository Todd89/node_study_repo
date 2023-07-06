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
	const variants = fs.readFileSync(variantsDataPath);

	return variants;
}

const getVoteStatistic = () => {
	return JSON.parse(
		fs.readFileSync(staticDataPath)
	)
}


const updateStatistic = (voteName) => {
	const staticDataParsed = getVoteStatistic();

	staticDataParsed[voteName] = +staticDataParsed[voteName] + 1;

	fs.writeFileSync(staticDataPath, JSON.stringify(staticDataParsed))
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

webserver.get('/getStats', (req, res) => {
	const voteStatistic = getVoteStatistic();

	const requestAccept = req.headers.accept;

	if (requestAccept === "application/json" ) {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", " attachment");
        res.send(JSON.stringify(voteStatistic));
    } else if ( requestAccept === "application/xml" ) {
		res.setHeader("Content-Type", "application/xml");
		res.setHeader("Content-Disposition", " attachment");

		const xmlResponse = `
			<busket><TRAMP>${voteStatistic.TRAMP}</TRAMP><BIDEN>${voteStatistic.BIDEN}</BIDEN></busket>
		`
		res.send(xmlResponse);
    } else if (requestAccept === "text/html" ) {
		res.setHeader("Content-Disposition", "attachment");
		res.setHeader("Content-Type", "text/html");

		const htmlResponse = `
			<div>TRAMP: ${voteStatistic.TRAMP}</div>
			<div>BIDEN: ${voteStatistic.BIDEN}</div>
		`
		res.send(htmlResponse);
    } else 
		res.send('Hello')
})

webserver.post('/vote', (req, res) => {
	const {voteName} = req.body;

	updateStatistic(voteName);

	const staticDataParsed = getVoteStatistic();

	res.send(staticDataParsed);
})

webserver.listen(port,()=>{
    console.log('Server started')
});

