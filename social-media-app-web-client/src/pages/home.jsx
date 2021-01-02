import React, { Component } from 'react'
import PropTypes from 'prop-types'

//Material UI imports
import Grid from '@material-ui/core/Grid'

//Redux imports
import { connect } from 'react-redux'
import { getScreams } from '../redux/actions/dataActions'

//Created Components imports
import Scream from '../components/scream/Scream'
import Profile from '../components/profile/Profile'
import ScreamSkeleton from '../util/components/ScreamSkeleton'

class home extends Component {

    componentDidMount() {
        this.props.getScreams()
    }

    render() {
        const { data: { screams, loading } } = this.props

        let recentScreamsMarkup = !loading ? (
            screams.map((scream) => <Scream key={scream.screamId} scream={scream}/>)
        ) : (
            <ScreamSkeleton/>
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
