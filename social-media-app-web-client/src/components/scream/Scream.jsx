import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

//dayjs imports
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ptbr from 'dayjs/locale/pt-br'

//Material UI imports
import withStyles from '@material-ui/core/styles/withStyles'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography'

//Icons
import ChatIcon from '@material-ui/icons/Chat'

//Redux imports
import { connect } from 'react-redux'

//Created Components imports
import DeleteScreamButton from './DeleteScreamButton'
import ScreamDialogButton from './ScreamDialogButton'
import LikeButton from './LikeButton'
import MyButton from '../../util/components/MyButton'

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

class Scream extends Component {

    render() {
        dayjs.extend(relativeTime).locale(ptbr)

        const { classes, scream : { body, createdAt, userImage, userHandle, screamId, likeCount, commentCount } } = this.props

        return (
            <Card className={classes.card}>
                <CardMedia image={userImage} title="Profile image" className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" color="primary" component={Link} to={`/users/${userHandle}`}>{userHandle}</Typography>
                    <DeleteScreamButton screamId={screamId} userHandle={userHandle}/>
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>

                    <LikeButton screamId={screamId} />
                    <span>{likeCount} likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} comments</span>
                    <ScreamDialogButton screamId={screamId}/>
                </CardContent>
            </Card>
        )
    }
}

Scream.propTypes = {
    classes: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
}

export default connect(null)(withStyles(styles)(Scream))
