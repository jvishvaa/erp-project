import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import CancelIcon from '@material-ui/icons/Cancel'
import { TableBody, Table, TableHead, TableRow, withStyles, Modal } from '@material-ui/core'
import { urls } from '../../../../urls'
import { StyledQuizTableCell, StyledQuizTableRow } from './StyledTable'
import { InternalPageStatus, Pagination } from '../../../../ui'
import QuizChapterWiseResults from './QuizChapterWiseResults'

const styles = theme => ({
  table: {
    minWidth: 700
  },
  clickableCellRed: {
    '&:hover': {
      background: '#ff7675',
      cursor: 'pointer'
    }
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '90%',
    height: '80vh',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    overflow: 'scroll',
    padding: 20
  }
})

class TestWiseDetails extends Component {
  constructor () {
    super()
    this.state = {
      quizDetails: [],
      currentPage: 0,
      pageSize: 10,
      loading: true,
      showModal: false,
      onlineClassId: null,
      count: 0
    }
  }

  componentDidMount () {
    this.getQuizTestDetails()
  }

  getQuizTestDetails = () => {
    const personalData = JSON.parse(localStorage.getItem('user_profile')).personal_info
    const { subjectId, gradeId } = this.props
    const { currentPage, pageSize } = this.state
    const url = `${urls.QuizTestDetails}?grade_id=${gradeId}&subject_id=${subjectId}&page_number=${currentPage + 1}&page_size=${pageSize}`
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + personalData.token
      }
    })
      .then(res => {
        this.setState({ quizDetails: res.data.data, loading: false, showMessage: true, count: res.data.total_items })
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false, showMessage: true })
        this.props.alert.error('Something went wrong')
      })
  }

  renderResultsModal = () => {
    const { showModal, onlineClassId } = this.state
    const { classes } = this.props
    return (
      <Modal
        open={showModal}
        onClose={() => {
          this.setState({
            showModal: false })
        }}
      >
        <div>
          <div className={classes.modalContainer}>
            <CancelIcon className='clear__files' style={{ float: 'right', marginBottom: 20 }} onClick={() => {
              this.setState({
                showModal: false })
            }} />
            <QuizChapterWiseResults alert={this.props.alert} onlineClassId={onlineClassId} />
          </div>
        </div>
      </Modal>

    )
  }

  handlePagination = (event, page) => {
    this.setState({ loading: true, currentPage: page }, () => {
      this.getQuizTestDetails()
    })
  }

  renderTestDetailsTable = () => {
    const { classes } = this.props
    const { quizDetails, count, currentPage, pageSize } = this.state
    return (
      <React.Fragment>

        <Table className={classes.table} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledQuizTableCell component='th' scope='row'>Quiz Name</StyledQuizTableCell>
              <StyledQuizTableCell component='th' scope='row'>Created On</StyledQuizTableCell>
              <StyledQuizTableCell component='th' scope='row'>Quiz Start Time</StyledQuizTableCell>
              <StyledQuizTableCell component='th' scope='row'>Quiz Start Time</StyledQuizTableCell>
              <StyledQuizTableCell component='th' scope='row'>Number of Students Attended</StyledQuizTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              quizDetails.map(quiz => {
                return <StyledQuizTableRow>
                  <StyledQuizTableCell className={classes.clickableCellRed} onClick={() => {
                    this.setState({ showModal: true, onlineClassId: quiz.id })
                  }}>
                    {quiz.quiz_question_paper.question_paper_name}
                  </StyledQuizTableCell>
                  <StyledQuizTableCell>
                    {moment(quiz.created_at).format('MMM Do YYYY')}
                  </StyledQuizTableCell>
                  <StyledQuizTableCell>
                    {moment(quiz.start_time).format('h:mm:ss a')}
                  </StyledQuizTableCell>
                  <StyledQuizTableCell>
                    {moment(quiz.end_time).format('h:mm:ss a')}
                  </StyledQuizTableCell>
                  <StyledQuizTableCell>
                    {quiz.student_count}
                  </StyledQuizTableCell>
                </StyledQuizTableRow>
              })
            }

          </TableBody>
        </Table>
        <Pagination
          rowsPerPageOptions={[]}
          page={currentPage}
          rowsPerPage={pageSize}
          count={count}
          onChangePage={this.handlePagination}
        />
      </React.Fragment>
    )
  }
  render () {
    const { quizDetails, loading, showMessage, showModal } = this.state
    return (
      <div>
        {
          loading
            ? <InternalPageStatus label={'Loading data. Please wait!'} />
            : quizDetails.length
              ? this.renderTestDetailsTable()
              : showMessage ? <InternalPageStatus label='No data found!' loader={false} /> : ''
        }
        {
          showModal
            ? this.renderResultsModal()
            : ''
        }
      </div>
    )
  }
}

export default withStyles(styles)(TestWiseDetails)
