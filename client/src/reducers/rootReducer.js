import { combineReducers } from 'redux'
import userReducer from './userReducer'

const rootReducer = combineReducers({
  userStore: userStore
})

export default rootReducer