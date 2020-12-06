import React, { Component } from 'react'
import axios from 'axios'

import Grid from '@material-ui/core/Grid'

import Scream from '../components/Scream'

class Home extends Component {
    state = {
        screams: null
    }

    componentDidMount(){
        axios.get('/screams')
        .then((result) => {
            console.log(result.data)
            this.setState({
                screams: result.data
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        let recentScreamsMarkup = this.state.screams ? (
            this.state.screams.map((scream) => <Scream scream={scream}/>)
        ) : (
            <p>Loading...</p>
        )

        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>profile...</p>
                </Grid>
            </Grid>
        )
    }
}

export default Home
