const { app, Menu, Tray, BrowserWindow } = require("electron")
const { InputBox } = require('./helpers/dialog')
const { insertTask } = require('./helpers/file')
const Sentry = require('@sentry/electron')
const fs = require('fs')
const { resolve, basename, join } = require('path')
Sentry.init({ dsn: 'https://f7371582bd7346f2949ea5d846928f01@sentry.io/1517222' })
let mainTray = null
let todos = []
let originalObject = []
app.disableHardwareAcceleration()

const updateJson = () => {
	originalObject.tasks = todos
	//console.log(originalObject)
	fs.writeFile("todo.json", JSON.stringify(originalObject), err => {
	if(err) throw err
	})
}

const render = (tray = mainTray) => {
	//console.log(todos)
	todos = todos
	.map((todo, index) => {
			return ({ 
				label: todo.task || todo.label, type: 'checkbox', click: () => { 
				todos.splice(index, 1)
				updateJson() 
				render() 
			}})
		}
	)
	//console.log(todos)

	const contextMenu = Menu.buildFromTemplate([
		{ 
			label: 'Add new task', type: 'normal', click: () => {	
				try{	
					InputBox("New Task", "Type the task name", new BrowserWindow({ show: false }), (task) => {
						if(!task) return
						const object = { task: task }
						insertTask(object)
						todos.push(object)
						render()
					})

				}
				catch(err){ console.log(err)}
			} 
		},
		{
			type: "separator"
		},
		...todos,
		{
			type: "separator"
		},
		{
      type: 'normal',
      label: 'Close TodoTop',
      role: 'quit',
      enabled: true,
    }
		])
		//console.log(todos)
	//tray.setToolTip('This is my application.')
	
	tray.setContextMenu(contextMenu)
	
}

app.on("ready", () => {
	if(fs.existsSync('./todo.json')){
		originalObject = JSON.parse(fs.readFileSync('./todo.json'))
		todos = originalObject.tasks
	}

	mainTray = new Tray(resolve(__dirname, 'assets','checkedTemplate.png'))
	render(mainTray)
})

