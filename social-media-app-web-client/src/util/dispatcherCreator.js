import { LOADING_UI, OK_UI, ERROR_UI, LOADING_USER, SET_AUTHENTICATED_USER, SET_UNAUTHENTICATED_USER, SET_USER, LOADING_DATA, SET_SCREAMS, SET_SCREAM, LIKE_SCREAM, UNLIKE_SCREAM } from '../redux/types'

const dispatcherCreator = (array, dispatch) => {

    let func_params = ''
    let func_body = ''
    for(let i = 0; i < array.length; i++){
        if(i < array.length - 1){
            func_params = func_params + `param_${i + 1},`
        }
        else{
            func_params = func_params + `param_${i + 1}`
        }
        func_body = func_body + `dispatch({ type: types.${array[i].type}, payload: param_${i + 1} });`
    }
    
    const new_func = new Function('dispatch,types', `return (${func_params}) => {${func_body}}`)

    return new_func(dispatch, {LOADING_UI, OK_UI, ERROR_UI, LOADING_USER, SET_AUTHENTICATED_USER, SET_UNAUTHENTICATED_USER, SET_USER, LOADING_DATA, SET_SCREAMS, SET_SCREAM, LIKE_SCREAM, UNLIKE_SCREAM})
}

export default dispatcherCreator