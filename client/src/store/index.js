import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import todoReducers from '../reducers/todo'

const store = createStore(todoReducers, applyMiddleware(thunk))
export default store