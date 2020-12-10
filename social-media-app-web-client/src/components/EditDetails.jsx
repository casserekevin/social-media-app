import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

//Material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography'

//Icons
import EditIcon from '@material-ui/icons/Edit'

//Redux imports
import { connect } from 'react-redux'
import { editUserDetails } from '../redux/actions/userActions'

//Created Components imports
import MyButton from '../util/components/MyButton'

const styles = (theme) => ({
    ...theme.global,
    button: {
        float: 'right'
    }
})

class EditDetails extends Component {
    constructor(){
        super()
        this.state = {
            bio: '',
            website: '',
            location: '',
            open: false,
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            })
        }
    }

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: (credentials.bio)? credentials.bio : '',
            website: (credentials.website)? credentials.website : '',
            location: (credentials.location)? credentials.location : '',
        })
    }

    componentDidMount(){
        const { user: { credentials } } = this.props

        this.mapUserDetailsToState(credentials)
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        }

        this.props.editUserDetails(userDetails, this.handleClose)
    }

    render() {
        const { classes } = this.props
        const { errors } = this.state

        return (
            <Fragment>
                <MyButton tip="Edit details" onClick={this.handleOpen} btnClassName={classes.button}>
                    <EditIcon color="primary"/>
                </MyButton>
                <Dialog fullWidth maxWidth="sm" open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField name="bio" type='text' label='Bio' rows="3" placeholder="A short bio about yourself" multiline fullWidth value={this.state.bio} onChange={this.handleChange} className={classes.textField}></TextField>
                            <TextField name="website" type='text' label='Website' placeholder="Your personal/professional website" fullWidth value={this.state.website} onChange={this.handleChange} className={classes.textField}></TextField>
                            <TextField name="location" type='text' label='Location' placeholder="Where you live?" fullWidth value={this.state.location} onChange={this.handleChange} className={classes.textField}></TextField>
                            {errors.general && (
                                <Typography variant='body2' className={classes.customError}>
                                    {errors.general}
                                </Typography>
                            )}
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.handleSubmit} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    editUserDetails: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionsToProps = {
    editUserDetails
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditDetails)) 