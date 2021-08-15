import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import cartItems from './Reducers/cartItem'
import userProfileReducer from './Reducers/userProfileReducer'
import headerReducer from './Reducers/headerReducer'
import alertReducer from './Reducers/alertReducer'
import alertLatestDateReducer from './Reducers/alertLatestDateReducer'
import spinnerReducer from './Reducers/spinnerReducer';
import highlightWinnerReducer from './Reducers/highlightWinnerReducer';
import highlightParticipantReducer from './Reducers/highlightParticipantReducer';

const reducers = combineReducers({
    cartItems: cartItems,
    userProfileReducer:userProfileReducer,
    headerReducer,
    alertReducer,
    alertLatestDateReducer,
    spinnerReducer,
    highlightWinnerReducer,
    highlightParticipantReducer
})

const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
)

export default store;