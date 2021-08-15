import {
    UPDATE_ALERT_DATE
} from '../constants';
import * as constants from '../../assets/common/constants';
import AsyncStorage from '@react-native-community/async-storage';

const alertLatestDateReducer = (state = {}, action) => {
    //console.log('alertReducer',action);
    switch (action.type) {
        case UPDATE_ALERT_DATE:
            AsyncStorage.setItem("UPDATE_ALERT_DATE",(action.date))
            return {date:action.date};
    }
    return state;
}

export default alertLatestDateReducer;