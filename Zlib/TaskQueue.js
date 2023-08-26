const EventEmitter = require('events');

class TaskQueue extends EventEmitter {
	constructor() {
		super();

		this.tasksQueue = [];
		this.tasksRunPull = [];
		this.isMaxTaskIsRunning = false;
		this.maxTasksNumber = 4;
		this.numOfZipProcess = 1;
	}

	addTask(task) {
		this.tasksQueue.push(task);
		this.startNextTask();
	}

	startNextTask() {
		if(!this.isMaxTaskIsRunning) {
			if (!this.tasksQueue.length && !this.tasksRunPull.length) {
				this.numOfZipProcess = 1;

				return this.emit('done');
			}

			if(!this.tasksQueue.length)
				return

			const newTaskForRun = this.tasksQueue.pop();

			this.tasksRunPull.push(newTaskForRun);

			if(this.tasksRunPull.length >= this.maxTasksNumber)
				this.isMaxTaskIsRunning = true;

			const numOfZipProcess = this.numOfZipProcess;
			this.numOfZipProcess +=1;
			process.stdout.write(`Start of zip process number ${numOfZipProcess} \n`);

			newTaskForRun().then(() => {
				process.stdout.write(`Finish of zip process number ${numOfZipProcess} \n`);

				this.tasksRunPull.shift();

				if(this.isMaxTaskIsRunning === true && this.tasksRunPull.length < this.maxTasksNumber)
					this.isMaxTaskIsRunning = false;

				this.startNextTask();
			})
		} 
	}
}

module.exports={
    TaskQueue,
}