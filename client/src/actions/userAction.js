export const userData = payload => {
  console.log('userAction>payload>> ', payload)
  return {
    type: 'INPUT_USER_DATA',
    payload: payload
  }
}