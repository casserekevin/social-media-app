import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

//Material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

//Icons
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

//Redux imports
import { connect } from 'react-redux'
import { deleteScream } from '../redux/actions/dataActions'

//Created Components imports
import MyButton from '../util/components/MyButton'

const styles = {
    deleteButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
}

class DeleteScream extends Component {
    constructor(){
        super()
        this.state = {
            open: false
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    deleteScream = () => {
        this.props.deleteScream(this.props.screamId, this.handleClose)
    }

    render() {
        const { classes } = this.props

        return (
            <Fragment>
                <MyButton tip="Delete Scream" onClick={this.handleOpen} btnClassName={classes.deleteButton}>
                    <DeleteOutlineIcon color="secondary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Are you sure you want to delete this scream?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteScream} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteScream.propTypes = {
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    deleteScream: PropTypes.func.isRequired,
}

const mapActionsToProps = {
    deleteScream
}

export default connect(null, mapActionsToProps)(withStyles(styles)(DeleteScream))
