import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

import NotificationIcon from '@material-ui/icons/Notifications'

export default function Notification () {
  return <IconButton style={{ color: 'white', marginLeft: 0 }} >
    <Badge badgeContent={2} color='secondary' >
      <NotificationIcon />
    </Badge>
  </IconButton>
}

export function NotificationPopup () {
  return <Popper placement={'bottom-end'} style={{ zIndex: 10000, width: 300 }} transition>
    {({ TransitionProps }) => (
      <Fade {...TransitionProps} timeout={350}>
        <Card style={{ marginTop: 14 }}>
          <CardHeader
            disableTypography
            title='Notifications'
          />
          <List style={{ maxHeight: 230, overflow: 'auto' }}>
            a
          </List>
        </Card>
      </Fade>
    )}
  </Popper>
}

export function NotificationListItem (props) {
  let { title, body } = props
  return <ListItem alignItems='flex-start'>
    <ListItemText
      primary={title}
      secondary={
        <React.Fragment>
          <Typography
            component='span'
            variant='body2'
            color='textPrimary'
          >
            {body}
          </Typography>
        </React.Fragment>
      }
    />
  </ListItem>
}
