const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const webserver = express();

webserver.use(express.urlencoded({extended:true}));

const port = 7380;

const staticDataPath = path.join(__dirname, 'votesStatistic.json');

const getVoteStatistic = () => {
	return JSON.parse(
		fs.readFileSync(staticDataPath)
	)
}

const updateStatistic = (vote) => {
	const staticDataParsed = getVoteStatistic();

	staticDataParsed[vote] += 1;

	const newStatistic = {...staticDataParsed};
	const newStatisticStringify = JSON.stringify(newStatistic);

	fs.writeFileSync(staticDataPath, newStatisticStringify)
}

webserver.get('/variants', (req, res) => {
	const staticDataParsed = getVoteStatistic();

    res.send(`Variant_1: ${Object.keys(staticDataParsed)[0]}, Variant_2 ${Object.keys(staticDataParsed)[1]}`)
})


webserver.get('/stats', (req, res) => { 
	const staticDataParsed = getVoteStatistic();

    res.send(staticDataParsed)
})


webserver.get('/vote', (req, res) => { 
	res.send(
		`<form action="http://localhost:7380/makeVote" method="post" target=example>
			<input type="radio" name="vote" value="TRAMP" id="TRAMP">
			<label for="TRAMP">TRAMP</label>
			<input type="radio" name="vote" value="BIDEN" id="BIDEN">
			<label for="BIDEN">BIDEN</label>
			<button type="submit">VOTE</button>
		</form>`
	)
})

webserver.post('/makeVote', (req, res) => { 
    const vote = req.body.vote;

	updateStatistic(vote);

	const staticDataParsed = getVoteStatistic();

	res.send(staticDataParsed)
})

webserver.listen(port,()=>{
    console.log('Server started')
});

