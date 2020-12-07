import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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
import AuthenticatedRoute from './util/AuthenticatedRoute'

//redux imports
import { Provider } from 'react-redux'
import store from './redux/store'

//css
import './global.css'



const theme = createMuiTheme(themeFile)

let authenticated
const token = localStorage.FirebaseAuthenticationToken
if(token){
    const decodedToken = jwtDecode(token)
    if(decodedToken.exp * 1000 < Date.now()){
        authenticated = false
        //window.location.href = '/login'
    }
    else{
        authenticated = true
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
                                <AuthenticatedRoute exact path='/login' component={login} authenticated={authenticated}/>
                                <AuthenticatedRoute exact path='/signup' component={signup} authenticated={authenticated}/>
                            </Switch>
                        </div>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        )
    }
}

export default App

