const zlib = require('zlib');
const path = require('path');
const { resolve } = path;

const fs = require('fs');

const { TaskQueue } = require('./TaskQueue');
const taskQueue = new TaskQueue();

process.stdout.write("Please write absolute path to a folder:"+ "\n")
process.stdin.resume();

const listOfItems = [];

const checkFileAndZipIt = (path) => {
	const resultFilePath = `${path}.gz`;

	try {
		const stats = fs.statSync(resultFilePath);

		const zipFileBirthData = stats.mtimeMs;

		const existFileStats = fs.statSync(path);

		const originalFileModifyData = existFileStats.mtimeMs;

		if (zipFileBirthData < originalFileModifyData) {
			const gzipTask = async () => {
				return new Promise (res => {
					const readStream = fs.createReadStream(path)
					const writeStream = fs.createWriteStream(resultFilePath);
					

					readStream.pipe(zlib.createGzip()).pipe(writeStream);

					writeStream.on('finish', () => res());
				})
			}

			process.stdout.write("New zip file will be added\n")

			return taskQueue.addTask(gzipTask);
		}

		process.stdout.write("Zip file was added\n")
	} catch (err) {
		const gzipTask = async () => {
			return new Promise (res => {
				const readStream = fs.createReadStream(path)
				const writeStream = fs.createWriteStream(resultFilePath);
				

				 readStream.pipe(zlib.createGzip()).pipe(writeStream);

				 writeStream.on('finish', () => res());
			})
		}

		return taskQueue.addTask(gzipTask);
	}
}

const getItems = (path) => {
	const subItems = fs.readdirSync(path)

	subItems.forEach((itemPath) => {
		const absolutePathToSubitem = resolve(path, itemPath);

		const itemStat = fs.statSync(absolutePathToSubitem);

		if(itemStat.isDirectory())
			return getItems(absolutePathToSubitem);
	
		if(itemPath.substring(itemPath.length - 3) !== '.gz')
			listOfItems.push(absolutePathToSubitem);
	});
}

const checkItemsInFolderAndZipFiles = (path) => {
	getItems(path);

	listOfItems.forEach((itemPath, index) => {
		const itemStat = fs.statSync(itemPath);

		if(!itemStat.isDirectory())
			checkFileAndZipIt(itemPath);

		const isLastHandledItemAndNoTasks = index === listOfItems.length - 1
			&& !taskQueue.tasksQueue.length && !taskQueue.tasksRunPull.length;

		if(isLastHandledItemAndNoTasks) {
			process.stdout.write("Zipping done")
			process.exit(1);
		}
	})
}

process.stdin.on("data", async argPath => {
	const pathToFolders = argPath.toString().trim();

	checkItemsInFolderAndZipFiles(pathToFolders);

	taskQueue.on('done', () => {
		process.stdout.write("Zipping done")
		process.exit(1);
	});
})