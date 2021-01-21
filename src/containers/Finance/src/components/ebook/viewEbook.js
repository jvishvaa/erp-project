/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import ReactTable from 'react-table'
import PropTypes from 'prop-types'
import { Grid, Tabs, Tab, AppBar, Switch, Tooltip } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter } from 'react-router-dom'

import axios from 'axios'
import { connect } from 'react-redux'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './combinations'
import { urls } from '../../urls'
import EbookPdf from './ebookPdf'
import Ebook from './ebook'
import { InternalPageStatus, Pagination, OmsSelect } from '../../ui'
import './canvas.css'

function Transition (props) {
  return <Slide direction='up' {...props} />
}

const styles = theme => ({
  root: {
    width: '100%',
    overFlow: 'hidden'
  },
  button: {
    width: 'auto',
    margin: '10px'

  }

})
const BooksColumn = [
  {
    Header: 'Sr.no',
    Cell: row => {
      return (row.index + 1)
    },
    sortable: true,

    width: 60
  },

  {
    Header: 'Title',
    accessor: 'ebook_name',
    Cell: row => <div style={{ textAlign: 'center' }}>{row.value}</div>

  },
  {
    Header: 'Subject',
    accessor: 'subject.subject_name',
    Cell: row => <div style={{ textAlign: 'center' }}>{row.value}</div>

  }

]

const ebookRolesMappings = ['Subjecthead', 'Teacher', 'Planner', 'LeadTeacher', 'Principal', 'EA Academics', 'Student', 'AcademicCoordinator', 'Admin']
export class ViewEbook extends Component {
  constructor () {
    super()
    this.state = {
      grade_id: '',
      subject_id: '',
      currentPage: 1,
      pageSize: 12,
      eBooks: [],
      open: false,
      setOpen: false,
      loading: true,
      totalPages: 0,
      pdfUrl: '',
      id: '',
      pageNumber: 1,
      timeSpent: 0,
      loadingFile: false,
      eBookSubjects: [],
      gradeData: [],
      gradeAssigned: [],
      currentTab: 0,
      type: '',
      paymentMessage: false

    }
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.getData = this.getData.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.getEbooks = this.getEbooks.bind(this)
  }
  componentDidMount () {
    this.setState({ loading: true }, () => {
      this.getEbooks()
    })
  }

  handleClose = () => {
    this.setState({ open: false })
  };

  handleTabChange = (event, value) => {
    this.setState({
      currentTab: value,
      page: 1,
      currentPage: 1

    }, () => this.getEbooks())
  }

