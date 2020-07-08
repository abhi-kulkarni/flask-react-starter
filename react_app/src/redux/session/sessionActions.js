import {SIGN_IN, SIGN_OUT, USER_CREATED_SUCCESS, SPINNER_OVERLAY} from './sessionTypes'


export const sign_in = () => {
    return {
        type: SIGN_IN
    }
}

export const sign_out = () => {
    return {
        type: SIGN_OUT
    }
}

export const user_created_success = () => {
    return {
        type: USER_CREATED_SUCCESS
    }
}

export const spinner_overlay = (spinner_state=true) => {
    return {
        type: SPINNER_OVERLAY,
        payload: spinner_state
    }
}