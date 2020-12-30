import React, { Component } from 'react'
import PropTypes from 'prop-types'

//Material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';

//Redux imports
import { connect } from 'react-redux'
import { submitComment } from '../../redux/actions/dataActions'

const styles = (theme) => ({
    ...theme.global,
})

class CommentForm extends Component {
    constructor(){  
        super()
        this.state = {
            body: '',
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
            this.setState({ body: '', errors: {} })
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()

        const commentData = {
            body: this.state.body,
        }

        this.props.submitComment(this.props.screamId, commentData)
    }

    render() {

        const { classes, user: { authenticated } } = this.props
        const { errors } = this.state

        const commentFormMarkup = (authenticated)? (
            <Grid item sm={12} style={{ textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField name="body" type='text' label='Comment on scream!' placeholder="What are you thinking?" fullWidth value={this.state.body} error={(errors.comment)? true : false} helperText={errors.comment} onChange={this.handleChange} className={classes.textField}/>
                    <Button type="submit" variant="contained" color="primary" className={classes.button}>
                        Submit
                    </Button>
                </form>
                <hr className={classes.visibleSeparator}/>
            </Grid>
        ) : (
            null
        )

        return commentFormMarkup
    }
}

CommentForm.propTypes = {
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    UI: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    submitComment: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    user: state.user
})

const mapActionsToProps = {
    submitComment
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CommentForm)) 

