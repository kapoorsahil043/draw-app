import {
    CLEAR_USER_PROFILE,
    UPDATE_USER_PROFILE
} from '../constants';
import * as constants from '../../assets/common/constants';

const userProfileReducer = (state = [], action) => {
    console.log('userProfileReducer');
    switch (action.type) {
        case UPDATE_USER_PROFILE:
            return state = [action.payload];
            
        case CLEAR_USER_PROFILE:
            return state = {image:constants.DEFAULT_USER_IMAGE_URL};    
    }
    return state;
}

export default userProfileReducer;