import React, { Component } from 'react'
import { Checkbox } from 'semantic-ui-react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

class CheckboxExampleSlider extends Component {
  render () {
    // console.log('component',this.props.array)
    let list
    if (this.props.array) {
      list = this.props.array.map((v) => (
        <div>
          <Checkbox label={v.text} value={v.value} name={this.props.heading} onChange={this.props.change} checked={v.checked} />
          <br />
        </div>

      ))
    } else {
      list = <div>
        <Checkbox label='invalid' onChange={this.props.change} />
      </div>
    }

    return (
      <Card style={{ height: 'auto', margin: 8, maxHeight: '250px', overflowY: 'auto' }} >
        <CardHeader
          title={this.props.heading}
        />
        <CardContent>
          {list}

        </CardContent>
      </Card>
    )
  }
}

export default CheckboxExampleSlider
