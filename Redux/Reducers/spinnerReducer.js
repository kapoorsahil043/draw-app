import {
    SHOW_SPINNER,
    HIDE_SPINNER
    
} from '../constants';
import * as constants from '../../assets/common/constants';
import AsyncStorage from '@react-native-community/async-storage';

const spinnerReducer = (state = {}, action) => {
    switch (action.type) {
        case HIDE_SPINNER:
            return state = false;

        case SHOW_SPINNER:
            return state = true;
    }
    return state;
}

export default spinnerReducer;