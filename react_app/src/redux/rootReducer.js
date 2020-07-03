import {combineReducers} from 'redux'
import counterReducer from './counter/counterReducer'
import sessionReducer  from './session/sessionReducer'

const rootReducer = combineReducers({
    counter: counterReducer,
    session: sessionReducer
})

export default rootReducer