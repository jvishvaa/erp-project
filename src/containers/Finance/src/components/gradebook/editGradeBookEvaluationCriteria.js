import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { Grid,
  Button
} from '@material-ui/core'

import TextField from '@material-ui/core/TextField'
import AuthService from '../AuthService'
import { urls } from '../../urls'
import { OmsSelect } from '../../ui'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/gradeBookEvalCriteriaCombinations'
import '../css/staff.css'

const criteriaOption = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Competition', value: 'Competition' }
]
class EditGradebookEvaluationCriteria extends Component {
  constructor (props) {
    super(props)
    this.props = props
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = { termList: [] }
  }
  getTerms = async () => {
    let res = await axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }
  componentDidMount () {
    this.getTerms()
      .then(result => { this.setState({ termList: result.data }) })
      .catch(err => { console.log(err) })
    var Update = urls.GRADEBOOKEVALUATION + this.props.match.params.id + '/'
    axios
      .get(Update, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res.data)
        this.setState({
          result: res.data,
          gradebookEvaluationCategory: res.data[0].gradebook_evaluation_category,
          percentageContribution: res.data[0].percentage_contribution,
          totalScore: res.data[0].total_score,
          totalEvaluations: res.data[0].total_evaluations,
          consideredEvaluations: res.data[0].considered_evaluations,
          term: res.data[0].term.term,
          termId: res.data[0].term.id,
          grade: res.data[0].grade.id,
          subject: res.data[0].subject.id,
          criteriaType: res.data[0].criteria_type

        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  handleTermChange = (data) => {
    this.setState({ term: data.label, termId: data.value
    })
  }
  handleCriteria = (data) => {
    this.setState({ criteriaType: data.label })
  }
  onChange = (data) => {
    this.setState({ grade_id: data.grade_id, subject_id: data.subject_id })
  }
  handleSubmit = () => {
    var formData = new FormData()
    formData.append('grade_id', this.state.grade_id)
    formData.append('gb_eval_cri_id', this.props.match.params.id)
    formData.append('subject_id', this.state.subject_id)
    formData.append('gradebook_evaluation_category', this.state.gradebookEvaluationCategory)
    formData.append('percentage_contribution', this.state.percentageContribution)
    formData.append('total_score', this.state.totalScore)
    formData.append('total_evaluations', this.state.totalEvaluations)
    formData.append('considered_evaluations', this.state.consideredEvaluations)
    formData.append('criteria_type', this.state.criteriaType)
    formData.append('term', this.state.termId)
    console.log(urls.GRADEBOOKEVALUATION)
    axios
      .put(urls.GRADEBOOKEVALUATION, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }

      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('GradeBookEvaluation Updated Successfully')
        } else {
          this.props.alert.error('Error Occured')
        }
      }).catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  render () {
    console.log(this.state.result, this.state.gradebookEvaluationCategory)
    return (
      <React.Fragment>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} style={{ padding: '20px' }}>
            {this.state.subject && this.state.grade && <GSelect initialValue={{ grade_id: this.state.grade, subject_id: this.state.subject }} onChange={this.onChange} variant={'selector'} config={COMBINATIONS} />}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              type='text'
              label='Grade Book Evaluation Category*'
              onChange={e => this.setState({ gradebookEvaluationCategory: e.target.value })}
              value={this.state.gradebookEvaluationCategory}
              InputLabelProps={{
                shrink: true
              }}
            />    </Grid>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              type='number'
              label='Percentage Contribution*'
              defaultValue={this.state.percentageContribution}
              onChange={e => this.setState({ percentageContribution: e.target.value })}
              value={this.state.percentageContribution}
              InputLabelProps={{
                shrink: true
              }}
            /> </Grid>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              type='number'
              label='Total Score'
              defaultValue={this.state.totalScore}
              onChange={e => this.setState({ totalScore: e.target.value })}
              value={this.state.totalScore}
              InputLabelProps={{
                shrink: true
              }}
            /> </Grid>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              label='Total Evaluations'
              onChange={e => this.setState({ totalEvaluations: e.target.value })}
              value={this.state.totalEvaluations}
              defaultValue={this.state.totalEvaluations}
              type='number'
              InputLabelProps={{
                shrink: true
              }}
            /> </Grid>
          <Grid item style={{ padding: '10px' }}>
            <TextField
              style={{ width: 250 }}
              required
              id='outlined-basic'
              margin='normal'
              label='Considered Evaluations'
              onChange={e => this.setState({ consideredEvaluations: e.target.value })}
              value={this.state.consideredEvaluations}
              type='number'
              defaultValue={this.state.consideredEvaluations}

              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item style={{ padding: '10px' }}>
            <OmsSelect
              label='Criteria Type'
              name='Criteria Type'
              placeholder='Select Criteria'
              change={this.handleCriteria}
              defaultValue={{ label: this.state.criteriaType, value: this.state.criteriaType }}
              options={criteriaOption}
            />
          </Grid>
          <Grid item style={{ padding: '10px' }}>
            <OmsSelect
              label={'Term'}
              options={this.state.termList.map((term) => {
                return { label: term.term, value: term.id, locked: term.locked }
              })}
              change={this.handleTermChange}
              defaultValue={{ label: this.state.term, value: this.state.termId }}
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
              Update Evaluation Criteria
            </Button>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;

            <Button
              style={{ marginTop: '25px',
                marginRight: '25px' }}
              variant='contained'
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
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withRouter(EditGradebookEvaluationCriteria))
