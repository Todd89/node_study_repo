const EventEmitter = require('events');

class TaskQueue extends EventEmitter {
	constructor() {
		super();

		this.tasksQueue = [];
		this.tasksRunPull = [];
		this.isMaxTaskIsRunning = false;
		this.maxTasksNumber = 4;
	}

	addTask(task) {
		this.tasksQueue.push(task);
		this.startNextTask();
	}

	startNextTask() {
		if(!this.isMaxTaskIsRunning) {
			if (this.tasksQueue.length === 0)
				return this.emit('done');

			const newTaskForRun = this.tasksQueue.pop();

			this.tasksRunPull.push(newTaskForRun);

			if(this.tasksRunPull.length >= this.maxTasksNumber)
				this.isMaxTaskIsRunning = true;

			newTaskForRun().then(() => {
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
