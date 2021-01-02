import { LOADING_UI, OK_UI, ERROR_UI, LOADING_USER, SET_AUTHENTICATED_USER, SET_UNAUTHENTICATED_USER, SET_USER, MARK_NOTIFICATIONS_READ } from '../types'
import axios from 'axios'
import dispatcherCreator from '../../util/dispatcherCreator'

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ 
        type: LOADING_UI
    })

    axios.post('/login', userData)
    .then((result) => {
        dispatch({ 
            type: OK_UI
        })
        setAuthorizationHeader(result.data.token)
        history.push('/')
        dispatch(getUserData(dispatcherCreator([{ type: SET_AUTHENTICATED_USER }, { type: LOADING_USER }], dispatch), dispatcherCreator([{ type: SET_USER }], dispatch)))
    })
    .catch((error) => {
        dispatch({
            type: ERROR_UI,
            payload: error.response.data
        })
    })
}

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ 
        type: LOADING_UI 
    })

    axios.post('/signup', newUserData)
    .then((result) => {
        dispatch({ 
            type: OK_UI 
        })
        setAuthorizationHeader(result.data.token)
        history.push('/')
        dispatch(getUserData(dispatcherCreator([{ type: SET_AUTHENTICATED_USER }, { type: LOADING_USER }], dispatch), dispatcherCreator([{ type: SET_USER }], dispatch))(dispatch))
    })
    .catch((error) => {
        dispatch({
            type: ERROR_UI,
            payload: error.response.data
        })
    })
}

export const uploadImage = (formData) => (dispatch) => {
    dispatch({
        type: LOADING_USER
    })
    axios.post('/user/image', formData)
    .then(() => {
        dispatch(getUserData(undefined, dispatcherCreator([{ type: SET_USER }], dispatch)))
    })
    .catch((error) => console.log(error))
}

export const editUserDetails = (userDetails, callback) => (dispatch) => {
    dispatch({
        type: LOADING_UI
    })
    axios.post('/user', userDetails)
    .then(() => {
        dispatch({ 
            type: OK_UI 
        })
        dispatch(getUserData(dispatcherCreator([{ type: LOADING_USER }], dispatch), dispatcherCreator([{ type: SET_USER }], dispatch)))

        callback()
    })
    .catch((error) => {
        dispatch({
            type: ERROR_UI,
            payload: error.response.data
        })
    })
}

export const getUserData = (first_callback = undefined, success_callback = undefined) => (dispatch) => {
    if(first_callback !== undefined) {
        first_callback()
    }

    axios.get('/user')
    .then((result) => {
        if(success_callback !== undefined){
            success_callback(result.data, result.data)
        }

    })
    .catch((error) => console.log(error))
    
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FirebaseAuthenticationToken')
    delete axios.defaults.headers.common['Authorization']
    dispatch({
        type: SET_UNAUTHENTICATED_USER
    })
}

export const markNotificationsRead = (notificationsIds) => (dispatch) => {
    axios.post('/notifications', notificationsIds)
    .then((result) => {
        dispatch({
            type: MARK_NOTIFICATIONS_READ
        })
    })
    .catch((error) => {
        console.error(error)
    })
}

const setAuthorizationHeader = (token) => {
    const firebaseAuthenticationToken = `Bearer ${token}`
    localStorage.setItem('FirebaseAuthenticationToken', firebaseAuthenticationToken)
    axios.defaults.headers.common['Authorization'] = firebaseAuthenticationToken
}