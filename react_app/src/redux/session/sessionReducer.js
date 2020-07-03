import {SIGN_IN, SIGN_OUT} from './sessionTypes'

const initialState = {
    isLoggedIn: false,
}

const sessionReducer = (state=initialState, action) => {
    switch(action.type){
        case SIGN_IN:
            return {
                ...state,
                isLoggedIn: !state.isLoggedIn
            }
        case SIGN_OUT:
            return {
                ...state,
                isLoggedIn: !state.isLoggedIn
            }
        default: return state
    }
}

export default sessionReducer