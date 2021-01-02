import React from 'react'
import PropTypes from 'prop-types'

//Material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Paper from '@material-ui/core/Paper'

//Icons
import LocationOnIcon from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'

//image imports
import NoImage from '../../images/no-img.png'

const styles = (theme) => ({
    ...theme.global,
    handle: {
        height: 20,
        backgroundColor: theme.palette.primary.main,
        width: 60,
        margin: '0 auto 7px auto',
    },
    fullLine: {
        height: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '100%',
        marginBottom: 10,
    },
    halfLine: {
        height: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '50%',
        marginBottom: 10,
    }
})

const ProfileSkeleton = (props) => {

    const { classes } = props
    
    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={NoImage} alt="profile" className="profile-image"/>
                </div>
                <hr/>
                <div className="profile-details">
                    <div className={classes.handle}/>
                    <hr/>
                    <div className={classes.fullLine}/>
                    <div className={classes.fullLine}/>
                    <hr/>
                    <LocationOnIcon color="primary"/> <span>Location</span>
                    <hr/>
                    <LinkIcon color="primary"/> https://website.com
                    <hr/>
                    <CalendarTodayIcon color="primary"/> Joined date

                </div>
            </div>
        </Paper>
    )
}

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ProfileSkeleton)