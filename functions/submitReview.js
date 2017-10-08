const admin = require('firebase-admin')
const db = admin.database()

module.exports = (req, res) => {
	const { todo } = req.body

	const promises = Object.keys(todo)
	.filter(key => todo[key].status)
	.map(key => {
		return new Promise((resolve, reject) => {
			const taskId = db.ref('kanban').push().key
			resolve(db.ref(`kanban/${taskId}`).set({
				status: 'backlog',
				task: todo.task,
				taskId,
				user: {
					userId: todo[key].userId,
					name: todo[key].userName
				}
			}))
		})
	})

	Promise.all(promises)
	.then(results => res.send(true))
	.catch(err => res.send(err))
}