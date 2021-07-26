import {
    UPDATE_ALERT_DATE
} from '../constants';
import * as constants from '../../assets/common/constants';

const alertLatestDateReducer = (state = {}, action) => {
    //console.log('alertReducer',action);
    switch (action.type) {
        case UPDATE_ALERT_DATE:
            return {date:action.date};
    }
    return state;
}

export default alertLatestDateReducer;