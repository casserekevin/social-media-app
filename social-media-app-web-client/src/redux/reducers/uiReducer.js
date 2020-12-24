import { LOADING_UI, OK_UI, ERROR_UI } from '../types'

const initialState = {
    loading: false,
    errors: null
}

const uiReducer = function(state = initialState, action){
    switch(action.type){
        case LOADING_UI:   
            return {
                ...state,
                loading: true
            }
            
        case OK_UI:
            return initialState

        case ERROR_UI:
            return {
                ...state,
                loading: false,
                errors: action.payload
            }
    
        default:
            return state    
    }
}

export default uiReducer