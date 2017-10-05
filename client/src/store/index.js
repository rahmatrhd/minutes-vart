import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reactReduxFirebase } from 'react-redux-firebase'
import rootReducer from '../reducers/rootReducer'

const firebaseConfig = {
  apiKey: "AIzaSyDQiAP5PfSYOaPItrqLJRU50m4k3asw1Ys",
  authDomain: "minutes-vart.firebaseapp.com",
  databaseURL: "https://minutes-vart.firebaseio.com",
  projectId: "minutes-vart",
  storageBucket: "minutes-vart.appspot.com",
  messagingSenderId: "987319535932"
}


const middleware = applyMiddleware(thunk)
const store = compose(reactReduxFirebase(rootReducers, middleware),)(createStore)

export default store