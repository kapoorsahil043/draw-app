import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import cartItems from './Reducers/cartItem'
import userProfileReducer from './Reducers/userProfileReducer'
import headerReducer from './Reducers/headerReducer'

const reducers = combineReducers({
    cartItems: cartItems,
    userProfileReducer:userProfileReducer,
    headerReducer
})

const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
)

export default store;