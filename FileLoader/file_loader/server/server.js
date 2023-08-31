const WebSocket = require('ws');
const express = require("express");
const multer = require('multer');
const path = require('path');
const busboy = require('connect-busboy');
const fs = require('fs');

const PORT = 7380;
const WEB_SOCKET_PORT = 5632;
const server = express();


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

server.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, application/json');
	next();
})

server.use(multer({storage:storageConfig}).single("file"));

server.use(express.urlencoded({extended:true}));

server.use(busboy());

server.post('/page', (req, res) => {
	if (req.busboy) {
		req.pipe(req.busboy);
		
		req.busboy.on('file', (name, file, info) => {
		  console.log('here')
		});
		req.busboy.on('field', (name, value, info) => {
			console.log('here2')
		});

	  }
})

server.get('/page', (req, res) => {
	console.log(req.query)
})

server.listen(PORT, () => {
	console.log(`Server start on port ${PORT}`)
})
