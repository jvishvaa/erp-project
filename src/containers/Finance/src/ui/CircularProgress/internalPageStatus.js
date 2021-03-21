import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const InternalPageStatus = (props) => {
  // internal circular Progress
  let { label, size = 26, thickness = 4, minHeight = '20vw', loader = true } = props
  return (
    <div style={{ width: '100%', minHeight, display: 'flex', height: '100%' }}>
      <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {loader ? <CircularProgress size={size} thickness={thickness} /> : null}
        <h6 style={{ fontSize: '16px', padding: 0, margin: 10 }}>{label}</h6>
      </div>
    </div>
  )
}

export default InternalPageStatus
