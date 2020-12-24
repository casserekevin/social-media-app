import { SET_SCREAMS, SET_SCREAM, LIKE_SCREAM, UNLIKE_SCREAM, LOADING_DATA } from '../types'

const initialState = {
    screams: [],
    scream: {},
    loading: false
}

const dataReducer = function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_SCREAMS:
            return {
                ...state,
                loading: false,
                screams: action.payload
            }
        case SET_SCREAM:
            return {
                
            }
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            let index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId)
            state.screams[index] = action.payload
            return {
                ...state
            }

        default:
            return state
    }
}

export default dataReducer