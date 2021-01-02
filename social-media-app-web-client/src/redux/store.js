import { combineReducers, createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'

import dataReducer from './reducers/dataReducer'
import userReducer from './reducers/userReducer'
import uiReducer from './reducers/uiReducer'


const initialState = {}

const middleware = [thunk]

const reducers = combineReducers({
    data: dataReducer,
    user: userReducer,
    UI: uiReducer
})

const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store