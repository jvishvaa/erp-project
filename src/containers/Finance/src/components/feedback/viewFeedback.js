import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Typography, Grid, Chip, Card, CardContent, CardActions,
  Button, TextField } from '@material-ui/core/'
import moment from 'moment'
import { urls } from '../../urls'
import { OmsSelect, Toolbar } from '../../ui'
import { apiActions } from '../../_actions'

class ViewFeedback extends React.Component {
  constructor () {
    super()
    this.updatedId = []
    this.state = {
      feedbackData: []
    }
    this.userDetails = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userDetails.personal_info.role
    this.handleBranchChange = this.handleBranchChange.bind(this)
    this.handleGradeChange = this.handleGradeChange.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
  }

  componentDidMount () {
    if (this.role === 'Student') {
      this.setState({ feedbackData: this.props.feedbackData })
    } else {
      let url = urls.Feedback
      if (this.role === 'Principal') {
        let branchId = this.userDetails.academic_profile.branch_id
        let branchName = this.userDetails.academic_profile.branch
        url = url + '?branch_id=' + branchId
        this.setState({
          branchId,
          valueBranch: [{ label: branchName, value: branchId }]
        })
        this.props.gradeMapBranch(this.userDetails.academic_profile.branch_id)
      } else {
        this.props.branchList()
      }
      this.getFeedbackData(url)
    }
  }

  handleBranchChange (event) {
    this.setState({
      branchId: event.value,
      valueBranch: event,
      valueGrade: [],
      valueSection: [],
      gradeMapId: null,
      sectionMapId: null
    })
    this.props.gradeMapBranch(event.value)
  }

  handleGradeChange (event) {
    this.setState({
      gradeMapId: event.value,
      valueGrade: event,
      valueSection: [],
      sectionMapId: null
    })
    this.props.sectionMap(event.value)
  }

  handleFilter () {
    let { branchId, gradeMapId, sectionMapId, date } = this.state
    let url = urls.Feedback
    if (date && !branchId) {
      url = url + '?start_date=' + date
    } else if (branchId && !date) {
      url = url + '?branch_id=' + branchId
    } else if (branchId && date) {
      url = url + '?branch_id=' + branchId + '&start_date=' + date
    }
    if (gradeMapId) {
      url = url + '&grade_map_id=' + gradeMapId
    }
    if (sectionMapId) {
      url = url + '&section_map_id=' + sectionMapId
    }
    this.getFeedbackData(url)
  }

  getFeedbackData (url) {
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ feedbackData: res.data })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        console.log(error.response)
      })
  }

  render () {
    let { feedbackData, valueBranch, valueGrade, valueSection } = this.state
    console.log(this.state.feedbackData)
    return (
      <React.Fragment>
        {this.role !== 'Student' &&
        <Toolbar>
          <OmsSelect
            label='Branch'
            placeholder='Select Branch'
            options={this.props.branch
              ? this.props.branch
                .map(branch => ({ value: branch.id, label: branch.branch_name }))
              : []
            }
            change={this.handleBranchChange}
            defaultValue={valueBranch}
            disabled={this.role === 'Principal'}
          />
          <OmsSelect
            label='Grade'
            placeholder='Select Grade'
            options={this.props.grade
              ? this.props.grade
                .map(grade => ({ value: grade.id, label: grade.grade.grade }))
              : []
            }
            change={this.handleGradeChange}
            defaultValue={valueGrade}
          />
          <OmsSelect
            label='Section'
            placeholder='Select Section'
            options={this.props.section
              ? this.props.section
                .map(section => ({ value: section.id, label: section.section.section_name }))
              : []
            }
            change={e => this.setState({ sectionMapId: e.value, valueSection: e })}
            defaultValue={valueSection}
          />
          <TextField
            id='date'
            label='Date'
            type='date'
            margin='normal'
            defaultValue={this.state.date}
            onChange={e => this.setState({ date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <Button onClick={this.handleFilter}> Filter </Button>
        </Toolbar>
        }
        {feedbackData.length > 0
          ? feedbackData.map((data, index) =>
            <Grid key={index} style={{ padding: 16 }} item>
              <Card>
                <div>
                  <CardContent>
                    <Typography component='h5' variant='h5'>
                      {data.subject}
                    </Typography>
                    <Typography variant='subtitle1' color='textSecondary'>
                      {data.message}
                    </Typography>
                  </CardContent>
                </div>
                <CardActions>
                  <Chip label={moment(data.created_date).format('MMMM Do YYYY, h:mm:ss a')} />
                  {this.role !== 'Student' && <div>
                    <Chip label={data.user_id && data.user_id.id} />
                    <Chip label={data.user_id && data.user_id.student && data.user_id.student.branch.branch_name} />
                    <Chip label={data.user_id && data.user_id.student && data.user_id.student.grade.grade} />
                    <Chip label={data.user_id && data.user_id.student && data.user_id.student.section.section_name} />
                  </div> }
                </CardActions>
              </Card>
            </Grid>
          )

          : <Typography variant='h6'> No Feedback Given </Typography>
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branch: state.branches.items,
  grade: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading,
  section: state.sectionMap.items,
  sectionLoading: state.sectionMap.loading
})

const mapDispatchToProps = dispatch => ({
  branchList: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadId => dispatch(apiActions.getSectionMapping(acadId))
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewFeedback)
