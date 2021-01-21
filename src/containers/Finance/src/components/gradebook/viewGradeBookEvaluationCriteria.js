import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Face from '@material-ui/icons/Face'
import { Typography, Chip, Avatar } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/gradeBookEvalCriteriaCombinations'
import { RouterButton, Toolbar, OmsSelect } from '../../ui'
import { urls } from '../../urls'

const addGradeBookEvaluationCriteria = {
  label: 'Add GradeBook Evaluation Criteria',
  color: 'blue',
  href: 'add',
  disabled: false
}

const gradeBookEvaluationCriteriaTermCopy = {
  label: 'Term Copy',
  color: 'blue',
  href: 'copy/term',
  disabled: false
}

class ViewGradebookEvaluationCriteria extends Component {
  constructor () {
    super()
    this.state = {
      currentPage: 1,
      scrolled: false,
      loading: false,
      termList: []
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  getTerms = async () => {
    let res = await axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }
  getGradeBookEvaluations = (path) => {
    axios.get(`${urls.GRADEBOOKEVALUATION}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          gradeBookEvaRes: res.data.data, totalPages: res.data.total_pages
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  componentDidMount () {
    this.getTerms()
      .then(result => { this.setState({ termList: result.data }) })
      .catch(err => { console.log(err) })
    let path = ''
    path += `?page_number=${this.state.currentPage}`
    this.getGradeBookEvaluations(path)
  }
  handleScroll = (event) => {
    if (event.target.scrollTop === 0) {
      return
    } let { currentPage } = this.state
    console.log(currentPage)
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      let path = ''
      path += '?page_number=' + Number(currentPage + 1)
      if (this.state.grade_id && this.state.subject_id && this.state.selectedTermId) {
        let gradeId = this.state.grade_id
        let subjectId = this.state.subject_id
        path += `&grade_id=${gradeId}&subject_id=${subjectId}&term_id=${this.state.selectedTermId}`
      } else if (this.state.grade_id && this.state.selectedTermId) {
        let gradeId = this.state.grade_id
        path += `&grade_id=${gradeId}&term_id=${this.state.selectedTermId}`
      } else if (this.state.selectedTermId) {
        path += `&term_id=${this.state.selectedTermId}`
      }

      axios.get(`${urls.GRADEBOOKEVALUATION}${path}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.data.length) {
            this.setState({
              currentPage: Number(this.state.currentPage) + 1,
              gradeBookEvaRes: [...this.state.gradeBookEvaRes, ...res.data.data]
            })
          }
        })
    }
  }
  handleDelete (id) {
    axios
      .delete(urls.GRADEBOOKEVALUATION + '?grade_eva_cri_id=' + id, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Gradebook evaluation criteria has been deleted Successfully')
          let path = ''
          path += `?page_number=${this.state.currentPage}`
          this.getGradeBookEvaluations(path)
        }
        this.setState({ loading: true })
      })
      .catch(error => {
        if (error.ressponse && error.ressponse.status === 204) {
          this.props.alert.error('Gradebook Evaluation Criteria Does not exist')
        }
        console.log(error)
      })
  }

  onChange = (data) => {
    // let container = document.getElementById('scroll-container')
    // container.scrollTop = 0
    this.setState({ gradeBookEvaRes: [], grade_id: data.grade_id, subject_id: data.subject_id, currentPage: 1 })
  }

  get=(pageNumber) => {
    this.setState({ gradeBookEvaRes: [], currentPage: 1 })
    let path = ''
    if (this.state.grade_id && this.state.subject_id && this.state.selectedTermId) {
      let gradeId = this.state.grade_id
      let subjectId = this.state.subject_id
      path += `?page_number=${this.state.currentPage}&grade_id=${gradeId}&subject_id=${subjectId}&term_id=${22}`
      this.getGradeBookEvaluations(path)
    } else if (this.state.grade_id && this.state.selectedTermId) {
      let gradeId = this.state.grade_id
      path += `?page_number=${this.state.currentPage}&grade_id=${gradeId}&term_id=${22}`
      this.getGradeBookEvaluations(path)
    } else if (this.state.selectedTermId) {
      path += `?page_number=${this.state.currentPage}&term_id=${22}`
      this.getGradeBookEvaluations(path)
    }
  }
  handleTermChange = (data) => {
    this.setState({ selectedTermId: data.value
    })
  }
  render () {
    return (
      <React.Fragment>

        <Toolbar
          floatRight={
            <React.Fragment>
              <RouterButton color='primary' value={addGradeBookEvaluationCriteria} />
              <RouterButton color='primary' value={gradeBookEvaluationCriteriaTermCopy} />

            </React.Fragment>
          }>

          <Grid style={{ marginLeft: 4 }} item>

            <GSelect onChange={this.onChange} variant={'selector'} config={COMBINATIONS} />
          </Grid>
          <Grid item style={{ padding: '10px' }}>
            <OmsSelect
              label={' Term'}
              options={this.state.termList.map((term) => {
                return { label: term.term, value: term.id, locked: term.locked }
              })}
              change={this.handleTermChange}
            />
          </Grid>
          <Button color='primary' variant='contained'
            onClick={() => this.get(this.state.currentPage)}>GET </Button>
        </Toolbar>

        <div className='feeds-container' onScroll={this.handleScroll} >
          {this.state.gradeBookEvaRes && this.state.gradeBookEvaRes.length > 0 && this.state.gradeBookEvaRes.map(resItem => {
            return (
              <Typography className='card-text' variant='h5'>
                <React.Fragment>
                  <Chip
                    size='medium'
                    label={(resItem.grade.grade) || 'NO Grade'}
                    avatar={<Avatar>G</Avatar>}
                  />&nbsp;&nbsp;
                  <Chip
                    size='medium'
                    label={resItem.subject && resItem.subject.subject_name ? resItem.subject.subject_name : 'No Subject'}
                    avatar={<Avatar>S</Avatar>}
                  />&nbsp;&nbsp;
                  <Chip
                    size='medium'
                    label={(resItem.term && resItem.term.term) || 'NO Term'}
                    avatar={<Avatar>T</Avatar>}
                  />&nbsp;&nbsp;
                  <Chip
                    size='medium'
                    label={(resItem.gradebook_evaluation_category) || 'NO Category'}
                    avatar={<Avatar>C</Avatar>}
                  />
                  <Chip
                    size='medium'
                    label={(resItem.uploaded_by && resItem.uploaded_by.username) || 'NO Author'}
                    avatar={<Avatar><Face /></Avatar>}
                  />
                  <div style={{ overflow: 'auto' }}>

                    <Table aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Total Evaluations </TableCell>
                          <TableCell > Considered Evaluations </TableCell>
                          <TableCell >   Total Score </TableCell>
                          <TableCell > Percentage Contribution:</TableCell>
                          <TableCell >Criteria Type</TableCell>
                          <TableCell >Delete</TableCell>
                          <TableCell >Edit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell > {resItem.total_evaluations}</TableCell>
                          <TableCell > {resItem.considered_evaluations}
                          </TableCell>
                          <TableCell > {resItem.total_score}</TableCell>
                          <TableCell >{resItem.percentage_contribution}</TableCell>
                          <TableCell >{resItem.criteria_type}</TableCell>
                          <TableCell > <IconButton
                            aria-label='Delete'
                            onClick={e => this.handleDelete(resItem.id)}>
                            <DeleteIcon fontSize='small' />
                          </IconButton></TableCell>
                          <TableCell>  <RouterButton
                            icon='edit'
                            value={{
                              basic: 'basic',
                              href: '/gradebook/evaluationcriteria/edit/' + resItem.id
                            }}
                            id={resItem.id}
                          /></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                </React.Fragment>
              </Typography>
            )
          })}
        </div>

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withRouter(ViewGradebookEvaluationCriteria))
