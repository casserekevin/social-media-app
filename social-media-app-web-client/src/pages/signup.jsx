import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

//material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

//redux imports
import { connect } from 'react-redux'
import { signupUser, logoutUser } from '../redux/actions/userActions'

//image imports
import ApeImage from '../images/icon.png'


const styles = (theme) => ({
    ...theme.global
})


class signup extends Component {
    constructor(){
        super()
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
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
    
    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({
            loading: true
        })
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        }
        this.props.signupUser(newUserData, this.props.history)
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }


    render() {
        const { classes, UI: { loading } } = this.props
        const { errors } = this.state
        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={ApeImage} alt='monkey' className={classes.image}/>
                    <Typography variant="h2" className={classes.pageTitle}>Sign up</Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id='email' name='email' type='email' label='Email' fullWidth helperText={errors.email} error={errors.email ? true : false} value={this.state.email} onChange={this.handleChange} className={classes.textField}/>
                        <TextField id='password' name='password' type='password' label='Password' fullWidth helperText={errors.password} error={errors.password ? true : false} value={this.state.password} onChange={this.handleChange} className={classes.textField}/>
                        <TextField id='confirmPassword' name='confirmPassword' type='password' label='Confirm Password' fullWidth helperText={errors.confirmPassword} error={errors.confirmPassword ? true : false} value={this.state.confirmPassword} onChange={this.handleChange} className={classes.textField}/>
                        <TextField id='handle' name='handle' type='text' label='Handle' fullWidth helperText={errors.handle} error={errors.handle ? true : false} value={this.state.handle} onChange={this.handleChange} className={classes.textField}/>
                        {errors.general && (
                            <Typography variant='body2' className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type='submit' variant='contained' color='primary' disabled={loading} className={classes.button}>
                            Sign up
                            {loading && (
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button> <br/>
                        <small>Already have an account? <Link to='/login'>Login</Link></small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionsToProps = {
    signupUser,
    logoutUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(signup)) 