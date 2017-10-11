const initState = {
  email: '',
  photoURL: '',
  userId: '',
  username: ''
}

export default (state = initState, actions) => {
  switch (actions.type) {
    case 'INPUT_USER_DATA':
      return {
        ...state,
        email: actions.payload.email,
        photoURL: actions.payload.photoURL,
        userId: actions.payload.userId,
        username: actions.payload.username
      }
    default:
      return state
  }
}