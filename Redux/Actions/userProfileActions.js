import {
    CLEAR_USER_PROFILE,
    UPDATE_USER_PROFILE
} from '../constants';

export const updateUserProfile = (payload) => {
    console.log('updateUserProfile',payload);

    return {
        type: UPDATE_USER_PROFILE,
        payload
    }
}

export const clearUserProfile = () => {
    return {
        type: CLEAR_USER_PROFILE
    }
}