export const todoToStore = payload => {
  let id = payload.userId
  let usersTodo = {
    backlog: [],
    done: [],
    onProgress: [],
    todo: []
  }

  let list = Object.entries(payload.todoList)

  list.forEach(li => {
    if (li[1][1].status === 'done' && li[1][1].user.userId === id) {
      let done = li[1]
      done.taskId = li[0]
      usersTodo.done.push(done)
    } else if (li[1][1].status === 'onProgress' && li[1][1].user.userId === id) {
      let progress = li[1]
      progress.taskId = li[0]
      usersTodo.onProgress.push(progress)
    } else if (li[1][1].status === 'todo' && li[1][1].user.userId === id) {
      let todo = li[1]
      todo.taskId = li[0]
      usersTodo.todo.push(todo)
    } else if (li[1][1].status === 'backlog' && li[1][1].user.userId === id) {
      let backlog = li[1]
      backlog.taskId = li[0]
      usersTodo.backlog.push(backlog)
    }
  })

  return {
    type: 'USERS_TODO',
    payload: usersTodo
  }
}