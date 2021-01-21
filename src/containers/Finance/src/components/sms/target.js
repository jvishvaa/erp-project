import React from 'react'
import { DropTarget } from 'react-dnd'
import { TextField } from '@material-ui/core'

const Dustbin = ({ canDrop, isOver, connectDropTarget, ...rest }) => {
  return (
    <div ref={connectDropTarget}>
      <TextField
        id='standard-textarea'
        value={rest.content}
        multiline
        fullWidth
        helperText={(320 - (rest.content ? rest.content.length : 0)) + 'characters remaining.'}
        maxLength='320'
        onChange={(e) => rest.onChange(e.target.value)}
        margin='normal'
      />
    </div>
  )
}
export default DropTarget(
  'BOX',
  {
    drop: () => ({ name: 'Dustbin' })
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(Dustbin)
