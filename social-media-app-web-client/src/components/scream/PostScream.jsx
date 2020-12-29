import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

//Material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress'

//Icons
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'

//Redux imports
import { connect } from 'react-redux'
import { postScream, OK_UI_func } from '../../redux/actions/dataActions'
import MyButton from '../../util/components/MyButton';


const styles = (theme) => ({
    ...theme.global,
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '3%'
    },
    submitButton: {
        positions: 'relative',
        margin: '10px 0px',
        float: 'right'
    }
})

class PostScream extends Component {
    constructor(){
        super()
        this.state = {
            body: '',
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

        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ body: '', open: false, errors: {} })
        }
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.props.OK_UI_func()
        this.setState({ open: false, errors: {} })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()

        const newScream = {
            body: this.state.body,
        }

        this.props.postScream(newScream)
    }

    render() {

        const { classes, UI: { loading } } = this.props
        const { errors } = this.state

        return (
            <Fragment>
                <MyButton tip="Post a Scream!" onClick={this.handleOpen}>
                    <AddIcon/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} btnClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogTitle>Post a new scream</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField name="body" type='text' label='SCREAM!!' rows="3" placeholder="Scream at your fellow apes" multiline fullWidth value={this.state.body} error={(errors.body)? true : false} helperText={errors.body} onChange={this.handleChange} className={classes.textField}/>
                            <Button type="submit" variant="contained" color="primary" disabled={loading} className={classes.submitButton}>
                                Submit
                                {loading && (
                                    <CircularProgress size={30} className={classes.progress}/>
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostScream.propTypes = {
    classes: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    postScream: PropTypes.func.isRequired,
    OK_UI_func: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI
})

const mapActionsToProps = {
    postScream,
    OK_UI_func
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostScream)) 
