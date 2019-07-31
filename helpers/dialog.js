const prompt = require('../prompt/index')

const InputBox = (title, label, parent, callback) => {
	prompt({ title, label, type: "input" }, parent)
	.then((result) => callback(result))
	.catch(error => console.log(error))
}



module.exports = { InputBox }