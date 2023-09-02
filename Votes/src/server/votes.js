const express = require('express');
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
		fs.readFileSync(variantsDataPath, { encoding: 'utf8', flag: 'r' })
	)
}

const getVoteStatistic = () => {
	return JSON.parse(
		fs.readFileSync(staticDataPath, { encoding: 'utf8', flag: 'r' })
	)
}

const updateStatistic = (id) => {
	const staticDataParsed = getVoteStatistic();

	staticDataParsed[id]['votes'] = +staticDataParsed[id]['votes'] + 1;

	fs.writeFileSync(staticDataPath, JSON.stringify(staticDataParsed))
}

webserver.get('/variants', (req, res) => {
	const votesVariantsParsed = getVoteVariants();

    res.send(votesVariantsParsed)
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
			<busket><TRAMP>${voteStatistic[1]['votes']}}</TRAMP><BIDEN>${voteStatistic[2]['votes']}}</BIDEN></busket>
		`
		res.send(xmlResponse);
    } else if (requestAccept === "text/html" ) {
		res.setHeader("Content-Disposition", "attachment");
		res.setHeader("Content-Type", "text/html");

		const htmlResponse = `
			<div>TRAMP: ${voteStatistic[1]['votes']}</div>
			<div>BIDEN: ${voteStatistic[2]['votes']}</div>
		`
		res.send(htmlResponse);
    } else 
		res.send('Hello')
})

webserver.post('/vote', (req, res) => {
	const {id} = req.body;

	updateStatistic(id);

	res.send('')
})

webserver.listen(port,()=>{
    console.log('Server started')
});

