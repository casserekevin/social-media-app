import { SET_USER, SET_ERRORS, LOADING_UI, CLEAR_ERRORS } from '../types'
import axios from 'axios'

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ 
        type: LOADING_UI 
    })

    axios.post('/login', userData)
    .then((result) => {
        const firebaseAuthenticationToken = `Bearer ${result.data.token}`
        localStorage.setItem('FirebaseAuthenticationToken', firebaseAuthenticationToken)
        axios.defaults.headers.common['Authorization'] = firebaseAuthenticationToken
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

export const getUserData = () => (dispatch) => {
    axios.get('/user')
    .then((result) => {
        dispatch({ 
            type: SET_USER, 
            payload: result.data 
        })
    })
    .catch((error) => console.log(error))
}