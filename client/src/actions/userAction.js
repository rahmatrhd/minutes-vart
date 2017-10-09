import firebase from './firebaseConfig'

export const set_user = (data) => (
  {
    type: 'INPUT_USER',
    payload: {
      username: data.username,
      email: data.email,
      photoURL: data photoURL,
      userId: data.id
    }
  }
)

export const getUserData = (payload) => {
  return (dispatch, getState) => {
    let ref = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        
      }
    })
  }
}