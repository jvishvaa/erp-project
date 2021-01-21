import React from 'react'
// import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// // import Draggable from 'react-draggable'
// import Card from '@material-ui/core/Card'
// import CardHeader from '@material-ui/core/CardHeader'
// import Paper from '@material-ui/core/Paper'
// import Grid from '@material-ui/core/Grid'
import TableCell from '@material-ui/core/TableCell'
// import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { Typography } from '@material-ui/core'
// import Button from '@material-ui/c//ore/Button'
// import RGL, { WidthProvider } from 'react-grid-layout'
import axios from 'axios'
// import { Table } from 'material-ui'

const styles = theme => ({
  root: {
    flexGrow: 2
  },
  paper: {
    padding: theme.spacing.unit * 4,
    textAlign: 'center',
    color: theme.palette.text.primary,
    cursor: 'move'
  }
})

class UniformReport extends React.Component {
  constructor () {
    super()
    this.state = {
      uniformData: null,
      data: null
    }
    this.onLayoutChange = this.onLayoutChange.bind(this)
  }
  componentDidMount () {
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
    // let studentId = JSON.parse(localStorage.getItem('user_profile')).student_id
    // this.userToken = JSON.parse(localStorage.getItem('id_token'))
    console.log(this.role)
    console.log(this.props)
    axios.get('http://localhost:8000/qbox/store/uniform/retreive-uniform-size/', {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })
      .then(res => {
        this.setState({ data: res.data })
        console.log(res)
        var result = []
        var result1 = []
        var keys = Object.keys(res.data)
        keys.forEach(function (key) {
          // result.push(key + ':' + res.data[key])
          result.push(res.data[key])
          result1.push(key)
        })
        console.log('uniform', result)
        console.log('key', result1)
        result1.shift('id')
        this.setState({ uniformData: result1 })
      })
      .catch(error => {
        console.log(error)
      })
  }
  onLayoutChange (layout) {
    console.log(layout)
    this.props.onLayoutChange && this.props.onLayoutChange(layout)
  }
  mapsubshell (res) {
    return Object.keys(this.state.data[res]).map(r => {
      return (
        <React.Fragment>
          <TableCell variant='body' align='justify' padding='none' style={{ fontSize: '15px', paddingLeft: '35px', wordSpacing: '5px' }}>
            {r}   :   {this.state.data[res][r]} {this.state.data[res][r] === 0 ? 'inch' : 'inches'}
          </TableCell> <br />
        </React.Fragment>)
    })
  }
  render () {
    let tableDataUniform = null
    let tableData = null

    tableData = this.state.uniformData && this.state.uniformData.map(res => {
      return (
        <div>
          <TableRow >
            <TableCell>
              <Typography><b style={{ fontSize: '20px' }}>{res}</b>  </Typography><div><Typography >{this.mapsubshell(res)}</Typography></div>
            </TableCell>
          </TableRow>
        </div>
      )
    })
    console.log('tabledata', tableData)
    tableDataUniform = (
      <div>
        {tableData}
      </div>
    )
    console.log('tableDatatUniform', tableDataUniform)
    return (
      <React.Fragment>
        <div>
          {tableDataUniform}
        </div>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(UniformReport)
