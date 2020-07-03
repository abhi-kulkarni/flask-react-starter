import {SIGN_IN, SIGN_OUT} from './sessionTypes'


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