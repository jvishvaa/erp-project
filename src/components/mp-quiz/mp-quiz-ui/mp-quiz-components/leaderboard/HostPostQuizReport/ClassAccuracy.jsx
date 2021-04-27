import React, { Component } from 'react'
// import { InternalPageStatus } from '../../../../../ui'

export class ClassAccuracy extends Component {
  render () {
    const { accuracy = '' } = this.props
    return (
      <div className='class__accuracy--container'>
        <h2 className='session__highlights--title'>Class Accuracy</h2>
        <p className='session__highlights--subtitle'>The class answered {
          Number(accuracy).toFixed(2)
        }% questions correctly</p>
      </div>
    )
  }
}

export default ClassAccuracy
