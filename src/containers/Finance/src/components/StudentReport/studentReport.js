import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Form, Grid } from 'semantic-ui-react'
import { Card, CardContent, CardHeader, Typography, Button, AppBar } from '@material-ui/core'
import LinkTag from '@material-ui/core/Link'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { urls } from '../../urls'
import { Toolbar, Modal, InternalPageStatus, Pagination } from './../../ui'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from '../teacherManagement/teacherReport/customConfigReport'
import StudentReportDairy from './StudentReportDairy'
import FileUpload from './fileUpload'

/**
 * @class StudentReport
 */

class StudentReport extends Component {
  /**
     * @constructs StudentReport
     * @description Asigning value to state property
     * @param  {[type]} props thing representing  some data
     */
  constructor (props) {
    super(props)
    let time = new Date().toISOString().substr(0, 10)
    this.state = {
      startDate: time,
      endDate: time,
      tableData: [],
      pageNumber: 1,
      pageSize: 12,
      fileModal: false,
      teacherReportId: null,
      filterData: {},
      loading: false,
      showStatus: false,
      currentPage: 1,
      totalPages: 0
    }
    this.getReport = this.getReport.bind(this)
    // this.handleScroll = this.handleScroll.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    let branch = this.userProfile.branch_id
    let section = this.userProfile.section_id
    let sectingMappingId = this.userProfile.section_mapping_id
    let grade = this.userProfile.grade_id
    this.subjects = this.userProfile.subjects
    let branchName = this.userProfile.branch_name
    let sectionName = this.userProfile.section_name
    let gradeName = this.userProfile.grade_name
    this.setState({ sectingMappingId, branch, section, grade, branchName, gradeName, sectionName }, () => {
      this.getAllReports()
    })
  }

  getAllReports = () => {
    if (!this.state.startDate || !this.state.endDate) {
      this.props.alert.warning('Please select start date and end date')
      return
    }
    this.setState({ loading: true, tableData: [], showFailureStatus: false, showStatus: false }, () => {
      let { currentPage, sectingMappingId, pageSize, filterData, startDate, endDate, tableData } = this.state

      console.log(filterData, sectingMappingId)
      let data = {
        section_mapping_id: sectingMappingId,
        from_date: moment(startDate).format('YYYY-MM-DD'),
        to_date: moment(endDate).format('YYYY-MM-DD'),
        page_number: currentPage,
        page_size: pageSize
      }
      data = Object.assign(data, filterData)
      console.log(data, 'dat')

      axios
        .get(urls.ReportV2, {
          params: data,
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          this.setState({
            tableData: [...tableData, ...res.data.reports],
            totalPages: res.data.total_pages,
            loading: false,
            showStatus: true
          })
        })
        .catch(err => {
          this.setState({ showFailureStatus: true, loading: false })
          console.log(err)
        })
      // }
    })
  }

  getReport = () => {
    if (!this.state.startDate || !this.state.endDate) {
      this.props.alert.warning('Please select start date and end date')
      return
    }
    this.setState({ loading: true, tableData: [], showFailureStatus: false, showStatus: false }, () => {
      let { currentPage, pageSize, filterData, sectingMappingId, startDate, endDate, tableData } = this.state
      // var mappingDetails = []
      // var reportOf = mappingDetails[sectingMappingId]z
      let subMapId = Object.values(filterData).join(',')
      let data = {
        section_mapping_id: sectingMappingId,
        from_date: moment(startDate).format('YYYY-MM-DD'),
        to_date: moment(endDate).format('YYYY-MM-DD'),
        page_number: currentPage,
        page_size: pageSize,
        subject_mapping_ids: subMapId || null
      }
      // data = Object.assign(data, filterData)
      console.log(data, 'dat')

      axios
        .get(urls.ReportV2, {
          params: data,
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          this.setState({
            tableData: [...tableData, ...res.data.reports],
            totalPages: res.data.total_pages,
            loading: false,
            showStatus: true
          })
        })
        .catch(err => {
          this.setState({ showFailureStatus: true, loading: false })
          console.log(err)
        })
      // }
    })
  }

  // handleScroll (event) {
  //   let { totalPage, pageNumber } = this.state
  //   let { target } = event
  //   if (target.scrollTop + target.clientHeight >= target.scrollHeight && totalPage >= pageNumber) {
  //     this.getReport()
  //   }
  // }

  handleFileModalOpen = (id) => {
    this.setState({
      fileModal: true,
      teacherReportId: id
    })
  }

  handleFileModalClose = () => {
    this.setState({
      fileModal: false
    })
  }

  handlePagination = (page) => {
    this.setState({ currentPage: page, showStatus: false }, () => {
      this.getReport()
    })
  }
  onChange=(e, data) => {
    let { selectorData } = this.state
    this.setState({
      filterData: e,
      pageNumber: 1,
      showStatus: false,
      currentPage: 1,
      totalPages: 0,
      selectorData: data
    })
    console.log(selectorData, data, 'sdata')
  }

