import React, { Component } from 'react'

class ReportConfigurationHeader extends Component {
  render () {
    return (
      <div style={{ display: 'flex' }}>
        <span style={{ width: '20%', fontSize: 16 }}>Question Range: </span>
        <span style={{ width: '20%', fontSize: 16 }}>Category:</span>
        <span style={{ width: '60%', fontSize: 16, display: 'flex', justifyContent: 'space-around' }}>
          <span>Marks Range</span>
          <span>Grading</span>
          <span>Remark</span>
        </span>
      </div>
    )
  }
}

export default ReportConfigurationHeader