  getEbooks = () => {
    let { grade_id: gradeId, subject_id: subjectId, currentPage, pageSize, eBookSubjects, currentTab, listOfBooks } = this.state
    let path = ''
    if (ebookRolesMappings.includes(this.role)) {
      if (subjectId) {
        path += `?grade_id=${gradeId}&subject_id=${subjectId}&page_size=${pageSize}&page_no=${currentPage}&ebook_type=${currentTab !== 0 ? 'Curriculum' : 'General'}`
      } else {
        path += `?page_size=${pageSize}&page_no=${currentPage}&ebook_type=${currentTab !== 0 ? 'Curriculum' : 'General'}`
      }
    } if (this.role === 'Guest Student') {
      if (subjectId) {
        path += `?grade_id=${gradeId}&subject_id=${subjectId}&page_size=${pageSize}&page_no=${currentPage}&ebook_type=General`
      } else {
        path += `?page_size=${pageSize}&page_no=${currentPage}&ebook_type=General`
      }
    }
    if (listOfBooks) {
      path += `&is_list=True`
    }
    this.setState({
      loading: true
    })
    axios.get(`${urls.EBOOK}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(({ data }) => {
        console.log('Data', data)
        this.setState({ eBooks: data.data, loading: false, totalPages: data.total_pages, eBookSubjects: data.subject_details, gradeData: data.grade_details, paymentMessage: false })
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.setState({ paymentMessage: true, eBooks: [], totalPages: 0, loading: false })
          this.props.alert.error('We have not yet received payment from you')
        }
        // console.log(error.response.status)
      })
  }

  onChange = (data) => {
    console.log(data, this.state)
    let { grade_id: gradeId } = this.state
    this.setState({ grade_id: data.grade_id }, () => {
      if (gradeId) {
        this.setState({ loading: true, currentPage: 1 }, () => { this.getEbooks() })
      }
    })
  }
  // handleClickOpen = (original) => {
  //   console.log(original)
  //   this.setState({ open: true, id: original.id, pdfUrl: original.ebook_file_type, loadingFile: true })
  //   axios.get(`${urls.EbookUser}?ebook_id=${original.id}`, {
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.user
  //     }
  //   })
  //     .then(({ data }) => {
  //       this.setState({ loadingFile: false })
  //       this.setState({ timeSpent: data.time_spent, pageNumber: data.page_number })
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  //   console.log(this.state.loadingFile, 'loader')
  // }

  handlePagination = (page) => {
    this.setState({ currentPage: page, loading: true }, () => {
      this.getEbooks()
    })
  }

  getData = () => {
    this.getEbooks()
  }
  handleSubject=(e) => {
    this.setState({ subject_id: e.value })
  }
  handleGrades=(e) => {
    this.setState({ grade_id: e.value })
  }
  filterBooks=() => {
    // eslint-disable-next-line camelcase
    const { subject_id, grade_id } = this.state

    // eslint-disable-next-line camelcase
    if (subject_id && grade_id) {
      this.setState({ loading: true, currentPage: 1 }, () => { this.getEbooks() })
    }
  }

  getNECRTSBooks=() => {
    const { listOfBooks } = this.state
    this.setState({
      listOfBooks: !listOfBooks
    }, () => this.getEbooks())
  }

  render () {
    const { currentPage, loading, totalPages, eBooks, listOfBooks } = this.state
    let { classes } = this.props
    // const columns = [
    //   {
    //     Header: 'SL_NO',
    //     id: 'sln',
    //     width: 100,
    //     Cell: row => {
    //       return <div style={{ textAlign: 'center' }}>{(10 * currentPage + (row.index + 1))}</div>
    //     }
    //   },
    //   {
    //     Header: 'Ebook Name',
    //     accessor: 'ebook_name'
    //   },
    //   {
    //     Header: 'Ebook Description',
    //     accessor: 'ebook_description'
    //   },
    //   {
    //     Header: 'Read',
    //     Cell: ({ original }) => {
    //       return <Button variant='contained' color='primary' onClick={() => { this.handleClickOpen(original) }}>Read</Button>
    //     }
    //   }

    // ]

    return (
      <React.Fragment>
        <div className={classes.root}>
          <div container spacing={2}>
            {/* <Grid container spacing={2}>
              <Grid item xs={12}>
              m
              </Grid>
            </Grid> */}
            <Grid item xs={12}>
              <Grid className='ebook-filter_grid'style={{ display: 'flex', padding: '2% 2%' }} item>
                {
                  ebookRolesMappings.includes(this.role) && this.role !== 'Student'
                    ? <Grid style={{ display: 'flex' }}>

                      <OmsSelect
                        style={{ marginRight: '5px' }}
                        className='omselect1'
                        placeholder='Select Grade'
                        options={
                          this.state.gradeData &&
                      this.state.gradeData.map(grade => ({
                        value: grade.id,
                        label: grade.grade
                      }))
                        }
                        change={this.handleGrades}

                      />
                      <OmsSelect
                        className='omselect1'
                        placeholder='Select Subject'
                        options={
                          this.state.eBookSubjects && this.state.eBookSubjects.map(subject => ({
                            value: subject.id,
                            label: subject.subject_name
                          }))
                        }
                        change={this.handleSubject}

                      />
                    </Grid>
                    : <Grid style={{ display: 'flex', marginRight: '5px' }}>

                      <GSelect className='labels' config={COMBINATIONS} variant={'selector'} onChange={this.onChange} />
                      <OmsSelect
                        className='omselect'
                        placeholder='Subject'
                        options={
                          this.state.eBookSubjects && this.state.eBookSubjects.map(subject => ({
                            value: subject.id,
                            label: subject.subject_name
                          }))
                        }
                        change={this.handleSubject}

                      />

                    </Grid>

                }

                <Button className={classes.button} onClick={this.filterBooks} color='primary' variant='contained'>Filter</Button>
                {
                  listOfBooks ? '' : <div style={this.role !== 'Subjecthead' || this.role !== 'Admin' ? { position: 'absolute', right: '32px' } : { position: 'absolute', right: '33px' }}>
                    <Pagination
                      className='ebook-pagination'
                      rowsPerPageOptions={[]}
                      labelRowsPerPage={'Ebooks per page'}
                      page={this.state.currentPage - 1}
                      rowsPerPage={12}
                      count={(this.state.totalPages * 12)}
                      onChangePage={(e, i) => {
                        this.handlePagination(i + 1)
                      }}

                    />
                  </div>
                }

              </Grid>
              {
                ebookRolesMappings.includes(this.role)
                  ? <AppBar style={{ backgroundColor: 'khaki' }} elevation={0} position='static'>
                    <Tabs value={this.state.currentTab}
                      onChange={this.handleTabChange}
                      indicatorColor='primary'
                      textColor='primary'
                      variant='fullWidth'
                    >
                      <Tab style={{ 'font-size': 'initial' }} label={'General books'} />

                      <Tab style={{ 'font-size': 'initial' }} label={'Curriculum books'} />

                    </Tabs>
                  </AppBar> : ''}
              <div style={{ display: 'flex' }}>
                <label style={{ 'margin-top': '10px', 'margin-left': '10px' }}>Show book list</label>

                <Tooltip title=' Show book list' arrow>
                  <Switch color='primary'
                    onClick={() => {
                      this.getNECRTSBooks()
                    }}
                  />
                </Tooltip>
              </div>

              {
                loading
                  ? <InternalPageStatus label={'Loading ebooks...'} />
                  : listOfBooks ? <ReactTable data={eBooks} columns={BooksColumn} defaultPageSize={5}
                    showPageSizeOptions
                    loading={loading} />

                    : <Grid container spacing={2} style={{ padding: '10px' }}>
                      {eBooks && eBooks.length <= 0 && !this.state.paymentMessage
                        ? <InternalPageStatus label={'No matching books are found'} loader={false} />

                        : <Grid container spacing={2}>{
                          this.state.eBooks.map(ebook => {
                            return <Grid item xs={12} sm={4} md={3}>
                              {/* <Ebook {...ebook} */}
                              <Ebook {...ebook} filteredData={this.getData}

                              />
                            </Grid>
                          })
                        }
                        </Grid>
                      }
                    </Grid>
              }
            </Grid>
          </div>
        </div>
        <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Dialog
                scroll='body'
                fullScreen
                open={this.state.open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
              >
                <div className={classes.root}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <EbookPdf pageNumber={this.state.pageNumber} timeStore={this.state.timeSpent} goBackFunction={this.handleClose} id={this.state.id} url={`${this.state.pdfUrl !== null ? this.state.pdfUrl : ''}`} passLoad={this.state.loadingFile} />

                    </Grid>
                  </Grid>
                </div>
              </Dialog>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  classes: PropTypes.object.isRequired

})

export default connect(mapStateToProps)((withRouter(withStyles(styles)(ViewEbook))))
