import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

//Material UI imports
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

//Icons
import AddIcon from '@material-ui/icons/Add'
import HomeIcon from '@material-ui/icons/Home'
import NotificationsIcon from '@material-ui/icons/Notifications'

//Redux imports
import { connect } from 'react-redux'

//Created Components imports
import MyButton from '../util/components/MyButton'


class Navbar extends Component {

    
    render() {
        const { user: { authenticated } } = this.props

        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {(authenticated)? (
                        <Fragment>
                            <MyButton tip="Post a Scream!">
                                <AddIcon/>
                            </MyButton>
                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon/>
                                </MyButton>
                            </Link>
                            <MyButton tip="Notifications">
                                <NotificationsIcon/>
                            </MyButton>


                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button color='inherit' component={Link} to="/">Home</Button>
                            <Button color='inherit' component={Link} to="/login">Login</Button>
                            <Button color='inherit' component={Link} to="/signup">Signup</Button>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    user: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {

}

export default connect(mapStateToProps, mapActionsToProps)(Navbar)
