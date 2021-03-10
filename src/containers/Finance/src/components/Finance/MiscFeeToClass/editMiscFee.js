import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { Button, Grid } from '@material-ui/core/'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../css/staff.css'
import { urls } from '../../../urls'

var grade = []
class EditMiscFee extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addGrade: []
    }
    this.handlevalue.bind(this)
  }

  componentDidMount () {
    axios
      .get(urls.GradeList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        grade = res.data
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.GRADE + error)
      })

    var updatedList = urls.MiscFee + this.props.match.params.id + '/'
    axios
      .get(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var arr = res.data
        this.setState({ feeData: arr })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.MiscFee + error)
      })
  }

  handleChangeInput = (e, id) => {
    console.log('handle', id)
    let data = this.state.feeData
    data.forEach((val, i) => {
      let currentGrade = val.grades.filter(list => list.mapping_id === id)
      console.log('currentGrade', currentGrade)
      currentGrade.forEach((v, i) => {
        v.amount = e.target.value
      })
    })
    this.setState({ feeData: data })
    // this.forceUpdate()
  }

  handlevalue = e => {
    e.preventDefault()
    var updatedList = urls.MiscFee
    axios
      .put(updatedList, this.state.feeData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (+res.status === 200) {
          this.props.alert.success('Updated Successfully')
        }
      })
      .catch((error) => {
        this.props.alert.error('Something Went Wrong')
        console.log("Error: Couldn't fetch data from " + urls.MiscFee + error)
      })
  }

  render () {
    console.log(this.state.feeData)
    return (
      <React.Fragment>
        <Form onSubmit={this.handlevalue}>
          <Grid container spacing={3} style={{ padding: '15px' }}>
            <Grid item xs='5'>
              <label className='student-addStudent-segment1-heading'>
              Edit Fee type to class
              </label>
            </Grid>
          </Grid>
          <Grid container spacing={3} direction='column' style={{ padding: '15px' }}>
            <React.Fragment>
              {this.state.feeData &&
            this.state.feeData.map((data) => {
              return grade.map((grade) => {
                let currentGrade = data.grades.filter(gradelist => gradelist.grade_id === grade.id)
                if (currentGrade.length > 0) {
                  console.log(grade)
                  return (
                    <Grid item xs='3'>
                      <label>{grade.grade}</label>
                      <input
                        type='number'
                        name={currentGrade[0].mapping_id}
                        value={currentGrade[0].amount}
                        onChange={(e) => { this.handleChangeInput(e, currentGrade[0].mapping_id) }}
                      />
                    </Grid>
                  )
                }
              })
            }) }
            </React.Fragment>
            <Grid item xs='5'>
              <Button type='submit' color='primary' variant='contained'>
                Update
              </Button>
              <Button color='primary' variant='contained' style={{ marginLeft: '10px' }} onClick={this.props.history.goBack} type='button'>Return</Button>
            </Grid>
          </Grid>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)((withRouter(EditMiscFee)))
