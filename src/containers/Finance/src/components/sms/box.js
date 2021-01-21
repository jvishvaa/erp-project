import React from 'react'
import { DragSource } from 'react-dnd'

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left'
}
const Box = ({ name, isDragging, connectDragSource }) => {
  const opacity = isDragging ? 0.4 : 1
  return (
    <div ref={connectDragSource} style={Object.assign({}, style, { opacity })}>
      {name}
    </div>
  )
}
export default DragSource(
  'BOX',
  {
    beginDrag: props => ({ name: props.name }),
    endDrag (props, monitor) {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      if (dropResult) {
        props.dropped && props.dropped(item.name)
      }
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(Box)
