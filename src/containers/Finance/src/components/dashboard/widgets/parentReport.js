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

const styles = theme => ({
  root: {
    flexGrow: 2
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.primary,
    cursor: 'move'
  }
})

class AutoGrid extends React.Component {
  constructor () {
    super()
    this.state = {
      parentData: {}
    }
    this.onLayoutChange = this.onLayoutChange.bind(this)
  }
  componentDidMount () {
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
    let studentId = JSON.parse(localStorage.getItem('user_profile')).student_id
    // this.userToken = JSON.parse(localStorage.getItem('id_token'))
    console.log(this.role)
    console.log(this.props)
    axios.get('http://localhost:8000/qbox/accounts/student/' + studentId, {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })
      .then(res => {
        console.log(res)
        const { parent, student } = res.data[0]
        console.log(parent)
        console.log(student)
        this.setState({ parentData: parent })
        // this.setState({ name: res.data[0].student.grade })
      })
      .catch(error => {
        console.log(error)
      })
  }
  onLayoutChange (layout) {
    console.log(layout)
    this.props.onLayoutChange && this.props.onLayoutChange(layout)
  }
  render () {
    console.log(this.parent)
    // const { classes } = this.props
    return (
      <React.Fragment>
        <TableRow>
          <TableCell ><Typography><b>Father Name: </b></Typography> </TableCell>
          <TableCell >{this.state.parentData.father_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell ><Typography><b>Phone: </b></Typography> </TableCell>
          <TableCell >{this.state.parentData.father_mobile}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell ><Typography><b>Email: </b></Typography> </TableCell>
          <TableCell >{this.state.parentData.father_email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell ><Typography><b>Mother Name:  </b></Typography> </TableCell>
          <TableCell >{this.state.parentData.mother_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell ><Typography><b>Phone:  </b></Typography> </TableCell>
          <TableCell >{this.state.parentData.mother_mobile}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell ><Typography><b>Email:  </b></Typography> </TableCell>
          <TableCell >{this.state.parentData.mother_email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell ><Typography><b>Guardian Address:</b></Typography> </TableCell>
          <TableCell >{this.state.parentData.address}</TableCell>
        </TableRow>

      </React.Fragment>
    )
  }
}
export default withStyles(styles)(AutoGrid)
