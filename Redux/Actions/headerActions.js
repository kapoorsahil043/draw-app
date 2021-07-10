import {
    HIDE_HEADER,
} from '../constants';


export const hideHeader = (payload) => {
    return {
        type: HIDE_HEADER,
        payload
    }
}