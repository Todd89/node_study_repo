const WebSocket = require('ws');
const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const progress = require('progress-stream');

const PORT = 7380;
const WEB_SOCKET_PORT = 7381;
const server = express();

const uploadsDataPath = path.join(__dirname, 'uploads.json');

server.use(express.urlencoded({extended:true}));
server.use(express.json());

server.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "X-Unique-Id, Content-Type");
	next();
});

server.use(express.static(path.join(__dirname, "..", "build")));
server.use(express.static("public"));

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const fileUpload = multer({storage:storageConfig}).single('file'); 

let clients = [];
let timer = 0;

const getUploadsData = () => {
	return JSON.parse(
		fs.readFileSync(uploadsDataPath, { encoding: 'utf8', flag: 'r' })
	)
}

const uploadHandler = (fileProgress, res, err, uniqueId) => {
	if (err)
		return res.status(500);

	const uploadsData = getUploadsData();

	const fileDescription = fileProgress.body.description;
	const originFileName = fileProgress.file.originalname;

	const uploads = uploadsData.uploads;
	const indexOfSameFileName = uploads.findIndex(file => file.originFileName === originFileName);

	const fileData = {
		fileDescription,
		originFileName,
	}

	if(indexOfSameFileName === -1)
		uploads.push(fileData);
	else {
		uploads.splice(indexOfSameFileName, 1, fileData)
	}

	const stringifyUploadsData = JSON.stringify(uploadsData);

	fs.writeFileSync(uploadsDataPath, stringifyUploadsData)

	const client = clients.find(client => client.uniqueId === uniqueId);
	client.connection.close();
	client.connection = null;

	clients = clients.filter(client => client.connection);

	res.send(stringifyUploadsData);
}

server.get('/getFilesList', (req, res) => {
	const uploadsData = getUploadsData();
	const stringifyUploadsData = JSON.stringify(uploadsData);

	res.send(stringifyUploadsData);
})

server.post('/uploadFile', (req, res) => {
	try {
		var fileProgress = progress();
		const fileLength = +req.headers['content-length'];
		const uniqueId = req.headers['x-unique-id'];
	
		req.pipe(fileProgress);
	
		fileProgress.headers = req.headers;
	
		fileProgress.on('progress', info => {
			const percentageOfTransferred = Math.floor(info.transferred * 100 / fileLength);
			
			clients.find(client => client.uniqueId === uniqueId)?.connection.send(percentageOfTransferred);
		});
	
		fileUpload(fileProgress, res, err => uploadHandler(fileProgress, res, err, uniqueId));
	} catch (err) {
		console.log(err);
	}
})

server.post('/loadFile', (req, res) => {
	const fileName = req.body.name;

	const pathToFile = path.resolve(__dirname, 'uploads', fileName);

	const readStream = fs.createReadStream(pathToFile);

	readStream
		.on('open', function (status) {
			if(status === 4) {
				readStream.pipe(res).on('error', (err) => {
					console.log('Stream has been failed');
	
					res.sendStatus(500)
				});
			} else
				res.sendStatus(500)
		 })
		.on('end', function () {
			readStream.unpipe(res);

			console.log('All the data in the file has been read');
		})
		.on('error', err => {
			console.log('Stream has been Failed');

			res.sendStatus(500)
		});
})

const webSocketServer = new WebSocket.Server({ port: WEB_SOCKET_PORT });

webSocketServer.on('connection', connection => { 
	connection.on('message', function(message) {
		const uniqueId = JSON.parse(message).uniqueId;

		if(uniqueId) {
			clients.push({
				connection: connection,
				uniqueId: uniqueId,
				lastKeepalive: Date.now(),
			});
	
			connection.send('Connection established');
		}

		if (message === "KEEP_ME_ALIVE") {
			clients.forEach(client => {
				if (client.connection === connection)  
					client.lastKeepalive = Date.now();
			});
		}
	})
});

setInterval(()=>{
    timer++;

    clients.forEach(client => {
        if ((Date.now() - client.lastKeepalive) > 2000) {
            client.connection.terminate();
            client.connection=null;
            
			console.log(`Websocket connection ${client.uniqueId} failed`);
        }
    });

    clients = clients.filter(client => client.connection);
}, 1000);

server.listen(PORT, () => {
	console.log(`Server start on port ${PORT}`)
})
