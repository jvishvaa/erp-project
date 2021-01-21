import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import IconButton from '@material-ui/core/IconButton'
import ExpandMore from '@material-ui/icons/ExpandMore'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    maxHeight: '60vh',
    overflowY: 'scroll'
  },
  collapse: {
    // maxHeight: '60vh',
    // overflowY: 'scroll'
  },
  nested: {
    margin: 0,
    padding: 0,
    paddingLeft: theme.spacing(4)
  }
}))

export default function NestedList ({ title, items = [], onItemClick, diasbleClick }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }
  const handleClose = (itemId = undefined, index = undefined, item = undefined) => {
    if (itemId) {
      console.log(itemId)
      onItemClick(itemId, index, item)
    } else {
      console.log({ itemId, index, item })
      window.alert(`Item with index - ${index} has no id in it`)
    }
  }
  return (
    <List
      component='nav'
      aria-labelledby='nested-list-subheader'
      //   subheader={
      //     <ListSubheader component='div' id='nested-list-subheader'>
      //       Test Heading
      //     </ListSubheader>
      //   }
      className={classes.root}
    >
      <ListItem button onClick={handleClick}>
        <ListItemText primary={title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout='auto' className={classes.collapse} unmountOnExit>
        <List component='div' disablePadding>
          {
            items.map((item, index) => {
              return <ListItem button className={classes.nested}>
                <ListItemText style={{ whiteSpace: 'pre-line' }}>{index + 1})&nbsp;{item.label}</ListItemText>
                {
                  !diasbleClick
                    ? <IconButton edge='start' color='primary' onClick={() => { handleClose(item.id, index, item) }} aria-label='close'>
                      <CloseIcon />
                    </IconButton>
                    : null
                }
              </ListItem>
            })
          }
        </List>
      </Collapse>
    </List>
  )
}
