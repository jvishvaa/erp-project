import React from 'react'
import { Grid, withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import axios from 'axios'

import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import InputBase from '@material-ui/core/InputBase'
// import SearchIcon from '@material-ui/icons/Search'
import { fade } from '@material-ui/core/styles/colorManipulator'
import _ from 'lodash'
// import * as FileSaver from 'file-saver'
// import * as XLSX from 'xlsx'
// import { throttle, debounce } from 'throttle-debounce'

// import { Toolbar } from '../../ui'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './combination'
import './OnlineClass.css'

const styles = theme => ({
  expandCol: {
    width: '5%'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    display: 'flex'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
    // border: 'ridge'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    border: 'ridge',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  },
  grow: {
    flexGrow: 1
  },
  search: {
    marginLeft: '819px',
    // marginTop: '-62px',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    // marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
      'margin-top': '-85px',
      'margin-bottom': '27px',
      'margin-left': '243px'
    }
  }
  // searchIcon: {
  //   width: theme.spacing.unit * 9,
  //   height: '100%',
  //   position: 'absolute',
  //   pointerEvents: 'none',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // }
})

class EngagementReport extends React.Component {
  constructor () {
    super()

    this.state = {
      ref: React.createRef(),
      pageSize: 10,
      currentPage: 1,
      page: 1,
      engagementReport: [],
      engagementReportSearch: [],
      searchValue: '',
      selectorData: {},
      fileName: 'students'
      //   searchLength: 0
      //   pageIndex: null

    }
    this.fetchData = this.fetchData.bind(this)
    this.delayedCallback = _.debounce((value) => {
      this.handleSearch({ target: { value: this.state.searchValue } })
      console.log(value, 'search')
    }, 2000)
  }

  componentDidMount () {
    this.EngagementReport()
  }
  handleClickGrade = event => {
    var list = event.map(val => ({ grade: val.value }))
    this.setState({ grade: list, valueGrade: event })
  }
  EngaementReportExcel () {
    // if (this.state.selectorData.grade_id === undefined) {
    //   return this.props.alert.error('Error Occured')
    // }
    // checking the repo
    console.log(this.props.user)
    let url = urls.EngagementReportExcel
    axios
      .get(url, {
        params: {
          grade_id: this.state.selectorData.grade_id
        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        },
        'responseType': 'blob'
      })
      .then(res => {
        if (res.status === 200) {
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          let url = window.URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'guest_student_engagement.xls')
          document.body.appendChild(link)
          link.click()
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  EngagementReport (state, pageSize) {
    let url = urls.EngagementReport
    pageSize = pageSize || this.state.pageSize
    axios
      .get(url, {
        params: {
          page_number: state && state.page ? state.page + 1 : 1,
          page_size: pageSize
        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ engagementReport: res.data.data,
            pageIndex: 0,
            pages: res.data.total_pages,
            page: res.data.current_page
          })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  gradeFilterEngagementReport (state, pageSize) {
    let url = urls.EngagementReport
    pageSize = pageSize || this.state.pageSize
    axios
      .get(url, {
        params: {
          grade_id: this.state.selectorData.grade_id,
          page_number: state && state.page ? state.page + 1 : 1,
          page_size: pageSize
        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          // this.handleSearchInputChange({ target: { value: '' } })
          this.setState({ engagementReport: res.data.data,
            pageIndex: 0,
            pages: res.data.total_pages,
            page: res.data.current_page,

            searchValue: ''
          })
          // this.handleSearchInputChange({ target: { value: '' } })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  onChange = (data) => {
    let { selectorData } = this.state
    console.log(selectorData, data)
    this.setState({ selectorData: data })
  }
  fetchData = (state, e, instance) => {
    this.setState({ loading: true })
    if (this.state.selectorData.grade_id && !this.state.searchValue) {
      this.gradeFilterEngagementReport(state)
    } else if (!this.state.searchValue) {
      console.log(this.state.searchValue, 'vvaaa')

      this.EngagementReport(state)
    }
    if (this.state.searchValue) {
      console.log('searchinnggg page')
      this.handleSearch({ target: { value: this.state.searchValue } }, state)
    }
  }

    handleSearch = (e, state, pageSize) => {
      let url = urls.EngagementReportSearch
      pageSize = pageSize || this.state.pageSize
      let { id } = this.state
      console.log(this.state.searchValue, id, 'value')
      console.log('searching', e.target.value)
      console.log('crt', this.state.id)
      // e.persist()
      //   if (!id) {
      //     this.setState({ tabChangeLoading: false })
      //   } else {
      this.setState({ currentPage: 0, searchLength: e.target.value.length, searchValue: e.target.value, tabChangeLoading: true, pageNo: 0 })
      //   }
      // this.delayedCallback(e.target.value)
      if (this.state.call) {
        this.state.call.cancel()
      }
      var CancelToken = axios.CancelToken
      var call = CancelToken.source()
      this.setState({ call })

      // var call2 = CancelToken.source()
      axios
        .get(url, {
          cancelToken: call.token,
          params: {
            search: e.target.value,
            grade_id: this.state.selectorData.grade_id,
            page_number: state && state.page ? state.page + 1 : 1,
            page_size: pageSize

          },
          headers: {
            'Authorization': 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.setState({ engagementReportSearch: res.data.data,
              pageIndex: 0,
              pages: res.data.total_pages,
              page: res.data.current_page })
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          this.props.alert.error('Error Occured')
          console.log(error)
        })
    // debounce(700, (e) => {
    //   this.getData(this.state.searchValue)
    // })(e)
    }
    handleSearchInputChange = (e) => {
      this.setState({ searchValue: e.target.value })
      this.delayedCallback(e.target.value)
    }
    downLoadExcel= () => {
      this.EngaementReportExcel()
    }

    render () {
      let { classes } = this.props
      console.log(this.state.engagementReportSearch, 'searc')
      console.log(this.state.searchValue, 'len')
      console.log(this.state.searchLength > 0 ? 'searc' : 'noy')

      return (
        <React.Fragment>
          {/* <Toolbar > */}
          <Grid container spacing={2} className='online__class--grid-container'>
            <Grid item>
              <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
            </Grid>
          </Grid>
          <Grid item>
            <Button variant='contained' style={{ 'margin-left': '151px', 'margin-top': ' -121px' }} color='primary' onClick={() => this.gradeFilterEngagementReport(this.state.page || 1)}>
         FILTER
            </Button >
          </Grid>
          <div className={classes.grow} />
          <div className={classes.search}>
            {/* <div className={classes.searchIcon}> */}
            {/* <SearchIcon /> */}
            {/* </div> */}
            <InputBase style={{ ' border': 'ridge' }}
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              value={this.state.searchValue}
              onChange={this.handleSearchInputChange}
              onBlur={(e) => { e.target.value.length < 0 && this.setState({ searching: false }) }}
              onFocus={(e) => { e.target.value.length > 0 && this.setState({ searching: true }) }}
            />
          </div>
          <Grid item>
            <Button variant='contained' style={{ 'margin-left': '551px', 'margin-top': ' -121px' }} color='primary' onClick={() => this.downLoadExcel()}>
         Download Excel
            </Button >
          </Grid>
          {/* </Toolbar> */}
          <ReactTable
            columns={[
              {
                Header: 'Name',
                accessor: 'name'
              },
              {
                Header: 'Grade',
                accessor: 'grade'
              },
              {
                Header: 'Total Classes',
                accessor: 'total_classes'
              },
              {
                Header: 'Accepted Count',
                accessor: 'accepted_count'
              },
              {
                Header: 'Attended Count',
                accessor: 'attended_count'
              },
              {
                Header: 'Limit Reached Classes',
                accessor: 'limit_reached_classes'
              },
              {
                Header: 'User Name',
                accessor: 'username'
              },
              {
                Header: 'Mobile Number',
                accessor: 'phone_number'
              }
            ]}
            manual
            // (e)=>this.fetchData(e)
            // onFetchData={(e) => this.fetchData(e)}
            onFetchData={this.fetchData}
            // data={this.state.searchLength > 0 ? this.state.engagementReportSearch : this.state.engagementReport}
            data={this.state.searchValue.length > 0 ? this.state.engagementReportSearch : this.state.engagementReport}
            // data={this.state.engagementReport}
            // onPageChange={(e) => {
            //   this.handleSearch(e)
            // }}
            defaultPageSize={5}
            pages={this.state.pages}
            pageSize={this.state.pageSize}
            page={this.state.page - 1}

          />

        </React.Fragment>

      )
    }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.grades.items

})

const mapDispatchToProps = dispatch => ({
  listGrades: dispatch(apiActions.listGrades())

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(EngagementReport)))
