import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

//dayjs imports
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ptbr from 'dayjs/locale/pt-br'

//Material UI imports
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'

//Icons
import NotificationsIcon from '@material-ui/icons/Notifications'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatIcon from '@material-ui/icons/Chat'

//Redux imports
import { connect } from 'react-redux'
import { markNotificationsRead } from '../../redux/actions/userActions'

class Notifications extends Component {
    constructor(){  
        super()
        this.state = {
            anchorEl: null
        }

    }

    handleOpen = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleClose = () => {
        this.setState({ anchorEl: null })
    }

    onMenuOpened = () => {
        let unreadNotificationsIds = this.props.user.notifications.filter((notification) => !notification.read).map((notification) => notification.notificationId)

        this.props.markNotificationsRead(unreadNotificationsIds)
    }

    render() {
        dayjs.extend(relativeTime).locale(ptbr)

        const { user: { notifications } } = this.props
        const { anchorEl } = this.state

        let notificationsIcon
        if(notifications && notifications.length > 0){
            (notifications.filter((notification) => notification.read === false).length > 0) ? (
                notificationsIcon = (
                    <Badge badgeContent={notifications.filter((notification) => notification.read === false).length} color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                )
            ) : (
                notificationsIcon = <NotificationsIcon/>
            )
        }
        else{
            notificationsIcon = <NotificationsIcon/>
        }

        let notificationsMarkup = (notifications && notifications.length > 0) ? (
            notifications.map((notification) => {
                const verb = (notification.type === 'like') ? 'liked' : 'commented on'
                const time = dayjs(notification.createdAt).fromNow()
                const iconColor = (notification.read) ? 'primary' : 'secondary'
                const icon = (notification.type === 'like') ? (
                    <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
                ) : (
                    <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
                )

                return (
                    <MenuItem key={notification.createdAt} onClick={this.handleClose}>
                        {icon}
                        <Typography component={Link} variant="body1" to={`/users/${notification.recipient}/scream/${notification.screamId}`}>
                            {notification.sender} {verb} your scream {time}
                        </Typography>
                    </MenuItem>
                )
            })
        ) : (
            <MenuItem onClick={this.handleClose}>
                You have no notifications yet
            </MenuItem>
        )

        return (
            <Fragment>
                <Tooltip placement="top" title="Notifications">
                    <IconButton aria-owns={(anchorEl) ? 'simple-menu' : undefined} aria-haspopup="true" onClick={this.handleOpen}>
                        {notificationsIcon}
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose} onEntered={this.onMenuOpened} keepMounted>
                    {notificationsMarkup}
                </Menu>

            </Fragment>
        )
    }
}

Notifications.propTypes = {
    user: PropTypes.object.isRequired,
    markNotificationsRead: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    markNotificationsRead
}

export default connect(mapStateToProps, mapActionsToProps)(Notifications) 