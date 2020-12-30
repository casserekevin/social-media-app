import { LOADING_DATA, SET_SCREAMS, SET_SCREAM, POST_SCREAM, DELETE_SCREAM, LIKE_SCREAM, UNLIKE_SCREAM, SUBMIT_COMMENT } from '../types'

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
                ...state,
                scream: action.payload
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

            if(state.scream.screamId === action.payload.screamId) {
                state.scream = action.payload
            }

            return {
                ...state
            }

        case SUBMIT_COMMENT:
            return {
                ...state,
                scream: {
                    ...state.scream,
                    comments: [
                        action.payload,
                        ...state.scream.comments
                    ]
                }
            }

        default:
            return state
    }
}

export default dataReducer