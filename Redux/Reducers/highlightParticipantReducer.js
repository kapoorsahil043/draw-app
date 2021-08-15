import {
    CLEAR_HIGHLIGHT_PARTICIPANT,
    UPDATE_HIGHLIGHT_PARTICIPANT
    
} from '../constants';
import * as constants from '../../assets/common/constants';

const highlightParticipantReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_HIGHLIGHT_PARTICIPANT:
            const nState = Object.assign({},state, {
                data: action.data
            });
            return nState;

        case CLEAR_HIGHLIGHT_PARTICIPANT:
            return state = null;
    }
    return state;
}

export default highlightParticipantReducer;