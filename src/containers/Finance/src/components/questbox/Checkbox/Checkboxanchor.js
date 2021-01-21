import React, { Component } from 'react'
import { Checkbox, Grid } from 'semantic-ui-react'

class CheckboxExampleSlider extends Component {
  render () {
    return (
      <div>
        <h3>{this.props.heading}</h3>
        <Grid columns={3}>
          <Grid.Row style={{ padding: '50px' }}>
            {this.props.array
              ? this.props.array.map((v) => (

                <Grid.Column >
                  <Grid.Row>
                    <center>
                      {v.icon}
                    </center>
                  </Grid.Row>
                  <Grid.Row>
                    <Checkbox value={v.value} name={this.props.heading} onChange={this.props.change} checked={v.checked || this.props.all} />
                    <div style={{ clear: 'both', position: 'relative', top: '-34px', left: '20px', textAlign: '10px' }}><a href={`${v.text}`} rel='noopener noreferrer' target='_blank'>{(v.text).split('/').splice(-1)}</a></div>
                    <br />
                  </Grid.Row>
                </Grid.Column>

              ))
              : <Checkbox label='invalid' onChange={this.props.change} />

            }
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
export default CheckboxExampleSlider
