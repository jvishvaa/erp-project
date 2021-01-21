import React, { Component } from 'react'
import axios from 'axios'
import { TableBody, Table, TableHead, TableRow, withStyles, Modal } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import { urls } from '../../../../urls'
import { InternalPageStatus } from '../../../../ui'
import { StyledQuizTableCell, StyledQuizTableRow } from './StyledTable'
import TestWiseDetails from './TestWiseDetails'

const styles = theme => ({
  table: {
    minWidth: 700
  },
  tableContainer: {
    padding: '30px 0px',
    overflow: 'auto',
    width: '95%',
    margin: '0 auto'
  },
  clickableCellRed: {
    '&:hover': {
      background: '#ff7675',
      cursor: 'pointer'
    }
  },
  clickableCellGreen: {
    '&:hover': {
      background: '#27ae60',
      cursor: 'pointer'
    }
  }
})

class QuizTestHeldCount extends Component {
  constructor () {
    super()
    this.state = {
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      loading: true,
      countData: [],
      subjectList: [],
      showModal: false,
      selectedGradeId: null,
      selectedSubjectId: null
    }
  }

  componentDidMount () {
    this.getNumberOfQuizHeldCount()
  }

  getNumberOfQuizHeldCount = () => {
    const { token } = this.state.personalInfo
    axios.get(`${urls.QuizsHeldCount}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status === 200) {
          const { data } = res
          this.setState({ countData: data,
            loading: false,
            subjectList: data[0].subject_data.map(subject => subject.subject)
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Something went wrong')
        this.setState({ loading: false })
      })
  }

  sort = (list) => {
    return list.sort((a, b) => {
      if (a.count === b.count) {
        return 0
      }
      if (typeof a.count === typeof b.count) {
        return a.count < b.count ? 1 : -1
      }
      return typeof a.count < typeof b.count ? -1 : 1
    })
  }

  handleSort = (index) => {
    const countDataCopy = [...this.state.countData]
    const selectedItem = countDataCopy[index]
    const sortedItems = this.sort(selectedItem.subject_data)
    countDataCopy[index].subject_data = sortedItems
    this.setState({ countData: countDataCopy, subjectList: sortedItems.map(el => el.subject) })
  }

  mapOrder = (array, order, key) => {
    array.sort((a, b) => {
      const A = a[key]
      const B = b[key]
      return order.indexOf(A) > order.indexOf(B) ? 1 : -1
    })
    return array
  };

  renderTestsViewModal = () => {
    const { showModal, selectedGradeId, selectedSubjectId } = this.state
    return (
      <Modal
        open={showModal}
        onClose={() => {
          this.setState({
            showModal: false, selectedGradeId: null, selectedSubjectId: null })
        }}
      >
        <div>
          <div style={{ backgroundColor: 'white', width: '90%', height: '80vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', overflow: 'scroll', padding: 20 }}>
            <span>*Note: Click on the quiz name to view result</span>
            <CancelIcon className='clear__files' style={{ float: 'right', marginBottom: 20 }} onClick={() => {
              this.setState({
                showModal: false })
            }} />
            <TestWiseDetails alert={this.props.alert} gradeId={selectedGradeId} subjectId={selectedSubjectId} />
          </div>
        </div>
      </Modal>

    )
  }

  handleTestClick = (gradeId, subjectId) => {
    this.setState({ showModal: true, selectedGradeId: gradeId, selectedSubjectId: subjectId })
  }

  renderTable = () => {
    const { classes } = this.props
    const { countData, subjectList } = this.state
    return (
      <React.Fragment>
        <div>
          <span>*Note: Click on count to view individual quiz details</span>
        </div>
        <Table className={classes.table} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledQuizTableCell component='th' scope='row'>{''}</StyledQuizTableCell>
              {subjectList.map((subject) => (
                <StyledQuizTableCell className=''>{subject}</StyledQuizTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              countData.map((item, index) => {
                return (
                  <StyledQuizTableRow key={index}>
                    <StyledQuizTableCell onClick={() => { this.handleSort(index) }} className={classes.clickableCellRed}>
                      {item.grade}
                    </StyledQuizTableCell>
                    {
                      this.mapOrder(item.subject_data, subjectList, 'subject').map(subject => {
                        return <StyledQuizTableCell
                          className={classes.clickableCellGreen}
                          onClick={() => { this.handleTestClick(item.grade_id, subject.subject_id) }}
                        >
                          {subject.count}
                        </StyledQuizTableCell>
                      })
                    }
                  </StyledQuizTableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </React.Fragment>
    )
  }

  render () {
    const { loading, countData, showModal } = this.state
    const { classes } = this.props
    return (
      <div className={classes.tableContainer}>
        {
          loading
            ? <InternalPageStatus label={'Loading data. Please wait!'} />
            : countData.length
              ? this.renderTable()
              : <InternalPageStatus label='No data found!' loader={false} />
        }
        {
          showModal
            ? this.renderTestsViewModal()
            : ''
        }
      </div>
    )
  }
}

export default withStyles(styles)(QuizTestHeldCount)
