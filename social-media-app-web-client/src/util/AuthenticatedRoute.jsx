import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

//redux imports
import { connect } from 'react-redux'


const AuthenticatedRoute = ({ component: Component, authenticated, ...rest }) => {
    return (
        <Route {...rest} render={(props) => authenticated === true ? <Redirect to='/'/> : <Component {...props}/> }/>
    )
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated     
})

AuthenticatedRoute.propTypes = {
    user: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(AuthenticatedRoute)
