import React from 'react'

export default function WidgetBody (props) {
  console.log(props.width, props.height)
  return <div style={{ position: 'absolute', left: 0, top: 42, width: props.width, height: props.height - 42, overflow: 'auto' }}>{props.children}</div>
}
