import React from 'react'

export default function WidgetHeader (props) {
  return <div style={{ position: 'absolute', left: 0, top: 0, height: 32, width: '100%', padding: 8, fontWeight: 600 }}>
    {props.title}
    <div style={{ flexGrow: 1 }} />
  </div>
}
