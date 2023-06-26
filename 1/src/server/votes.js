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
	
	fetch("http://178.172.195.18:7380/vote", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(staticDataParsed),
	});
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
	res.send(
		`<div>
			<input type="radio" name="vote" value="TRAMP" id="TRAMP">
			<label for="TRAMP">TRAMP</label>
			<input type="radio" name="vote" value="BIDEN" id="BIDEN">
			<label for="BIDEN">BIDEN</label>
			<button onclick="${setNewStatistic('TRAMP')}">VOTE FOR TRAMP</button>
			<button onclick="${setNewStatistic('BIDEN')}">VOTE FOR BIDEN</button>
		</div>
		<div>
			<div>
				<p>TRAMP: ${getVoteStatistic().TRAMP}</p>
				<p>BIDEN: ${getVoteStatistic().BIDEN}</p>
			</div>
		</div>
		`
	)
})

webserver.post('/vote', (req, res) => { 
	if(Object.keys(req.body).length) {
		const newStatisticString = req.body;
		updateStatistic(newStatisticString);
	}

	fetch("http://178.172.195.18:7380/page");
})

webserver.listen(port,()=>{
    console.log('Server started')
});

