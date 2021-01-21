import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  withStyles, Table, TableBody, TableCell,
  TableHead, TableRow
} from '@material-ui/core/'
import '../css/staff.css'
import { urls } from '../../urls'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

class practiceQuesDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount () {
    var data = []
    this.setState({ loading: true })
    axios
      .get(urls.PracticeQuestionDashboard, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          console.log(res)
          res.data.top_list.forEach((val) => {
            console.log(val.attempted)
            data.push({
              subject_name: val.subject_name ? val.subject_name : '',
              chapter_name: val.chapter_name ? val.chapter_name : '',
              grade: val.grade ? val.grade : '',
              attempted: val.attempted,
              unattempted: val.unattempted ? val.unattempted : ''
            })
          })
          this.setState({ assessmentData: data, loading: false })
        } else {
          this.setState({
            alertMessage: {
              messageText: 'Error: Something went wrong, please try again',
              variant: 'error',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
      })
      .catch(error => {
        console.log(error.response)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
  }

  render () {
    let { classes } = this.props
    let { assessmentData } = this.state
    console.log(this.state.assessmentData)
    return (
      <React.Fragment>
        <div >
          <Grid >
            <Grid.Row>
              <Grid.Column computer={16} className='student-addStudent-StudentSection'>
                {/* <Paper style={{ marginTop: -50 }}> */}
                {/* <Grid>
                    <Grid.Row>
                      <Grid.Column
                        floated='left'
                        computer={5}
                        mobile={5}
                        tablet={5}
                      >
                        <label className='student-addStudent-segment1-heading'>
                          Practice Question Dashboard
                        </label>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid> */}
                {assessmentData &&
                  <React.Fragment>
                    <div className={classes.tableWrapper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Sr.</TableCell>
                            <TableCell>Subject Name</TableCell>
                            <TableCell>Chapter Name</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Attempted</TableCell>
                            <TableCell>Unattempted</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {assessmentData.length > 0 ? assessmentData.map((row, index) => {
                            return (
                              <React.Fragment>
                                <TableRow hover >
                                  <TableCell>{++index}</TableCell>
                                  <TableCell>{row.subject_name}</TableCell>
                                  <TableCell>{row.chapter_name}</TableCell>
                                  <TableCell>{row.grade}</TableCell>
                                  <TableCell>{row.attempted}</TableCell>
                                  <TableCell>{row.unattempted}</TableCell>
                                </TableRow>
                              </React.Fragment>
                            )
                          }) : <React.Fragment>
                            <TableRow hover >
                              <TableCell rowSpan={7}>No data found</TableCell>
                            </TableRow>
                          </React.Fragment>
                          }
                        </TableBody>
                      </Table>
                    </div>
                  </React.Fragment>}
                {/* </Paper> */}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(withStyles(styles)(withRouter(practiceQuesDashboard)))
