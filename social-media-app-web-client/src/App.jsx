import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

//pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'

//material-ui imports
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import themeFile from './util/theme'

//components
import Navbar from './components/Navbar'
import AuthenticatedRoute from './util/components/AuthenticatedRoute'

//redux imports
import { Provider } from 'react-redux'
import store from './redux/store'
import { LOADING_USER, SET_AUTHENTICATED_USER, SET_USER } from './redux/types'
import { logoutUser, getUserData } from './redux/actions/userActions'
import dispatcherCreator from './util/dispatcherCreator'

//css
import './global.css'


const theme = createMuiTheme(themeFile)

const token = localStorage.FirebaseAuthenticationToken
if(token){
    const decodedToken = jwtDecode(token)
    if(decodedToken.exp * 1000 < Date.now()){
        store.dispatch(logoutUser())
        window.location.href = '/login'
    }
    else{
        axios.defaults.headers.common['Authorization'] = token
        store.dispatch(getUserData(dispatcherCreator([{ type: SET_AUTHENTICATED_USER }, { type: LOADING_USER }], store.dispatch), dispatcherCreator([{ type: SET_USER }], store.dispatch)))
    }
}

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Provider store={store}>
                    <Router>
                        <Navbar/>
                        <div className="container">
                            <Switch>
                                <Route exact path='/' component={home}/>
                                <AuthenticatedRoute exact path='/login' component={login}/>
                                <AuthenticatedRoute exact path='/signup' component={signup}/>
                            </Switch>
                        </div>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        )
    }
}

export default App

