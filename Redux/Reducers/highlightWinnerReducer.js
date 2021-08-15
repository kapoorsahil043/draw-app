import {
    CLEAR_HIGHLIGHT_WINNER,
    UPDATE_HIGHLIGHT_WINNER
    
} from '../constants';
import * as constants from '../../assets/common/constants';

const highlightWinnerReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_HIGHLIGHT_WINNER:
            const nState = Object.assign({},state, {
                data: action.data
            });
            return nState;

        case CLEAR_HIGHLIGHT_WINNER:
            return state = null;
    }
    return state;
}

export default highlightWinnerReducer;