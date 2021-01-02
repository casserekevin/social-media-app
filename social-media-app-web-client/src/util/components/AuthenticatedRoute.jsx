import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

//redux imports
import { connect } from 'react-redux'


const AuthenticatedRoute = ({ component: Component, user: { authenticated }, ...rest }) => {
    return (
        <Route {...rest} render={(props) => authenticated === true ? <Redirect to='/'/> : <Component {...props}/> }/>
    )
}

const mapStateToProps = (state) => ({
    user: state.user     
})

AuthenticatedRoute.propTypes = {
    user: PropTypes.object
}

export default connect(mapStateToProps)(AuthenticatedRoute)
