const defaultState = {
  todo: []
}

const passwordReducer = (state=defaultState, action) => {
  switch (action.type) {
    case 'UPDATE':
      const dataPayload = action.payload.passwordData
      const newStoreData = {...state, todo: dataPayload}
      return newStoreData
    default: 
      return state
  }
}

export default passwordReducer