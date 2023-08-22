const zlib = require('zlib');
const path = require('path');
const { resolve } = path;

// const { readdir } = require('fs');
// const { promisify } = require('util')
// const promisifyReaddir = promisify(readdir);

const fs = require('fs');
const { readdir } = require('fs').promises;
const { stat } = require('fs').promises;

const gzip = zlib.gzip;

process.stdout.write("Please write absolute path to a folder:"+ "\n")
process.stdin.resume();

const checkFileAndZipIt = (path) => {
	const resultFilePath = `${path}.gz`;
	
	const readStream = fs.createReadStream(path)
	const writeStream = fs.createWriteStream(resultFilePath);

	readStream.pipe(gzip).pipe(writeStream);
}

const checkItemsInFolderAndZipFiles = async (path) => {
	const subItems = await readdir(path);

	await Promise.all(subItems.map(async (subItem) => {
        const absolutePathToSubitem = resolve(path, subItem);

        (await stat(absolutePathToSubitem)).isDirectory()
			? checkItemsInFolderAndZipFiles(absolutePathToSubitem)
			: checkFileAndZipIt(absolutePathToSubitem);
    }));
}

process.stdin.on("data", argPath => {
	const pathToFolders = argPath.toString().trim();

	checkItemsInFolderAndZipFiles(pathToFolders);
})