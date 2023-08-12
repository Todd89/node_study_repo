import fetch from 'node-fetch';
import express from "express";

import fs from "fs";
import path from "path";

import React from "react";
import ReactDOMServer from "react-dom/server";

import validateSavedRequest from "../src/helper/validateSavedRequest";

import App from "../src/App";

const staticDataPath = path.join(__dirname, 'data.json');

const PORT = 7380;

const app = express();

let mainPage;

const getMainPage = () => {
	mainPage = fs.readFileSync(path.resolve("./build/index.html"), "utf-8");
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use((req, res, next) => {
	getMainPage();
	next();
})
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, application/json');
	next();
})

app.get("/main", (req, res) => {
    res.send(
		mainPage.replace(
			'<div id="root"></div>',
			`<div id="root">${ReactDOMServer.renderToString(<App data={"string"}/>)}</div>`
      )
    );
});

app.get("/getData", (req, res) => {
	fs.readFile(staticDataPath, {encoding: 'utf-8'}, (err, data) => {
		if(err) {
			console.log(Error(err));

			res.status(500).end();
		} else {
			res.send(data)
		}
	})
});

app.post("/saveData", (req, res) => {
	const newData = req.body;

	if(validateSavedRequest(newData)) {
		return res.send({isBadRequest: true});
	}

	const data = fs.readFileSync(staticDataPath, { encoding: 'utf8', flag: 'r' });
	const dataObject = JSON.parse(data);

	const newDataObject = {...dataObject, data: [...dataObject.data, newData]};

	fs.writeFile(staticDataPath, JSON.stringify(newDataObject), (err) => {
		if(err) {
			console.log(Error(err));

			res.status(500).end();
		} else {
			res.send(JSON.stringify(newDataObject));
		}
	});
});

app.post("/sendRequest", (req, resToPage) => {
	const data = req.body;

	if (validateSavedRequest(data)) {
		return resToPage.send({ isBadRequest: true });
	}

	const { method, url, headers, params, body } = data;
	
	const resHeaders = {};

	if (headers.length) {
		for (let i = 0; i < headers.length; i++) {
			const headerName = headers[i].name;
			const headerValue = headers[i].value;
	
			resHeaders[headerName] = headerValue;
		}
	}

	const queryParams = new URLSearchParams();

	if (params.length) {
		for (let i = 0; i < params.length; i++) {
			const paramName = params[i].name;
			const paramValue = params[i].value;
	
			queryParams.append(paramName, paramValue);
		}
	}

	const stringQueryParams = queryParams.toString();

	const finalUrl = stringQueryParams
		? url + '/?' + stringQueryParams
		: url;

	const options = method === "GET"
		? {
			method,
			headers: resHeaders,
		}
		: {
			method,
			headers: resHeaders,
			body,
		}

	fetch(finalUrl, options)
	.then(res => {
			const resHeaders = Array.from(res.headers);
			const { body } = res;

			const gettingResponseData = {
				status: res.status,
				headers: resHeaders,
				body,
			}

			resToPage.send(gettingResponseData)
		})
	.catch(err => {
		resToPage.send({ isBadRequest: true })
		console.log(err)
	})
});

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`);
});
