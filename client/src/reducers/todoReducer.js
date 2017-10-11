const initState = {
  backlog: [],
  done: [],
  onProgress: [],
  todo: []
}

export default (state = initState, actions) => {
  switch(actions.type) {
    case 'USERS_TODO':
      return {
        ...state,
        backlog: actions.payload.backlog,
        done: actions.payload.done,
        onProgress: actions.payload.onProgress,
        todo: actions.payload.todo
      }
    default:
      return state
  }
}