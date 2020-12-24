import { SET_AUTHENTICATED_USER, SET_UNAUTHENTICATED_USER, SET_USER, LOADING_USER, LIKE_SCREAM, UNLIKE_SCREAM } from '../types'

const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
}

const userReducer = function(state = initialState, action){
    switch(action.type){
        case LOADING_USER:   
            return {
                ...state,
                loading: true,
            }
            
        case SET_AUTHENTICATED_USER:
            return {
                ...state,
                authenticated: true
            }

        case SET_UNAUTHENTICATED_USER:
            return initialState

        case SET_USER:   
            return {
                ...state,
                loading: false,
                ...action.payload
            }
            
        case LIKE_SCREAM:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        screamId: action.payload.screamId
                    }
                ]
            }    
        
        case UNLIKE_SCREAM:
            return {
                ...state,
                likes: state.likes.filter((like) => like.screamId !== action.payload.screamId)
            }

        default:
            return state    
    }
}

export default userReducer