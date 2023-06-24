const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const webserver = express();

webserver.use(express.urlencoded({extended:true}));

const port = 7380;

const staticDataPath = path.join(__dirname, 'votesStatistic.json');

const getVoteStatistic = () => {
	return JSON.parse(
		fs.readFileSync(staticDataPath)
	)
}

const setNewStatistic = (vote) => {
	const staticDataParsed = getVoteStatistic();

	staticDataParsed[vote] += 1;
	
	fetch("http://localhost:7380/vote", {
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
	const staticDataParsed = getVoteStatistic();

    res.send(`Variant_1: ${Object.keys(staticDataParsed)[0]}, Variant_2 ${Object.keys(staticDataParsed)[1]}`)
})

webserver.get('/stats', (req, res) => { 
	const staticDataParsed = getVoteStatistic();

    res.send(staticDataParsed)
})

webserver.get('/page', (req, res) => {
	res.send(
		`<form onsubmit="return false;">
			<input type="radio" name="vote" value="TRAMP" id="TRAMP">
			<label for="TRAMP">TRAMP</label>
			<input type="radio" name="vote" value="BIDEN" id="BIDEN">
			<label for="BIDEN">BIDEN</label>
			<button onclick="${setNewStatistic('TRAMP')}">VOTE FOR TRAMP</button>
			<button onclick="${setNewStatistic("BIDEN")}">VOTE FOR BIDEN</button>
		</form>
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
	console.log(req.body);

	if(Object.keys(req.body).length) {
		const newStatisticString = JSON.parse(req.body);
		updateStatistic(newStatisticString);
	}
	// res.send("");

	fetch("http://localhost:7380/page");
})

webserver.listen(port,()=>{
    console.log('Server started')
});

