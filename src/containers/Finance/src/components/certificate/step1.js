/* eslint-disable no-undef */

import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

const useStyles = theme => ({
  root: {
    width: '35vw',
    display: 'block',
    margin: '0 auto'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  under__line: {
    'margin-top': '2%',
    'margin-bottom': '2%',
    'border-bottom': '2px solid #5d2449'
  }
})

class Step1 extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    let { role } = this.props

    this.setState({ role: role })
  }

    handleChange = (event) => {
      console.log(event.target.value)
      this.setState({ value: event.target.value })

      this.props.handleNavingation(event.target.value)
    }
    render () {
      let { classes } = this.props
      let { role } = this.state
      return (
        <Grid>
          <div className={classes.under__line} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={3} />
            <Grid item xs={12} sm={6} md={6}>
              <Card className={classes.root} variant='outlined'>
                <CardContent>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Recipient</FormLabel>
                    <RadioGroup aria-label='gender' name='gender1' value={role} onChange={this.handleChange} defaultValue={role}>
                      <FormControlLabel value='Student' control={<Radio />} label='Students' />
                      <FormControlLabel disabled value='Teacher' control={<Radio />} label='Teacher' />
                      <FormControlLabel disabled value='Staff' control={<Radio />} label='Staff' />
                      <FormControlLabel disabled value='Coordinators' control={<Radio />} label='Co-Ordinators' />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3} md={3} />
          </Grid>
        </Grid>
      )
    }
}

export default withRouter(withStyles(useStyles)(Step1))
