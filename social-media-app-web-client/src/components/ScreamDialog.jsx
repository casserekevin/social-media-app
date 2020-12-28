import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

//dayjs imports
import dayjs from 'dayjs'
import ptbr from 'dayjs/locale/pt-br'

//Material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

//Icons
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore'
import CloseIcon from '@material-ui/icons/Close'

//Redux imports
import { connect } from 'react-redux'
import { getScream } from '../redux/actions/dataActions'
import MyButton from '../util/components/MyButton';


const styles = (theme) => ({
    ...theme.global,
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    invisibleSeparator: {
        border: 'none',
        margin: 4,
    },

})

class ScreamDialog extends Component {
    constructor(){  
        super()
        this.state = {
            open: false,
        }

    }

    handleOpen = () => {
        this.setState({ open: true })
        this.props.getScream(this.props.screamId)
    }

    handleClose = () => {
        this.setState({ open: false, errors: {} })
    }

    render() {
        dayjs.locale(ptbr)

        const { classes, UI: { loading }, data: { scream: { body, createdAt, userImage, userHandle } } } = this.props

        const dialogMarkup = (loading)? (
            <CircularProgress size={118}/>
        ) : (
            <Grid container spacing={2}>
                <Grid item sm={5}>
                    <img src={userImage} alt="profile" className={classes.profileImage}/>
                </Grid>

                <Grid item sm={7}>
                    <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
                        @{userHandle} 
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography color="textSecondary" variant="body2">
                        {dayjs(createdAt).format('HH:mm, DD [de] MMMM [de] YYYY')}
                    </Typography>   
                    <hr className={classes.invisibleSeparator}/>
                    <Typography  variant="body1">
                        {body}
                    </Typography>   
                </Grid>
            </Grid>
        )

        return (
            <Fragment>
                <MyButton tip="Expand Scream" onClick={this.handleOpen} tipClassName={classes.expandButton}>
                    <UnfoldMoreIcon color="primary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} btnClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

ScreamDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    UI: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    getScream: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    data: state.data
})

const mapActionsToProps = {
    getScream
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog)) 
