import { LOADING_DATA, SET_SCREAMS, SET_SCREAM, POST_SCREAM, DELETE_SCREAM, LIKE_SCREAM, UNLIKE_SCREAM } from '../types'

const initialState = {
    screams: [],
    scream: {},
    loading: false
}

const dataReducer = function(state = initialState, action){
    let index = undefined
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

        case POST_SCREAM:
            return {
                ...state,
                screams: [
                    action.payload,
                    ...state.screams
                ]
            }   

        case DELETE_SCREAM:
            index = state.screams.findIndex((scream) => scream.screamId === action.payload)
            state.screams.splice(index, 1)
            return {
                ...state
            }

        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId)
            state.screams[index] = action.payload
            return {
                ...state
            }

        default:
            return state
    }
}

export default dataReducer