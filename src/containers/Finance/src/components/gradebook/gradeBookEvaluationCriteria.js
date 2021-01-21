import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Grid,
  Button
} from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/gradeBookEvalCriteriaCombinations'
import { OmsSelect } from '../../ui'
import { urls } from '../../urls'

const criteriaOption = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Competition', value: 'Competition' }
]

class GradebookEvaluationCriteria extends Component {
  constructor () {
    super()
    this.state = {
      considerEvaluations: '',
      totalEvaluations: '',
      totalScore: '',
      category: '',
      percentageContribution: '',
      gradeBookCrieteriaData: [],
      coScholasticData: [],
      currentTab: 0,
      termList: [],
      selectedTermId: null
    }
    this.onChange = this.onChange.bind(this)
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  componentDidMount () {
    this.getTerms()
      .then(result => { this.setState({ termList: result.data }) })
      .catch(err => { console.log(err) })
  }

  getTerms = async () => {
    let res = await axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }
  handleTermChange = (data) => {
    this.setState({ selectedTermId: data.value
    })
  }
  handleCriteria = (data) => {
    this.setState({ criteriaOption: data.label })
  }
  onChange = (data) => {
    this.setState({ grade_id: data.grade_id, subject_id: data.subject_id })
  }
  handleSubmit = () => {
    if (!this.state.grade_id || !this.state.subject_id || !this.state.category || !this.state.percentageContribution || !this.state.totalScore || !this.state.totalEvaluations || !this.state.considerEvaluations || !this.state.criteriaOption || !this.state.selectedTermId) {
      this.props.alert.warning('Select All fields')
      return
    }
    var formData = new FormData()
    formData.append('grade_id', this.state.grade_id)
    formData.append('subject_id', this.state.subject_id)
    formData.append('gradebook_evaluation_category', this.state.category)
    formData.append('percentage_contribution', this.state.percentageContribution)
    formData.append('total_score', this.state.totalScore)
    formData.append('total_evaluations', this.state.totalEvaluations)
    formData.append('considered_evaluations', this.state.considerEvaluations)
    formData.append('criteria_type', this.state.criteriaOption)
    formData.append('term', this.state.selectedTermId)
    console.log(urls.GRADEBOOKEVALUATION)
    axios
      .post(urls.GRADEBOOKEVALUATION, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }

      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('GradeBookEvaluation Added Successfully')
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  render () {
    let { category, percentageContribution, totalScore, totalEvaluations, considerEvaluations } = this.state
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} style={{ padding: '20px' }}>
            <GSelect onChange={this.onChange} variant={'selector'} config={COMBINATIONS} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              variant='outlined'
              type='text'
              onChange={e => this.setState({ category: e.target.value })}
              value={category}
              label='Grade Book Evaluation Category'
            />    </Grid>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              variant='outlined'
              type='number'
              onChange={e => this.setState({ percentageContribution: e.target.value })}
              value={percentageContribution}
              label='Percentage Contribution'
            /> </Grid>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              variant='outlined'
              type='number'
              label='Total Score'
              onChange={e => this.setState({ totalScore: e.target.value })}
              value={totalScore}
            /> </Grid>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              onChange={e => this.setState({ totalEvaluations: e.target.value })}
              value={totalEvaluations}
              variant='outlined'
              type='number'
              label='Total Evaluations'
            /> </Grid>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              variant='outlined'
              onChange={e => this.setState({ considerEvaluations: e.target.value })}
              value={considerEvaluations}
              type='number'
              label='Considered Evaluations'
            />
          </Grid>
          <Grid item style={{ padding: '10px' }}>
            <OmsSelect
              label='Criteria Type'
              name='Criteria Type'
              placeholder='Select Criteria'
              change={this.handleCriteria}

              options={criteriaOption}
              // defaultValue={this.state.keeperValue}
            />
          </Grid>
          <Grid item style={{ padding: '10px' }}>
            <OmsSelect
              label={'Term'}
              options={this.state.termList.map((term) => {
                return { label: term.term, value: term.id, locked: term.locked }
              })}
              change={this.handleTermChange}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item style={{ padding: '10px' }} >
            <Button
              style={{ marginTop: '25px',
                marginRight: '25px' }}
              variant='contained'
              color='primary'
              onClick={this.handleSubmit}
            >
              ADD Evaluation
            </Button>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;

            <Button
              style={{ marginTop: '25px',
                marginRight: '25px' }}
              variant='contained'
              colorInherit
              color='primary'
              onClick={this.props.history.goBack}
            >
              Return
            </Button>

          </Grid>
        </Grid>
      </React.Fragment>

    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  subject: state.subjects.items,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading
})

export default connect(
  mapStateToProps
)(withRouter(GradebookEvaluationCriteria))
