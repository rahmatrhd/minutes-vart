const admin = require('firebase-admin')
const db = admin.database()

module.exports = (req, res) => {
	const { historyId, todo } = req.body

	const promises = Object.keys(todo)
	.filter(key => todo[key].status)
	.map(key => {
		return new Promise((resolve, reject) => {
			console.log('todo inside', todo)
			const taskId = db.ref('kanban').push().key
			db.ref(`kanban/${taskId}`).set({
				status: 'backlog',
				task: todo[key].task,
				taskId: taskId,
				user: {
					userId: todo[key].userId,
					name: todo[key].userName
				}
			})
			.then(() => {
				db.ref(`history/${historyId}`).update({status: true})
				resolve(true)
			})
		})
	})
	
	console.log('promises', promises)

	Promise.all(promises)
	.then(results => res.send(true))
	.catch(err => res.send(err))
}