import React, { Component } from 'react'
import PropTypes from 'prop-types'

//Material UI imports
import Grid from '@material-ui/core/Grid'

//Redux imports
import { connect } from 'react-redux'
import { getScreams } from '../redux/actions/dataActions'

//Created Components imports
import Scream from '../components/Scream'
import Profile from '../components/Profile'

class home extends Component {

    render() {
        const { data: { screams, loading } } = this.props

        let recentScreamsMarkup = !loading ? (
            screams.map((scream) => <Scream key={scream.screamId} scream={scream}/>)
        ) : (
            <p>Loading...</p>
        )

        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile/>
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    data: PropTypes.object.isRequired,
    getScreams: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    data: state.data
})

const mapActionsToProps = {
    getScreams
}

export default connect(mapStateToProps, mapActionsToProps)(home)
