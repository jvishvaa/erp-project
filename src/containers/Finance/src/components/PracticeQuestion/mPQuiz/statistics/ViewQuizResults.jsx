import React, { Component } from 'react'
import { Button, Grid, withStyles, Card, Checkbox, Typography } from '@material-ui/core'
import axios from 'axios'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import ImportContactsIcon from '@material-ui/icons/ImportContacts'
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary'
import moment from 'moment'
import { connect } from 'react-redux'
import GSelect from '../../../../_components/globalselector'
import { COMBINATIONS } from './GSelectConfig'
import { urls } from '../../../../urls'
import { InternalPageStatus, OmsSelect, Pagination } from '../../../../ui'
import { apiActions } from '../../../../_actions'
import Results from './Results'

const styles = theme => ({
  table: {
    minWidth: 700
  },
  tableContainer: {
    padding: 30
  },
  gridSpacing: {
    margin: 10
  }
})
class ViewQuizResults extends Component {
  static defaultProps = {
    startDate: moment().subtract(5, 'days').toDate()
  }

  constructor (props) {
    super(props)
    this.state = {
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      selectedData: {},
      currentPage: 0,
      pageSize: 10,
      chapterWiseResults: [],
      loading: false,
      showResults: false,
      type: 'Quiz Test',
      startDate: this.props.startDate,
      endDate: new Date(),
      subjectId: null,
      count: 0
    }
  }

  filterQueryStrings = () => {
    const { branch_acad_id: branchId, acad_branch_grade_mapping_id: gradeId, section_mapping_id: sectionId } = this.state.selectedData
    if (sectionId) return `&section_mapping=[${sectionId}]`
    else if (gradeId) return `&mapping_acad_grade=[${gradeId}]`
    else if (branchId) return `&acad_session=${branchId}`
  }

  getFormattedDate = (date = new Date()) => {
    let dateStr = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2)
    return dateStr
  }

  getResults = () => {
    const { currentPage, pageSize, personalInfo, type, startDate, endDate, selectedData, subjectId } = this.state
    const subject = personalInfo.role === 'Teacher' ? selectedData.subject_id : subjectId
    const url = `${urls.QuizResults}?page_number=${currentPage + 1}&page_size=${pageSize}&subject_id=${subject}&type=${type}&from_date=${this.getFormattedDate(startDate)}&to_date=${this.getFormattedDate(endDate)}${this.filterQueryStrings()}`
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({ chapterWiseResults: res.data.data, loading: false, showResults: true, count: res.data.total_items })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false })
        this.props.alert.error('Something went wrong!')
      })
  }

  handlePagination = (event, page) => {
    this.setState({ loading: true, currentPage: page }, () => {
      this.getResults()
    })
  }

  renderResults = () => {
    const { chapterWiseResults, currentPage, count } = this.state
    return (
      <React.Fragment>
        <Results results={chapterWiseResults} />
        <Pagination
          rowsPerPageOptions={[]}
          page={currentPage}
          rowsPerPage={10}
          count={count}
          onChangePage={this.handlePagination}
        />
      </React.Fragment>

    )
  }

  handleGSelectChange = (data, obj) => {
    this.setState({ selectedData: data })
  }

  isValidSelection = () => {
    const { selectedData: { branch_acad_id: branchId, subject_id: subjId, acad_branch_grade_mapping_id: gradeId }, subjectId } = this.state
    if (!branchId) {
      this.props.alert.warning('Please select branch')
      return false
    }

    if (!gradeId) {
      this.props.alert.warning('Please select grade')
      return false
    }

    if (!subjId && !subjectId) {
      this.props.alert.warning('Please select subject')
      return false
    }
    return true
  }

  handleGetResults = () => {
    if (this.isValidSelection()) {
      this.setState({ loading: true }, () => {
        this.getResults()
      })
    }
  }

  handleCheckbox = (event) => {
    const { value } = event.target
    this.setState({ type: value })
  }

  handleDateChange = (date, type) => {
    this.setState({ [type]: date })
  }

  handleSubjectChange = (data) => {
    this.setState({ subjectId: data.value })
  }

  render () {
    const { chapterWiseResults, loading, showResults, type, startDate, endDate, personalInfo } = this.state
    const { classes } = this.props
    return (
      <div>
        <Card style={{ overflow: 'visible' }}>
          <Grid container>
            <Grid item className={classes.gridSpacing}>
              <GSelect config={COMBINATIONS} variant='filter' onChange={this.handleGSelectChange} />
            </Grid>
            {
              personalInfo.role !== 'Teacher'
                ? <Grid item className={classes.gridSpacing}>
                  <OmsSelect
                    label='Subject'
                    options={
                      this.props.subjects
                        ? this.props.subjects.map(subject => ({
                          value: subject.id,
                          label: subject.subject_name
                        }))
                        : []
                    }
                    change={this.handleSubjectChange}
                  />
                </Grid>
                : ''
            }

          </Grid>
          <Grid container>
            <Grid item className={classes.gridSpacing}>
              <Checkbox
                value='Quiz Test'
                checked={type === 'Quiz Test'}
                onChange={this.handleCheckbox}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <Typography style={{ display: 'inline', fontSize: 16 }}>
              Quiz Test
              </Typography>
            </Grid>
            <Grid item className={classes.gridSpacing}>
              <Checkbox
                value='Quiz'
                checked={type === 'Quiz'}
                onChange={this.handleCheckbox}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <Typography style={{ display: 'inline', fontSize: 16 }}>
              Quiz
              </Typography>
            </Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item style={{ margin: '-10px 10px 0px 20px' }}>
                <KeyboardDatePicker
                  margin='normal'
                  label='Start Date'
                  format='dd/MM/yyyy'
                  name='startDate'
                  value={startDate}
                  onChange={(date) => { this.handleDateChange(date, 'startDate') }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                  maxDate={new Date()}
                />
              </Grid>
              <Grid item style={{ margin: '-10px 10px 0px 10px' }}>
                <KeyboardDatePicker
                  margin='normal'
                  label='End Date'
                  format='dd/MM/yyyy'
                  name='endDate'
                  value={endDate}
                  onChange={(date) => { this.handleDateChange(date, 'endDate') }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                  maxDate={new Date()}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid item className={classes.gridSpacing}>
              <Button variant='contained' color='primary' onClick={this.handleGetResults}>Get Results</Button>
            </Grid>
          </Grid>
        </Card>
        <div style={{ padding: 20, marginTop: 20, overflow: 'auto' }}>
          <div className='color__indicator--container'>
            <div>
              <LocalLibraryIcon fontSize='large' style={{ margin: '0px 15px -10px 0px', color: '#eb8f83' }} />
              <Typography variant='h6' style={{ display: 'inline-block' }}>Chapter Name</Typography>
            </div>
            <div>
              <ImportContactsIcon fontSize='large' style={{ margin: '0px 15px -10px 0px', color: 'rgb(142, 235, 131)' }} />
              <Typography variant='h6' style={{ display: 'inline-block' }}>Test Name</Typography>
            </div>
          </div>
          {
            loading
              ? <InternalPageStatus label={'Loading data. Please wait!'} />
              : chapterWiseResults.length && chapterWiseResults[0].chapter_data.length
                ? this.renderResults()
                : showResults ? <InternalPageStatus label='No data found!' loader={false} /> : ''
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    subjects: state.subjects.items
  }
}

const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ViewQuizResults))
