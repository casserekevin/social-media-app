import { LOADING_UI, STOP_LOADING_UI, OK_UI, ERROR_UI, LOADING_DATA, SET_SCREAMS, SET_SCREAM, POST_SCREAM, DELETE_SCREAM, LIKE_SCREAM, UNLIKE_SCREAM } from '../types'
import axios from 'axios'

export const getScreams = () => (dispatch) => {
    dispatch({
        type: LOADING_DATA
    })
    axios.get('/screams')
    .then((result) => {
        dispatch({
            type: SET_SCREAMS,
            payload: result.data
        })
    })  
    .catch((error) => {
        console.error(error)
        dispatch({
            type: SET_SCREAMS,
            payload: []
        })
    })
}

export const getScream = (screamId) => (dispatch) => {
    dispatch({
        type: LOADING_UI
    })

    axios.get(`/scream/${screamId}`)
    .then((result) => {
        dispatch({
            type: SET_SCREAM,
            payload: result.data
        })
        dispatch({
            type: STOP_LOADING_UI
        })

    })
    .catch((error) => {
        console.error(error)
    })
}

export const postScream = (newScream) => (dispatch) => {
    dispatch({
        type: LOADING_UI
    })
    axios.post('/scream', newScream)
    .then((result) => {
        dispatch({ 
            type: OK_UI
        })
        dispatch({
            type: POST_SCREAM,
            payload: result.data
        })
    })
    .catch((error) => {
        dispatch({
            type: ERROR_UI,
            payload: error.response.data
        })
    })

}

export const deleteScream = (screamId, callback) => (dispatch) => {
    axios.delete(`/scream/${screamId}`)
    .then((result) => {
        dispatch({
            type: DELETE_SCREAM,
            payload: screamId
        })

        if(callback !== undefined){
            callback()
        }
    })
    .catch((error) => {
        console.error(error)
    })
}

export const likeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/like`)
    .then((result) => {
        dispatch({
            type: LIKE_SCREAM,
            payload: result.data
        })
    })
    .catch((error) => {
        console.error(error)
    })
}

export const unlikeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/unlike`)
    .then((result) => {
        dispatch({
            type: UNLIKE_SCREAM,
            payload: result.data
        })
    })
    .catch((error) => {
        console.error(error)
    })
}

export const OK_UI_func = () => (dispatch) => {
    dispatch({ 
        type: OK_UI
    })
}


