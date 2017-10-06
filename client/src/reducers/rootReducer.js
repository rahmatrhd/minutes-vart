import { combineReducers } from 'redux'
import userReducer from './userReducer'

const rootReducer = combineReducers({
  userStore: userReducer
})

export default rootReducer