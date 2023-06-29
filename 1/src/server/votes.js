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

webserver.post('/vote', (req, res) => {
	const {id} = req.body;

	updateStatistic(id);

	res.send('')
})

webserver.listen(port,()=>{
    console.log('Server started')
});

