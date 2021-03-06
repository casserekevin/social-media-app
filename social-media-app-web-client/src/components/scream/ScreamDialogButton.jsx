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
import ChatIcon from '@material-ui/icons/Chat'

//Redux imports
import { connect } from 'react-redux'
import { getScream, OK_UI_func } from '../../redux/actions/dataActions'

//Created Components imports
import LikeButton from './LikeButton'
import CommentForm from './CommentForm'
import Comments from './Comments'
import MyButton from '../../util/components/MyButton';


const styles = (theme) => ({
    ...theme.global,
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '6%'
    },
    spinnerDiv: {
        textAlign: 'center',
        margin: '50px 0px'
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
})

class ScreamDialogButton extends Component {
    constructor(){  
        super()
        this.state = {
            open: false,
            oldPath: '',
            newPath: ''
        }

    }

    componentDidMount() {
        if(this.props.openDialog){
            this.handleOpen()
        }
    }

    handleOpen = () => {
        const { screamId, userHandle } = this.props
        
        let oldPath = window.location.pathname
        const newPath = `/users/${userHandle}/scream/${screamId}`
        
        if(oldPath === newPath) oldPath = `/users/${userHandle}`

        window.history.pushState(null, null, newPath)
        
        this.setState({ open: true, oldPath, newPath })
        this.props.getScream(this.props.screamId)
    }

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath)

        this.setState({ open: false })
        this.props.OK_UI_func()
    }

    render() {
        dayjs.locale(ptbr)

        const { classes, screamId, UI: { loading }, data: { scream: { body, createdAt, userImage, userHandle, likeCount, commentCount, comments } } } = this.props

        const dialogMarkup = (loading)? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2}/>
            </div>
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
                    <LikeButton screamId={screamId} />
                    <span>{likeCount} likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} comments</span> 
                </Grid>
                <hr className={classes.visibleSeparator}/>
                <CommentForm screamId={screamId}/>
                <Comments comments={comments}/>
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

ScreamDialogButton.propTypes = {
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    UI: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    getScream: PropTypes.func.isRequired,
    OK_UI_func: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    data: state.data
})

const mapActionsToProps = {
    getScream,
    OK_UI_func
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialogButton)) 
