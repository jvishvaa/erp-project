// import { Button } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

const React = require('react')

class RouterButton extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.props = props
  }

  render () {
    return (
      <Button
        color={this.props.value.color}
        disabled={this.props.value.disabled}
        onClick={this.props.click ? this.props.click : null}
      >
        {this.props.value.label ? this.props.value.label : 'Default Button'}
      </Button>
    )
  }
}

export default RouterButton
