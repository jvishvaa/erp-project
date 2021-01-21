import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'

export default class CustomEvent extends Component {
  render () {
    console.log(this.props)
    return (<Grid>
      <Grid.Column width={13}>
        <Grid.Row> {this.props.event.description} </Grid.Row>
        <Grid.Row> {this.props.title} </Grid.Row>
      </Grid.Column>
    </Grid>)
  }
}
