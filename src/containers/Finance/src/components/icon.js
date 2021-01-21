import React, { Component } from 'react'
import { Button } from '@material-ui/core/'

import {

  Icon
} from 'semantic-ui-react'

class OmsIcon extends Component {
  constructor (props, context) {
    super(props, context)
    this.props = props
  }

  render () {
    return (
      <Button basic
        href={this.props.value.href}
        onClick={this.props.click}
        id={this.props.id}
      >
        <Icon
          name={this.props.value.name}
        />
      </Button>
    )
  }
}

export default OmsIcon
