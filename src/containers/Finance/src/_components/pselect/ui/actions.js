
import React from 'react'

import { useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/SaveAltOutlined'
import ClearAllIcon from '@material-ui/icons/ClearAllOutlined'

import { filterConstants } from '../../../_constants'

function Actions (props) {
  const dispatch = useDispatch()
  let { setOpen, open } = props
  function onAction (type) {
    switch (type) {
      case 'clear_all' : unselectAll(); break
      case 'save': props.onSave && props.onSave(); setOpen(!open); break
      case 'cancel':unselectAll(); setOpen(!open); break
      default :
    }
  }
  function unselectAll () {
    dispatch({ type: filterConstants.UPDATE, data: { type: 'unselect_all' } })
  }
  return <React.Fragment>
    <Button
      style={{ marginRight: 8 }}
      onClick={() => onAction('clear_all')}
      color='primary'>
      <ClearAllIcon
        style={{ marginRight: 8 }} />
          Clear All
    </Button>
    <Button
      onClick={() => onAction('save')}
      style={{ marginRight: 8 }}
      color='primary'>
      <SaveIcon
        style={{ marginRight: 8 }} />
        Save
    </Button>
    <Button
      onClick={() => onAction('cancel')}
      style={{ marginRight: 8 }}
      color='secondary' > Cancel
    </Button>
  </React.Fragment>
}

export default Actions
