import {
    HIDE_HEADER
} from '../constants';
import * as constants from '../../assets/common/constants';

const headerReducer = (state = {}, action) => {
    //console.log('headerReducer');
    switch (action.type) {
        case HIDE_HEADER:
            return state = action.payload; // true or false    
    }
    return state;
}

export default headerReducer;