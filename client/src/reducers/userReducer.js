const initState = {
  id: '',
  senderName: '',
  message: ''
}

export default (state = initState, actions) => {
  switch (actions.type) {
    case 'INPUT_USER':
      return {...state, id: actions.payload.id, senderName: actions.payload.senderName, message: actions.payload.message}
    default:
      return state
  }
}