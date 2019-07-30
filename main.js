const { app, Menu, Tray, BrowserWindow } = require("electron")
const { InputBox } = require('./helpers/dialog')
const { insertTask } = require('./helpers/file')
const Sentry = require('@sentry/electron')
const fs = require('fs')
const { resolve, basename, join } = require('path')
Sentry.init({ dsn: 'https://f7371582bd7346f2949ea5d846928f01@sentry.io/1517222' })
let mainTray = null
//app.disableHardwareAcceleration()

const render = (tray = mainTray) => {
	let todos = []
	if(fs.existsSync('./todo.json')){
		todos = JSON.parse(fs.readFileSync('./todo.json')).tasks
		todos = todos.map(todo => ({label: todo.task, type: 'normal' }))
	}

	const contextMenu = Menu.buildFromTemplate([
		{ 
			label: 'Add new task', type: 'normal', click: () => {	
				try{	
					InputBox("New Task", "Type the task name", new BrowserWindow({ show: false }), (task) => {
						const object = { finished: false, task: task }
						insertTask(object)
						
						render()
					})

				}
				catch(err){ console.log(err)}
			} 
		},
		{
			type: "separator"
		},
		...todos
	  ])
	//tray.setToolTip('This is my application.')
	
	tray.setContextMenu(contextMenu)
	
}

app.on("ready", () => {
	

	mainTray = new Tray(resolve(__dirname, 'assets','checkedTemplate.png'))
	render(mainTray)
})

