import {  SET_ERRORS, CLEAR_ERRORS_UI, LOADING_UI } from '../types'

const initialState = {
    loading: false,
    errors: null
}

const uiReducer = function(state = initialState, action){
    switch(action.type){
        case SET_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload
            }
        
        case CLEAR_ERRORS_UI:
            return {
                ...state,
                loading: false,
                errors: null
            }

        case LOADING_UI:   
            return {
                ...state,
                loading: true
            }

        default:
            return state    
    }
}

export default uiReducer