import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

//dayjs imports
import dayjs from 'dayjs'
import ptbr from 'dayjs/locale/pt-br'

//Material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import MuiLink from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

//Icons
import LocationOnIcon from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'

//Redux imports
import { connect } from 'react-redux'
import { logoutUser, uploadImage } from '../../redux/actions/userActions'

//Created Components imports
import EditDetails from './EditDetails'
import MyButton from '../../util/components/MyButton'


const styles = (theme) => ({
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: theme.palette.primary.main
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    },
    circular: {
        textAlign: 'center'
    }
})

class Profile extends Component {
    handleImageChange = (event) => {
        const image = event.target.files[0]

        //send to server
        const formData = new FormData()
        formData.append('image', image, image.name)
        this.props.uploadImage(formData)
    }

    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput')
        fileInput.click()
    }

    handleLogout = () => {
        this.props.logoutUser()
    }

    render() {
        dayjs.locale(ptbr)

        const { classes, user: { loading, authenticated, credentials: { imageUrl, handle, bio, location, website, createdAt } } } = this.props
        
        
        let profileMarkup = (!loading) ? (
            (authenticated) ? (
                <Paper className={classes.paper}>
                    <div className={classes.profile}>
                        <div className="image-wrapper">
                            <img src={imageUrl} alt="profile" className="profile-image"/>
                            <input type="file" id="imageInput" hidden='hidden' onChange={this.handleImageChange}/>
                            <MyButton tip="Edit profile picture" onClick={this.handleEditPicture} btnClassName="button">
                                <AddAPhotoIcon color="primary"/>
                            </MyButton>
                        </div>
                        <hr/>
                        <div className="profile-details">
                            <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                                @{handle}
                            </MuiLink>
                            <hr/>
                            {bio && <Typography variant="body2">{bio}</Typography>}
                            <hr/>
                            {location && (
                                <Fragment>
                                    <LocationOnIcon color="primary"/> <span>{location}</span>
                                    <hr/>
                                </Fragment>

                            )}
                            {website && (
                                <Fragment>
                                    <LinkIcon color="primary"/>
                                    <a href={website} target="_blank" rel="noopener noreferrer">
                                        {' '}{website}
                                    </a>
                                    <hr/>
                                </Fragment>
                            )}
                            <CalendarTodayIcon color="primary"/>{' '}
                            <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                        </div>
                        <MyButton tip="Logout" onClick={this.handleLogout}>
                            <KeyboardReturnIcon color="primary"/>
                        </MyButton>
                        <EditDetails/>
                    </div>
                </Paper>
            ) : (
                <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">No profile found, please login again!</Typography>
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>    
                        <Button variant="contained" color="secondary" component={Link} to="/signup">Sign up</Button>    
                    </div> 
                </Paper>
            )
        ) : (
            <Paper className={classes.paper}>
                <div className={classes.circular}>
                    <CircularProgress size={30}/>
                </div>
            </Paper>
        )

        return profileMarkup
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    logoutUser,
    uploadImage
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile))
