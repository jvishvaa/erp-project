import React, { Component } from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
// import IconButton from '@material-ui/core/IconButton/IconButton'
// import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import TextField from '@material-ui/core/TextField'
import { Toolbar, Button, Grid, Popover, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import OtpInput from 'react-otp-input'
import Timer from 'react-compound-timer'
import { withRouter } from 'react-router-dom'
import { urls, qBUrls } from '../../urls'
// import { apiActions } from '../../_actions'
import { OmsSelect } from './../.././ui'

class ListClassGroup extends Component {
  constructor () {
    super()
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.state = {
      page: 1,
      pageSize: 10,
      pageNumber: 0,
      tableData: [],
      selectorData: [],
      loading: false,
      expanded: [],
      gId: [],
      getData: true,
      name: null,
      check: [],
      subData: {},
      open: false,
      anchorEl: null,
      openDialog: false,
      openDialog2: false,
      openDialog3: false,
      otp: '',
      onVerifyloading: false,
      resdata: [],
      showReactTable: false,
      resend_otp: false,
      showTimer: false,
      onSaveloading: false

    }
    this.deleteHandler = this.deleteHandler.bind(this)
    this.subComponent = this.subComponent.bind(this)
    this.downloadExcel = this.downloadExcel.bind(this)
  }
  debounceEvent (...args) {
    this.debouncedEvent = debounce(...args)
    return e => {
      e.persist()
      return this.debouncedEvent(e)
    }
  }
  componentDidMount () {
    axios
      .get(urls.ClassGroupList + '?page_no=' + 1 + '&page_size=' + 10 + '&is_download=' + 'False', {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({ data: res.data.data, totalPages: res.data.total_pages }, () => {
          console.log(this.state.data)
        })
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Unable to load data')
      })
    this.getGrade()
  }
  downloadExcel = () => {
    let { selectorData } = this.state
    let url = selectorData.length === 0 ? urls.ClassGroupList + '?is_download=' + 'True' : urls.ClassGroupList + '?is_download=' + 'True' + '&grade_id=' + selectorData
    axios.get(`${url}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'ClassGroupReport.xls'
        link.click()
      })
      .catch(err => {
        console.log(err)
      })
  }

  getsubData (groupId) {
    console.log(groupId, this.state.gId)
    if (!this.state.subData[groupId]) {
      axios.get(urls.ClassGroupDetails + '?group_id=' + groupId, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          this.setState({ subData: { ...this.state.subData, [groupId]: { std: res.data.data } }, gId: groupId, getData: false })
        })
        .catch(err => {
          console.log(err)
          this.props.alert.error('No Data to display')
        })
    }
  }
  subComponent =(properties) => {
    let { getData } = this.state
    console.log(properties)
    const groupId = properties.original.id
    // this.getsubData(groupId)
    if (getData === true) {
      this.getsubData(groupId)
    } else if (groupId !== this.state.gId) {
      this.getsubData(groupId)
    }
    return <React.Fragment>

      <div>
        <ReactTable
          data={
            this.state.subData &&
             this.state.subData[groupId] &&
              this.state.subData[groupId].std &&
              Array.isArray(this.state.subData[groupId].std)
              ? this.state.subData[groupId].std : []}
          // data={this.state.subData[groupId].std}
          defaultPageSize={5}
          showPageSizeOptions={false}
          columns={
            [
              {
                Header: 'UserName',
                accessor: 'user.username'
              },
              {
                Header: 'Name',
                accessor: 'name'
              },

              {
                Header: 'Grade',
                accessor: 'grade.grade'
              },
              {
                Header: 'Date of Joining',
                accessor: 'user.date_joined'
              },
              {
                id: 'x',
                Header: 'Delete',
                accessor: props => {
                  return (
                    <div>
                      <IconButton
                        aria-label='Delete'
                        onClick={(e) => this.deleteHandler(props.id)}
                      >
                        {!props.is_delete && <DeleteIcon fontSize='small' />}
                      </IconButton>
                    </div>
                  )
                }
              }
            ]
          }
        />
      </div>
    </React.Fragment>
  }
  handleClickBranch = (e) => {
    this.setState({ classGroupBranchId: e.value, gradevalue: [], branchValue: e })
    this.props.gradeMapBranch(e.value)
  }
  handleGradeChange = e => {
    let { selectorData, page } = this.state
    this.setState({ selectorData: e.value, pageNumber: 0 })
    console.log(selectorData)
    console.log(page)
    console.log(e.value)
    if (this.state.name && e.value) {
      this.handleFilter(e.value)
    } else {
      this.getGroupData(page, e.value)
    }
  }

  getGroupData (page, e) {
    let url = e.length === 0 ? urls.ClassGroupList + '?page_size=' + this.state.pageSize + '&page_no=' + this.state.page + '&is_download=' + 'False'
      : urls.ClassGroupList + '?page_size=' + this.state.pageSize + '&page_no=' + this.state.page + '&is_download=' + 'False' + '&grade_id=' + e
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({ data: res.data.data, totalPages: res.data.total_pages, getData: false }, () => {
          console.log(this.state.data)
        })
        // , totalPages: res.total_pages })
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Unable to load data')
      })
  }

  getGrade () {
    axios
      .get(urls.GRADE, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then(res => {
        console.log(res.data)
        this.setState({ grade: res.data })
      }).catch(err => {
        console.log(err)
        this.props.alert.error('Unable to fetch Grades')
      })
  }
   handleFilter = (gradeId) => {
     let { name } = this.state
     let a = 0
     axios
       .get(urls.SearchClassGroup + '?search=' + name + '&grade_id=' + gradeId + '&page_size=' + this.state.pageSize + '&page_number=' + Number(a + 1), {
         headers: {
           Authorization: 'Bearer ' + this.props.user }
       }).then(res => {
         console.log(res.data.data)
         this.setState({ data: res.data.data, totalPages: res.data.total_pages })
       }).catch(err => {
         console.log(err)
         this.props.alert.error('No Guest Student')
       })
   }
   handleSearch = (event) => {
     let name = event.target.value
     this.setState({ name })
     let { selectorData } = this.state
     let a = 0
     // console.log(this.state.pageNumber, 'll')
     let url = selectorData.length === 0 ? urls.SearchClassGroup + '?page_size=' + this.state.pageSize + '&page_number=' + Number(a + 1) + '&search=' + name : urls.SearchClassGroup + '?page_size=' + this.state.pageSize + '&page_number=' + this.state.page + '&search=' + name + '&grade_id=' + selectorData
     //  let url = urls.SearchClassGroup + '?search=' + name
     axios
       .get(url, {
         headers: {
           Authorization: 'Bearer ' + this.props.user }
       }).then(res => {
         console.log(res.data.data)
         this.setState({ data: res.data.data, totalPages: res.data.total_pages, pageNumber: a })
       }).catch(err => {
         console.log(err)
         this.props.alert.error('No Guest Student')
       })
   }
   getStudentData (pageN) {
     let { selectorData, name } = this.state
     let url
     if (name == null && selectorData.length === 0) {
       url = urls.ClassGroupList + '?page_size=' + this.state.pageSize + '&page_no=' + (Number(pageN || 0) + 1) + '&is_download=' + 'False'
       axios
         .get(url, {
           headers: {
             Authorization: 'Bearer ' + this.props.user
           }
         })
         .then(res => {
           this.setState({ data: res.data.data, totalPages: res.data.total_pages, getData: false, pageSize: res.data.page_size, pageNumber: pageN }, () => {
             console.log(this.state.data)
           })
         // , totalPages: res.total_pages })
         })
         .catch(err => {
           console.log(err)
           this.props.alert.error('Unable to load data')
         })
     } else {
       if (name == null) {
         url = urls.ClassGroupList + '?page_size=' + this.state.pageSize + '&page_no=' + (Number(pageN || 0) + 1) + '&grade_id=' + selectorData + '&is_download=' + 'False'
       } else {
         url = selectorData.length === 0 ? urls.SearchClassGroup + '?page_size=' + this.state.pageSize + '&page_number=' + (Number(pageN || 0) + 1) + '&search=' + name + '&is_download=' + 'False' : urls.SearchClassGroup + '?page_size=' + this.state.pageSize + '&page_number=' + (Number(pageN || 0) + 1) + '&search=' + name + '&grade_id=' + selectorData + '&is_download=' + 'False'
       }
       axios
         .get(url, {
           headers: {
             Authorization: 'Bearer ' + this.props.user
           }
         })
         .then(res => {
           this.setState({ data: res.data.data, totalPages: res.data.total_pages, getData: false, pageSize: res.data.page_size, pageNumber: pageN }, () => {
             console.log(this.state.data)
           })
           // , totalPages: res.total_pages })
         })
         .catch(err => {
           console.log(err)
           this.props.alert.error('Unable to load data')
         })
     }
   }
  deleteHandler = (id) => {
    console.log(id)
    console.log(this.state.gId)
    let { gId } = this.state
    let data = {
      group_id: gId,
      guest_id: id
    }
    // let data = ''
    let deleteurl = urls.ClassGroupDetails
    axios
      .put(deleteurl, data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.props.alert.success('Student deleted')
        this.setState({ loading: true })
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Please try again')
      })
  }
  handleClicked = event => {
    this.setState({
      anchorEl: event.currentTarget
    })
  };
  handleClose = () => {
    this.setState({ anchorEl: null, openTable: false })
  };

  handleClickOpen = () => {
    this.setState({ openDialog: true, showReactTable: false, showTimer: false, onSaveloading: true })
    var path = urls.DeleteClassGroup + '?'
    // path += pagenumber ? 'page_number=' + (state.page + 1) : ''
    path += 'name=' + 'anvesh'

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        this.setState({ otpSent: res.data.result, otp: '', showReactTable: true, resend_otp: true, showTimer: true, onSaveloading: false
        })
        console.log(this.state.otpSent, 'dataa')
      }
    })
      .catch(e => console.log(e))
    this.setState({ onSaveloading: false })
  }

  handleClickClose = () => {
    this.setState({ openDialog: false })
  };
  handleClickOpen2 = () => {
    this.setState({ openDialog2: true, showReactTable: true, showTimer: false, onSaveloading: true })
    var path = urls.DeleteClassGroup + '?'
    // path += pagenumber ? 'page_number=' + (state.page + 1) : ''
    path += 'name=' + 'balram'

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        this.setState({ otpSent: res.data.result, otp: '', showReactTable: true, resend_otp: true, showTimer: true, onSaveloading: false
        })
        console.log(this.state.otpSent, 'dataa')
      }
    })
      .catch(e => console.log(e))
    this.setState({ onSaveloading: false })
  };
  handleClickClose2 = () => {
    this.setState({ openDialog2: false })
  };
  handleClickOpen3 = () => {
    this.setState({ openDialog3: true, showReactTable: true, showTimer: false, onSaveloading: true })
    var path = urls.DeleteClassGroup + '?'
    // path += pagenumber ? 'page_number=' + (state.page + 1) : ''
    path += 'name=' + 'guru'

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        this.setState({ otpSent: res.data.result, otp: '', showReactTable: true, resend_otp: true, showTimer: true, onSaveloading: false
        })
        console.log(this.state.otpSent, 'dataa')
      }
    })
      .catch(e => console.log(e))
    this.setState({ onSaveloading: false })
  };
  handleClickClose3 = () => {
    this.setState({ openDialog3: false })
  };
  handleOtpChange =(e) => {
    this.setState({ otp: e })
  }

  handleVerify = (e) => {
    const { otp } = this.state
    const formData = new FormData()
    formData.append('otp', otp)
    this.setState({ onVerifyloading: true })
    axios.post(qBUrls.verifyotp, formData, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data, 'excel')
        this.setState({ onVerifyloading: false, otp: '', showReactTable: false, resend_otp: false, showTimer: false })
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'DeleteGroupReport.xls'
        link.click()
        console.log(res.data.result, 'result')
      })
      .catch(error => {
        console.log(error.response)
        if (error.response && error.response.status === 400) {
          this.props.alert.error('Wrong OTP.Please try again.')
        } else {
          this.props.alert.error('Error Occurred')
        }
        this.setState({ onVerifyloading: false })
      })
  }

  render () {
    let { tableData, onSaveloading } = this.state
    let open = Boolean(this.state.anchorEl)
    let id = open ? 'simple-popover' : undefined
    console.log(this.state.otpSent, 'dataa')
    console.log(this.state.otp, this.state.otp.length, 'otpppp')

    let { onVerifyloading } = this.state

    console.log(tableData)
    console.log(this.role)
    return (
      <React.Fragment>
        <Toolbar>
          <Grid>
            <OmsSelect
              label='Grade'
              placeholder='Select Grade'
              options={this.state.grade
                ? this.state.grade
                  .map(grade => ({ value: grade.id, label: grade.grade }))
                : []
              }
              change={this.handleGradeChange}
            /></Grid>
          <Grid style={{ paddingLeft: '150px' }}>
            <TextField id='Name' label='Search' color='primary' onChange={this.debounceEvent(this.handleSearch, 500)} />
          </Grid>
          <Grid style={{ paddingLeft: '150px' }}>
            <Button variant='contained' onClick={this.downloadExcel}>
              Download Excel Report
            </Button>
            <Button variant='outlined' style={{ marginTop: '5px', marginLeft: '14px' }} color='primary' onClick={this.handleClicked}

            >
DELETE CLASS GROUP
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={this.state.anchorEl}
              onClose={this.handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <Typography >
                <Button color='primary' onClick={this.handleClickOpen} target='_blank'>
          Anvesh
                </Button>

                { this.state.showTimer && <Dialog
                  open={this.state.openDialog}
                  onClose={this.handleClickClose}
                  aria-labelledby='form-dialog-title'
                >
                  <DialogTitle id='form-dialog-title'>ENTER OTP</DialogTitle>
                  <DialogContent>

                    <Grid container>

                      <Grid item>

                        <OtpInput
                          inputStyle={{
                            width: '2rem',
                            height: '2rem',
                            margin: '30px 10px 30px 0px',
                            fontSize: '2rem',
                            borderRadius: 3,
                            border: '1px solid rgba(0,0,0,0.3)'
                          }}
                          value={this.state.otp}
                          onChange={this.handleOtpChange}
                          numInputs={5}
                          separator={<span><b>-</b></span>}
                          shouldAutoFocus
                        />
                      </Grid>
                      <Grid item>
                        {this.state.showTimer && <Timer
                          initialTime={180000}
                          direction='backward'
                          checkpoints={[
                            {
                              time: 0,
                              callback: () => this.setState({ showTimer: false })

                            }
                          ]}
                        >
                          <Grid item style={{ paddingTop: 30, fontSize: '20px' }}>
                            <Timer.Minutes /> :
                            <Timer.Seconds /></Grid>
                        </Timer>}

                      </Grid>

                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClickOpen} color='primary' disabled={onSaveloading}>
                      {this.state.resend_otp && (onSaveloading ? 'RESENDING OTP...' : 'RESEND OTP')}
                    </Button>
                    {this.state.otp.length === 5 ? <Grid item> <Button
                      onClick={this.handleVerify}
                      variant='contained'
                      color='primary'
                      disabled={onVerifyloading}
                    >
                      { onVerifyloading ? 'VERIFYING...' : 'VERIFY' }

                    </Button></Grid> : ''}
                  </DialogActions>
                </Dialog>}

              </Typography>
              {/* ///////balram///////// */}
              <Typography >
                <Button color='primary' onClick={this.handleClickOpen2} target='_blank'>
          Balram
                </Button>

                {this.state.showTimer && <Dialog
                  open={this.state.openDialog2}
                  onClose={this.handleClickClose2}
                  aria-labelledby='form-dialog-title'
                >
                  <DialogTitle id='form-dialog-title'>ENTER OTP</DialogTitle>
                  <DialogContent>
                    <Grid container>
                      <Grid item>
                        <OtpInput
                          inputStyle={{
                            width: '2rem',
                            height: '2rem',
                            margin: '30px 10px 30px 0px',
                            fontSize: '2rem',
                            borderRadius: 3,
                            border: '1px solid rgba(0,0,0,0.3)'
                          }}
                          value={this.state.otp}
                          onChange={this.handleOtpChange}
                          numInputs={5}
                          separator={<span><b>-</b></span>}
                          shouldAutoFocus
                        />
                      </Grid>
                      <Grid item>
                        <Timer
                          initialTime={180000}
                          direction='backward'
                          checkpoints={[
                            {
                              time: 0,
                              callback: () => this.setState({ showTimer: false })

                            }
                          ]}
                        >
                          <Grid item style={{ paddingTop: 30, fontSize: '20px' }}>
                            <Timer.Minutes /> :
                            <Timer.Seconds /></Grid>
                        </Timer>

                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClickOpen2} color='primary' disabled={onSaveloading}>
                      {this.state.resend_otp && (onSaveloading ? 'RESENDING OTP...' : 'RESEND OTP')}

                    </Button>
                    {this.state.otp.length === 5 ? <Grid item> <Button
                      onClick={this.handleVerify}
                      variant='contained'
                      color='primary'
                      disabled={onVerifyloading}
                    >
                      { onVerifyloading ? 'VERIFYING...' : 'VERIFY' }

                    </Button></Grid> : ''}
                  </DialogActions>
                </Dialog>}

              </Typography>
              {/* ///////guru//////////// */}
              <Typography >
                <Button color='primary' onClick={this.handleClickOpen3} target='_blank'>
          Guru
                </Button>

                {this.state.showTimer && <Dialog
                  open={this.state.openDialog3}
                  onClose={this.handleClickClose3}
                  aria-labelledby='form-dialog-title'
                >
                  <DialogTitle id='form-dialog-title'>ENTER OTP</DialogTitle>
                  <DialogContent>
                    <Grid container>
                      <Grid item>
                        <OtpInput
                          inputStyle={{
                            width: '2rem',
                            height: '2rem',
                            margin: '30px 10px 30px 0px',
                            fontSize: '2rem',
                            borderRadius: 3,
                            border: '1px solid rgba(0,0,0,0.3)'
                          }}
                          value={this.state.otp}
                          onChange={this.handleOtpChange}
                          numInputs={5}
                          separator={<span><b>-</b></span>}
                          shouldAutoFocus
                        />
                      </Grid>
                      <Grid item>
                        <Timer
                          initialTime={180000}
                          direction='backward'
                          checkpoints={[
                            {
                              time: 0,
                              callback: () => this.setState({ showTimer: false })

                            }
                          ]}
                        >
                          <Grid item style={{ paddingTop: 30, fontSize: '20px' }}>
                            <Timer.Minutes /> :
                            <Timer.Seconds /></Grid>
                        </Timer>

                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClickOpen3} color='primary' disabled={onSaveloading}>
                      {this.state.resend_otp && (onSaveloading ? 'RESENDING OTP...' : 'RESEND OTP')}
                    </Button>
                    {this.state.otp.length === 5 ? <Grid item> <Button
                      onClick={this.handleVerify}
                      variant='contained'
                      color='primary'
                      disabled={onVerifyloading}
                    >
                      { onVerifyloading ? 'VERIFYING...' : 'VERIFY' }

                    </Button></Grid> : ''}
                  </DialogActions>
                </Dialog>}

              </Typography>

            </Popover>
          </Grid>
        </Toolbar>
        <ReactTable
          manual
          data={this.state.data}
          defaultPageSize={this.state.pageSize}
          style={{ maxWidth: '100%' }}
          //   ? this.state.data.results : []}
          showPagination
          showPageSizeOptions={false}
          onPageChange={(pNo) => { this.getStudentData(pNo) }}
          page={this.state.pageNumber}
          pages={this.state.totalPages}
          SubComponent={this.subComponent}
          expanded={this.state.expanded}
          onExpandedChange={expanded => this.setState({ expanded })}
          columns={[
            {
              Header: <div>Sr</div>,
              accessor: 'id',
              Cell: (row) => {
                return <div>{(this.state.pageSize * (this.state.pageNumber) + (row.index + 1))}</div>
              },
              maxWidth: 60
            },
            {
              Header: 'Class Group Name',
              accessor: 'group_name'
            },
            {
              Header: 'Created By',
              accessor: 'created_by'
            },
            {
              Header: 'Created On',
              accessor: 'created_date'
            },
            {
              Header: 'Group Size',
              accessor: 'member_count'
            }
          ]
          }
        />

      </React.Fragment>

    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.gradeMap.items,
  classgrouptypes: state.classgrouptypes.items

})

export default connect(
  mapStateToProps
)(withRouter(ListClassGroup))
