import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import json5 from 'json5'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import {
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core/'
import '../../css/staff.css'
import { urls } from '../../../urls'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

class studentAssessment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      studentData: [],
      loading: false,
      right: <span style={{ color: 'green', fontSize: '15px' }}>{'\u2714'}</span>,
      wrong: <span style={{ color: 'red', fontSize: '15px' }}>{'\u2716'}</span>,
      table_bodystyle: { fontSize: '15px' }
    }
  }

    dataformat = qn => {
      let correctKey = Object.keys(json5.parse(qn.correct_ans))
      let studentAns = qn.student_response ? qn.options[qn.student_response] : ''
      let correctAnswer = qn.correct_ans ? qn.options[correctKey] : ''
      let newObj = {
        sequence: qn.sequence ? qn.sequence : '',
        question: qn.question ? ReactHtmlParser(qn.question) : '',
        your_answer: ReactHtmlParser(studentAns),
        correct_answer: ReactHtmlParser(correctAnswer),
        type: qn.is_comprehension ? 'comprehension' : 'not comprehension',
        status: studentAns === correctAnswer
      }
      return newObj
    }
    getrows = (qnObj, key) => {
      return (<TableRow key={key}>
        <TableCell style={this.state.table_bodystyle}>{qnObj.sequence}</TableCell>
        <TableCell style={this.state.table_bodystyle}>{qnObj.question}</TableCell>
        <TableCell style={this.state.table_bodystyle}>{qnObj.correct_answer}</TableCell>
        <TableCell style={this.state.table_bodystyle}>{qnObj.your_answer}</TableCell>
        <TableCell style={this.state.table_bodystyle}>{qnObj.status ? this.state.right : this.state.wrong}</TableCell>
      </TableRow>)
    }
    componentDidMount () {
      this.setState({ loading: true })
      axios
        .get(
          urls.StudentResult +
          '?student_id=' +
          this.props.match.params.id +
          '&assessment_id=' +
          this.props.match.params.id1,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          }
        )
        .then(res => {
          if (res.status === 200) {
            this.setState({ studentData: res.data, loading: false })
          } else {
            this.props.alert.error('Something went wrong, please try again')
            this.setState({ loading: false })
          }
        })
        .catch(error => {
          console.log(error)
          this.props.alert.error('Something went wrong, please try again')
          this.setState({ loading: false })
        })
    }

    render () {
      let { classes } = this.props
      let { studentData, loading } = this.state
      let tableHeadstyle = { color: 'black', fontSize: '18px', justifyContent: 'center' }
      return (
        <React.Fragment>
          <Grid>
            <Grid.Row>
              <Grid.Column
                floated='left'
                computer={5}
                mobile={5}
                tablet={5}
              >
                <label>
                  <h2 style={{ padding: '20px' }}> {'View Student Assessment' }</h2>
                </label>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          {studentData ? (
            <React.Fragment>
              <div className={classes.tableWrapper}>
                <Table>
                  <TableHead >
                    <TableRow >
                      <TableCell style={tableHeadstyle}>Sl.no</TableCell>
                      <TableCell style={tableHeadstyle}>Question</TableCell>
                      <TableCell style={tableHeadstyle}>Your Answer</TableCell>
                      <TableCell style={tableHeadstyle}>Correct Answer</TableCell>
                      <TableCell style={tableHeadstyle}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      !loading ? studentData.map((row, index) => {
                        if (row.comprehension_details) {
                          return (<>
                            <TableRow key={index}>
                              <TableCell colSpan={5} style={this.state.table_bodystyle}>
                                {
                                  ReactHtmlParser((row.comprehension_details.comprehension_question).replace(/<br\s\/>/g, ' '))}
                              </TableCell>
                            </TableRow>
                            {row.sub_question_details.map(
                              (qn, cell) => {
                                qn = this.dataformat(qn)
                                return this.getrows(qn, cell)
                              }
                            )}
                          </>)
                        } else {
                          let qn = this.dataformat(row)
                          console.warn(qn)
                          return this.getrows(qn, qn.sequence)
                        }
                      })
                        : 'loading'
                    }
                  </TableBody>
                </Table>
              </div>
            </React.Fragment>
          ) : (
            <div>no data</div>
          )}
        </React.Fragment>
      )
    }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(
  withStyles(styles)(withRouter(studentAssessment))
)
