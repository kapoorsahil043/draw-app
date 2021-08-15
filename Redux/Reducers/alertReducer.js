import {
    UPDATE_ALERT_LIST,
    CLEAR_ALERT_LIST,
    REMOVE_ALERT_FROM_LIST,
} from '../constants';
import * as constants from '../../assets/common/constants';
import AsyncStorage from '@react-native-community/async-storage';

const alertReducer = (state = {}, action) => {
    //console.log('alertReducer',action);
    switch (action.type) {
        case UPDATE_ALERT_LIST:
            const nState = Object.assign({},state, {
                items: action.items
            });
            AsyncStorage.setItem("UPDATE_ALERT_LIST",JSON.stringify({items:nState.items}))
            return nState;

        case REMOVE_ALERT_FROM_LIST:
            let i = state.items.filter(item => item._id !== action.id)
            AsyncStorage.setItem("UPDATE_ALERT_LIST",JSON.stringify({items:i}))
            return {items:i}
            
        case CLEAR_ALERT_LIST:
            AsyncStorage.removeItem("UPDATE_ALERT_LIST")
            return state = [];
    }
    return state;
}

export default alertReducer;