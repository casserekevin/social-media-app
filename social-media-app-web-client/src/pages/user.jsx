import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

//material UI imports
import Grid from '@material-ui/core/Grid'

//redux imports
import { connect } from 'react-redux'
import { getPublicUserData } from '../redux/actions/dataActions'

//Created Components imports
import Scream from '../components/scream/Scream'
import StaticProfile from '../components/profile/StaticProfile'

class user extends Component {
    constructor(){
        super()
        this.state = {
            profile: null,
            screamIdParam: null
        }
    }


    componentDidMount(){
        const handle = this.props.match.params.handle
        const screamId = this.props.match.params.screamId

        if(screamId){
            this.setState({
                screamIdParam: screamId
            })
        }

        this.props.getPublicUserData(handle)
        axios.get(`/user/${handle}`)
        .then((result) => {
            this.setState({
                profile: result.data.user
            })
        })
        .catch((error) => {
            console.error(error)
        })
    }

    render() {
        const { data: { screams, loading } } = this.props
        const { screamIdParam } = this.state

        let screamsMarkup = (loading) ? (
            <p>Loading data...</p>
        ) : (
            (screams === null) ? (
                <p>No screams from this user</p>
            ) : (
                (!screamIdParam) ? (
                    screams.map((scream) => <Scream key={scream.screamId} scream={scream}/>)
                ) : (
                    screams.map((scream) => {
                        if(scream.screamId !== screamIdParam) {
                            return <Scream key={scream.screamId} scream={scream}/>
                        }
                        else{
                            return <Scream key={scream.screamId} scream={scream} openDialog/>
                        }
                    })
                )
            )
        )

        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    {screamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {(this.state.profile === null) ? (
                        <p>Loading profile...</p>
                    ) : (
                        <StaticProfile profile={this.state.profile}/>
                    )}
                </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    data: PropTypes.object.isRequired,
    getPublicUserData: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    data: state.data
})

const mapActionsToProps = {
    getPublicUserData
}

export default connect(mapStateToProps, mapActionsToProps)(user)

