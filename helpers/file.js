const fs = require('fs')

const fileExists = (fileName) => {
	try{
		if(fs.existsSync(fileName)){
			return true
		}
		else{
			return false
		}
	}
	catch{
		console.error(err)
	}
}

const insertTask = (tasksGoal) => {
	const FILE_NAME = 'todo.json'	
	
	if(fileExists(FILE_NAME)){
		const tasksObject = JSON.parse(fs.readFileSync('todo.json'))
		tasksObject.tasks.push(tasksGoal)
		fs.writeFileSync(FILE_NAME, JSON.stringify(tasksObject))
	}
	else{
		const DEFAULT_OBJECT = { name: "Geral Tasks", tasks: [tasksGoal] }
		fs.writeFileSync(FILE_NAME, JSON.stringify(DEFAULT_OBJECT))
		tasksObject = DEFAULT_OBJECT
	}
}

module.exports = { insertTask, fileExists }