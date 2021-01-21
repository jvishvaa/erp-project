import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import {
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { urls } from '../../../urls'
import '../../css/staff.css'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

class assessmentDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    var data = []
    if (this.props.match.params.id1 === 'NAN') {
      this.props.alert.error('No Data Available')
    } else {
      axios
        .get(
          urls.AssessmentSectionWise +
            '?assess_id=' +
            this.props.match.params.id +
            '&sec_map_id=' +
            this.props.match.params.id1,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          }
        )
        .then(res => {
          if (res.status === 200) {
            res.data.forEach(val => {
              data.push({
                id: val.student ? val.student.id : '',
                student_name: val.student ? val.student.name : '',
                student_roll_no: val.student ? val.student.roll_no : '',
                // total_mark: val.total_mark ? val.total_mark : '',
                total_mark: val.assesment.max_marks ? val.assesment.max_marks : '',
                marks_obtained: val.marks_obtained ? val.marks_obtained : '',
                is_attempted: val.is_attempted_assessment ? 'Yes' : 'No'
              })
            })
            this.setState({ assessmentData: data })
          } else {
            this.props.alert.error('Something went wrong, please try again')
          }
        })
        .catch(error => {
          console.log(error)
          this.props.alert.error('Something went wrong, please try again.')
        })
    }
  }

  render () {
    let { classes } = this.props
    let { assessmentData } = this.state
    return (
      <React.Fragment>
        <Grid>
          <Grid.Row>
            <Grid.Column
              computer={16}
            >
              <Grid>
                <Grid.Row>
                  <Grid.Column
                    floated='left'
                    computer={10}
                    mobile={10}
                    tablet={10}
                  >
                    <label>
                      Section Wise Assessment Detail
                    </label>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              {assessmentData && (
                <React.Fragment>
                  <div className={classes.tableWrapper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr.</TableCell>
                          <TableCell>Student Name</TableCell>
                          <TableCell>Student Roll No</TableCell>
                          <TableCell>Total Mark</TableCell>
                          <TableCell>Marks Obtained</TableCell>
                          <TableCell>Is Attempted</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assessmentData.map((row, index) => {
                          return (
                            <React.Fragment>
                              <TableRow
                                hover
                                onClick={e => {
                                  e.stopPropagation()
                                  this.props.history.push(
                                    '/questbox/assessment/view/section/student/' +
                                          row.id +
                                          '/' +
                                          this.props.match.params.id
                                  )
                                }}
                              >
                                <TableCell>{++index}</TableCell>
                                <TableCell>{row.student_name}</TableCell>
                                <TableCell>{row.student_roll_no}</TableCell>
                                <TableCell>{row.total_mark}</TableCell>
                                <TableCell>{row.marks_obtained}</TableCell>
                                <TableCell>{row.is_attempted}</TableCell>
                              </TableRow>
                            </React.Fragment>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </React.Fragment>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(
  withStyles(styles)(withRouter(assessmentDetail))
)
