import React, { Component } from 'react'
import { Card, Grid } from 'semantic-ui-react'
import power from './power.png'
import Trignometry from './Trignometry.png'
import SquareRoot from './SquareRoot.png'
import addition from './addition.png'
import multiplication from './multiplication.png'
import deletion from './deletion.png'

class MathsDocumentation extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <Grid>
        <div style={{ marginLeft: 10, marginTop: 20 }} ><b>Operators:</b><hr style={{ marginLeft: '5px', width: 70 }} /></div>
        <Grid.Row>
          <div style={{ marginLeft: '30px', marginTop: '10px' }}><b>+ operator:</b></div>
          <Card style={{ marginTop: '40px' }}>
            <div style={{ marginLeft: '30px', marginTop: '10px' }}> <b> example:</b></div>

            <div style={{ marginLeft: '60px', marginTop: '10px' }}>&nbsp;<img src={addition} align='absmiddle' />===> &nbsp; $$&nbsp; 3 + 4 &nbsp;$$</div>
          </Card>

          <div style={{ marginLeft: '100px', marginTop: '10px' }}><b>- operator:</b></div>
          <Card style={{ marginTop: '40px' }}>
            <div style={{ marginLeft: '30px', marginTop: '10px' }}><b> example:</b></div>
            <div style={{ marginLeft: '60px', marginTop: '10px' }}>  &nbsp;<img src={deletion} align='absmiddle' />&nbsp; ===> &nbsp; $$&nbsp; 3 - 4 &nbsp;$$</div>
          </Card>
        </Grid.Row>
        <div style={{ marginLeft: '10px', marginTop: '10px' }}><b> * operator:</b></div>
        <Card style={{ marginTop: '40px' }}>
          <div style={{ marginLeft: '30px', marginTop: '10px' }}> <b>example:</b></div>

          <div style={{ marginLeft: '60px', marginTop: '10px' }}> &nbsp; <img src={multiplication} align='absmiddle' /> &nbsp; ===>  &nbsp;$$ &nbsp;3*4 &nbsp;$$</div>
        </Card>
        <div style={{ marginLeft: '60px', marginTop: '10px' }}> <b>^ operator:</b></div>
        <Card style={{ marginTop: '40px', width: 320 }}>
          <div style={{ marginLeft: '30px', marginTop: '10px' }}> <b>example:</b></div>
          <div style={{ marginLeft: '60px', marginTop: '10px', display: 'inline-block' }}> &nbsp; <img src={power} align='absmiddle' />&nbsp;  ===>   &nbsp;$$ &nbsp;3 ^2+ 4^2 &nbsp;$$</div>
        </Card>
        <Grid.Row>
          <div style={{ marginLeft: 20 }}><b>Trignometry:</b><hr style={{ marginLeft: '5px', width: 70 }} /> </div>
          <Card style={{ marginTop: '40px', width: 700 }} >
            <div style={{ marginLeft: '30px', marginTop: '10px' }}> <b>  example:</b></div>
            <span style={{ marginLeft: '60px', marginTop: '10px' }}><img src={Trignometry} align='absmiddle' /> &nbsp;===> &nbsp; $$&nbsp; \\&nbsp;sin&nbsp;  ^&nbsp;2&nbsp;\\&nbsp;theta&nbsp; + &nbsp;\\&nbsp;cos&nbsp;^&nbsp;2 &nbsp;\\&nbsp;theta &nbsp;=&nbsp;1&nbsp;$$</span>
          </Card>
        </Grid.Row>
        <Grid.Row>
          <div style={{ marginLeft: 20 }}><b>SquareRoots:</b><hr style={{ marginLeft: '5px', width: 70 }} /> </div>
          <Card style={{ marginTop: '40px' }}>
            <div style={{ marginLeft: '30px', marginTop: '10px' }}> <b>  example:</b></div>
            <div style={{ marginLeft: '60px', marginTop: '10px' }}> &nbsp;  <img src={SquareRoot} align='absmiddle' />&nbsp;  ===>   &nbsp;$$  &nbsp;\\ &nbsp;sqrt&nbsp;{25}&nbsp;$$</div>
          </Card>
        </Grid.Row>
      </Grid>
    )
  }
}

export default MathsDocumentation
