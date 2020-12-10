import { SET_USER, SET_ERRORS, LOADING_UI, CLEAR_ERRORS, SET_UNAUTHENTICATED, LOADING_USER } from '../types'
import axios from 'axios'

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ 
        type: LOADING_UI 
    })

    axios.post('/login', userData)
    .then((result) => {
        setAuthorizationHeader(result.data.token)
        dispatch(getUserData())
        dispatch({ 
            type: CLEAR_ERRORS 
        })
        history.push('/')
    })
    .catch((error) => {
        dispatch({
            type: SET_ERRORS,
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
        setAuthorizationHeader(result.data.token)
        dispatch(getUserData())
        dispatch({ 
            type: CLEAR_ERRORS 
        })
        history.push('/')
    })
    .catch((error) => {
        dispatch({
            type: SET_ERRORS,
            payload: error.response.data
        })
    })
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FirebaseAuthenticationToken')
    delete axios.defaults.headers.common['Authorization']
    dispatch({
        type: SET_UNAUTHENTICATED
    })
}

export const getUserData = () => (dispatch) => {
    dispatch({
        type: LOADING_USER
    })
    axios.get('/user')
    .then((result) => {
        dispatch({ 
            type: SET_USER, 
            payload: result.data 
        })
    })
    .catch((error) => console.log(error))
}

export const uploadImage = (formData) => (dispatch) => {
    dispatch({
        type: LOADING_USER
    })
    axios.post('/user/image', formData)
    .then(() => {
        dispatch(getUserData())
    })
    .catch((error) => console.log(error))
}

export const editUserDetails = (userDetails, callback) => (dispatch) => {
    dispatch({
        type: LOADING_UI
    })
    axios.post('/user', userDetails)
    .then(() => {
        dispatch(getUserData())

        dispatch({ 
            type: CLEAR_ERRORS 
        })
        callback()
    })
    .catch((error) => {
        dispatch({
            type: SET_ERRORS,
            payload: error.response.data
        })
    })
}

const setAuthorizationHeader = (token) => {
    const firebaseAuthenticationToken = `Bearer ${token}`
    localStorage.setItem('FirebaseAuthenticationToken', firebaseAuthenticationToken)
    axios.defaults.headers.common['Authorization'] = firebaseAuthenticationToken
}