  render () {
    let fileModal = null
    if (this.state.fileModal) {
      fileModal = (
        <Modal
          open={this.state.fileModal}
          click={this.handleFileModalClose}
        >
          <FileUpload
            teacherReportId={this.state.teacherReportId}
            onClose={this.handleFileModalClose}
            alert={this.props.alert}
          />
        </Modal>

      )
    }
    let { startDate, endDate, tableData, loading, showStatus, showFailureStatus } = this.state
    return (
      <React.Fragment>
        <AppBar>
          hello
        </AppBar>
        {window.isMobile ? <StudentReportDairy />
          : <Grid>
            <Grid.Row style={{ paddingTop: 0 }}>
              <Grid.Column>
                <Toolbar
                  floatRight={
                    <div>
                      <Pagination
                        rowsPerPageOptions={[]}
                        labelRowsPerPage={''}
                        page={this.state.currentPage - 1}
                        rowsPerPage={12}
                        count={(this.state.totalPages * 12)}
                        onChangePage={(e, i) => {
                          this.handlePagination(i + 1)
                        }}

                      />
                    </div>
                  }
                >
                  <Form>
                    <Form.Group>
                      <Form.Field required width={10}>
                        <GSelect
                          onChange={(e) => this.onChange(e)}
                          config={COMBINATIONS}
                        />
                      </Form.Field>

                      <Form.Field>
                        <label>Start Date</label>
                        <input
                          onChange={e => {
                            this.setState({ startDate: e.target.value, pageNumber: 1, showStatus: false, currentPage: 1, totalPages: 0 })
                          }}
                          value={startDate}
                          type='date'
                          name='startingDate'
                          id='startingDate'
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>End Date</label>
                        <input
                          onChange={e => {
                            this.setState({ endDate: e.target.value, pageNumber: 1, showStatus: false, currentPage: 1, totalPages: 0 })
                          }}
                          value={endDate}
                          type='date'
                          name='endingDate'
                          id='endingDate'
                        />
                      </Form.Field>
                    </Form.Group>
                  </Form>
                  <Button style={{ marginLeft: 20 }} onClick={this.getReport} variant='contained' color='primary'> Get Report </Button>

                </Toolbar>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <div
                        style={{
                          position: 'relative',
                          paddingLeft: '10px'
                        }}
                        // onScroll={this.handleScroll}
                      >
                        {
                          loading
                            ? <div style={{
                              position: 'absolute',
                              top: '130px',
                              left: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}>
                              <InternalPageStatus label={'Loading daily diary reports'} />
                            </div>
                            : ''
                        }
                        {
                          showStatus && !tableData.length
                            ? <div style={{
                              position: 'absolute',
                              top: '130px',
                              left: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}>
                              <InternalPageStatus label={'No daily diary reports found for the selected date or subject'} loader={false} />
                            </div>
                            : ''
                        }
                        {
                          showFailureStatus
                            ? <div style={{
                              position: 'absolute',
                              top: '130px',
                              left: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}>
                              <InternalPageStatus
                                label={
                                  <p>Error occured while fetching Daily Diaries&nbsp;
                                    <LinkTag
                                      component='button'
                                      onClick={this.getReport}>
                                      <b>Click here to reload_</b>
                                    </LinkTag>
                                  </p>
                                }
                                loader={false} />
                            </div>
                            : ''
                        }
                        <Grid>
                          <Grid.Row style={{ display: 'flex', justifyContent: 'space-around', padding: 30 }}>
                            {tableData.map(item => (
                              <Card style={{ width: '320px', margin: '10px 0px 10px 0px', backgroundColor: 'white-smoke', position: 'relative' }}>
                                <CardHeader
                                  style={{ backgroundColor: '#ff6384', fontWeight: 'bold', color: 'white' }}
                                  title={this.subjects.map(data => {
                                    if (data.subject_id === item.subjectmapping.subject) {
                                      return data.subject_name.toUpperCase()
                                    }
                                  })}
                                />
                                <CardContent>
                                  <Typography variant='h6'>
                                  CLASSWORK <br /> <hr />
                                  </Typography>
                                  {item.classswork}
                                </CardContent>
                                <CardContent>
                                  <Typography variant='h6'>
                                  HOMEWORK <br /> <hr />
                                  </Typography>
                                  {item.homework}
                                </CardContent>
                                <CardContent>
                                  <Typography variant='h6'>
                                  MEDIA <br /> <hr />
                                  </Typography>
                                  {item.media.length > 0 && item.media.map((file, index) => <Button variant='contained' target={'blank'} href={file.media_file}>File {index + 1}</Button>)}
                                </CardContent>
                                <CardContent style={{ marginBottom: 10 }}>
                                  <Typography variant='h6'>
                                  DATE <br /> <hr />
                                  </Typography>
                                  {moment(item.which_day).format('YYYY-MM-DD')}
                                </CardContent>
                                <CardContent>
                                  <Button
                                    style={{ backgroundColor: '#b2dfdb', position: 'absolute', bottom: 10 }}
                                    variant='contained'
                                    disabled={item.homework_submitted}
                                    onClick={() => this.handleFileModalOpen(item.id)}
                                  >
                                    Upload Work
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </Grid.Row>
                        </Grid>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
        {fileModal}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(withRouter(StudentReport))
