const zlib = require('zlib');
const gzip = zlib.createGzip();
const path = require('path');
const { resolve } = path;

const fs = require('fs');
const { readdir } = require('fs').promises;
const { stat } = require('fs').promises;

const { TaskQueue } = require('./TaskQueue');
const taskQueue = new TaskQueue();

process.stdout.write("Please write absolute path to a folder:"+ "\n")
process.stdin.resume();

const checkFileAndZipIt = (path) => {
	const resultFilePath = `${path}.gz`;

	fs.stat(resultFilePath, (err, stats) => {
		if (err) {
			const gzipTask = async () => {
				return new Promise (res => {
					const readStream = fs.createReadStream(path)
					const writeStream = fs.createWriteStream(resultFilePath);
					

					 readStream.pipe(zlib.createGzip()).pipe(writeStream);

					 writeStream.on('finish', () => res());
				})
			}

			taskQueue.addTask(gzipTask);
		} else {
			const zipFileBirthData = stats.mtimeMs;

			fs.stat(path, (err, stats) => {
				const originalFileModifyData = stats.mtimeMs;

				if (zipFileBirthData < originalFileModifyData) {
					const gzipTask = async () => {
						return new Promise (res => {
							const readStream = fs.createReadStream(path)
							const writeStream = fs.createWriteStream(resultFilePath);
							
		
							 readStream.pipe(zlib.createGzip()).pipe(writeStream);
		
							 writeStream.on('finish', () => res());
						})
					}
					console.log("New zip file will be added");

					taskQueue.addTask(gzipTask);
				} else
				console.log("Zip file was added");
			})
		}
	})
}

const checkItemsInFolderAndZipFiles = async (path) => {
	const subItems = await readdir(path);

	await Promise.all(subItems.map(async (subItem) => {
		if(subItem.substring(subItem.length - 3) === '.gz')
			return;

        const absolutePathToSubitem = resolve(path, subItem);

       return (await stat(absolutePathToSubitem)).isDirectory()
			? checkItemsInFolderAndZipFiles(absolutePathToSubitem)
			: checkFileAndZipIt(absolutePathToSubitem);
    }));
}

process.stdin.on("data", async argPath => {
	const pathToFolders = argPath.toString().trim();

	checkItemsInFolderAndZipFiles(pathToFolders);

	taskQueue.on('done', () => {
		process.stdout.write("Zipping done")
		process.exit(1);
	});
})