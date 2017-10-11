import {  applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'

import todoReducer from '../reducers/todoReducer'
import userReducer from '../reducers/userReducer'

const rootReducer = combineReducers({
  userStore: userReducer,
  todoStore: todoReducer
})

const middleware = applyMiddleware(thunk)
const store = createStore(rootReducer, middleware)

export default store