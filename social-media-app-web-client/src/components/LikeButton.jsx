import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

//Icons
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'

//Redux imports
import { connect } from 'react-redux'
import { likeScream, unlikeScream } from '../redux/actions/dataActions'

//Created Components imports
import MyButton from '../util/components/MyButton';


class LikeButton extends Component {
    likedScream = () => {
        if(this.props.user.likes && this.props.user.likes.find((like) => like.screamId === this.props.screamId)){
            return true
        }

        return false
    }

    likeScream = () => {
        this.props.likeScream(this.props.screamId)
    }

    unlikeScream = () => {
        this.props.unlikeScream(this.props.screamId)
    }

    render() {
        const { user: { authenticated } } = this.props

        const likeButton = (authenticated) ? (
            (this.likedScream()) ? (
                <MyButton tip="Undo like" onClick={this.unlikeScream}>
                    <FavoriteIcon color="primary"/>
                </MyButton>
            ) : (
                <MyButton tip="Like" onClick={this.likeScream}>
                    <FavoriteBorderIcon color="primary"/>
                </MyButton>
            )
        ) : (
            <Link to="/login">
                <MyButton tip="Like">
                        <FavoriteBorderIcon color="primary"/>
                </MyButton>
            </Link>
        )

        return likeButton
    }
}

LikeButton.propTypes = {
    screamId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likeScream,
    unlikeScream
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
