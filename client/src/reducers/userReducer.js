const initState = {
  id: '',
  username: '',
  email: ''
}

export default (state = initState, actions) => {
  switch (actions.type) {
    case 'INPUT_USER':
      return {...state, id: actions.payload.id, username: actions.payload.username, email: actions.payload.email}
    default:
      return state
  }
}