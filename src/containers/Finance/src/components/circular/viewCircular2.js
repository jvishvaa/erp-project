import React from 'react'
import axios from 'axios'
import anchorme from 'anchorme'
import ReactHTMLParser from 'react-html-parser'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ReactTable from 'react-table'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import IconButton from '@material-ui/core/IconButton/IconButton'
import _ from 'lodash'
import moment from 'moment'
import { withStyles, Toolbar, TextField, Paper, Chip } from '@material-ui/core'
import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import { COMBINATIONS } from './gselectConfig'
import GSelect from '../../_components/globalselector'
import './circular.css'

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})

class ViewCircular extends React.Component {
  constructor () {
    super()
    this.updatedId = []
    this.state = {
      numPages: null,
      pageNumber: 1,
      skipped: new Set(),
      activeStep: 0,
      branchData: [],
      pdf: [],
      showReactTable: false,
      gradevalue: [],
      selectedBranch: {},
      selectorData: {},
      // pageNumbers: 1,
      pageSize: 5,
      currentPage: 1,
      page: 1,
      pageIndex: null

    }

    this.getSectionData = this.getSectionData.bind(this)
    this.getFiles = this.getFiles.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.handleDateChange = this.handleDateChange.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getAllCircular = this.getAllCircular.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.user_id = this.userProfile.personal_info.user_id
  }

  componentDidMount () {
    // var sectionMapId, gradeValue
    this.mappindDetails = this.userProfile.academic_profile
    this.role = this.userProfile.personal_info.role
    if (this.role === 'Student') {
      this.mappingDetails = this.userProfile
      this.setState({
        branch: this.mappingDetails.branch_id,
        grade: this.mappingDetails.grade_id,
        section: this.mappingDetails.section_mapping_id

      })
      // this.getAllCircular()
    } else {
      this.role = this.userProfile.personal_info.role
      let academicProfile = this.userProfile.academic_profile
      // this.props.gradeMapBranch(academicProfile.branch_id)

      if (this.role === 'Principal' || this.role === 'BDM') {
        this.setState({
          branch: academicProfile.branch_id,
          branchData: { value: academicProfile.branch_id, label: academicProfile.branch }
        })
        this.changehandlerbranch({ value: academicProfile.branch_id, label: academicProfile.branch })
      }
    }

    // if (this.role === 'Teacher') {
    //   let mappingDetails = this.userProfile.academic_profile[0]
    //   this.setState({
    //     branch: mappingDetails.branch_id,
    //     branchData: { value: mappingDetails.branch_id, label: mappingDetails.branch_name }
    //   })
    //   this.changehandlerbranch({ value: mappingDetails.branch_id, label: mappingDetails.branch_name })
    //   // this.props.gradeMapBranch(mappingDetails.branch_id)
    // }
  }

  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, branchData: e, valueSection: [], gradevalue: [] })

    let gradeData = []
    // if (this.role === 'Admin' || this.role === 'Principal') {
    this.setState({ branch: e.value, gradevalue: [] })
    this.props.gradeMapBranch(e.value)
    // } else {
    if (this.role === 'Teacher') {
      let map = new Map()
      for (const item of this.mappindDetails) {
        if (!map.has(item.grade_id) && item.branch_id === e.value) {
          map.set(item.grade_id, true) // set any value to Map
          gradeData.push({
            value: item.grade_id,
            label: item.grade_name
          })
        }
      }

      this.setState({ gradeData: gradeData, gradevalue: [], valueSection: [], branchData: e })
    }
  };

  changeHandlerGrade = event => {
    // this.setState({ grade: e.value })
    let aGradeIds = []
    event.forEach(function (grade) {
      aGradeIds.push(grade.value)
    })

    if (this.role === 'Teacher') {
      let sections = []
      event.forEach(grade => {
        return this.mappindDetails.filter(mapping => mapping.grade_id === grade.value).map((mapping) => {
          sections.push({
            value: mapping.section_mapping_id,
            label: mapping.section_name
          })
        })
      })
      sections = _.uniqBy(sections, 'value')
      this.setState({ sectionData: sections, gradeValue: event, gradevalue: event })
    } else {
      this.props.sectionMap(aGradeIds[0])
      this.setState({ gradevalue: aGradeIds, gradeValue: event, sectionValue: [], sectionData: [] })
    }
  };

  changeHandlerSection (event) {
    let sectionId = []
    event.map(section => {
      sectionId.push(section.value)
    })
    this.setState({ sectionValue: event, sectionMapId: sectionId, flagSection: false })
  }

  getSectionData (sectionId) {
    this.setState({ sectionMapId: sectionId })
  }
  changehandlerrole = e => {
    this.setState({ role: e.label, valueRole: e })
  };

  getFiles () {
    this.setState({ sectionError: '', showReactTable: true })

    this.getCircular()
  }

  fetchData = (state, instance) => {
    this.setState({ loading: true })
    if (this.role === 'Student') {
      this.getAllCircular()
    } else {
      this.getCircular(state)
    }
  }

  getCircular (state, pageSize) {
    let url = urls.Circular
    let{ selectorData, role, date } = this.state

    pageSize = pageSize || this.state.pageSize
    if (!role) {
      this.props.alert.error('Please enter required fields')
      return
    }
    axios
      .get(url, {
        params: {
          role: role,
          from_date: date,
          to_date: date,
          page_number: state && state.page ? state.page + 1 : 1,
          page_size: pageSize,

          ...selectorData
        },
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ pdf: res.data.circulars,
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
  }
  getAllCircular (state, pageSize) {
    let url = urls.Circular
    // let{ role } = this.state
    pageSize = pageSize || this.state.pageSize
    let{ date, selectorData } = this.state

    axios
      .get(url, {
        params: {
          role: this.role,
          from_date: date,
          to_date: date,
          page_number: state && state.page ? state.page + 1 : 1,
          page_size: pageSize,
          ...selectorData
          // section_mapping_id: JSON.stringify(this.state.section)
        },
        // Circular + '?section_mapping_ids=' + JSON.stringify(this.state.section) + '&role=' + this.role, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ pdf: res.data.circulars, showReactTable: true })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  onDocumentLoadSuccess = (document) => {
    const { numPages } = document
    this.setState({
      numPages,
      pageNumber: 1
    })
  }

  handleDelete (id) {
    axios
      .delete(urls.Circular + id + '/', {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Circular deleted')
          let data = this.state.pdf
          let index = data.findIndex(data => data.id === id)
          data.splice(index, 1)
          this.setState({ pdf: data })
        } else {
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  onChange (data) {
    this.setState({ selectorData: data }, () => data.section_mapping_id && this.role === 'Student' ? this.getAllCircular() : '')
  }

  handleDateChange (update) {
    this.setState({ selectedDate: update.format('YYYY-MM-DD') })
  }
  scrollHandle = (event, state, pageSize) => {
    let { currentPage } = this.state
    let url = urls.Circular
    pageSize = pageSize || this.state.pageSize
    let{ date, selectorData } = this.state
    let { target } = event

    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      // axios.get(`${urls.Circular}?page_number=${currentPage + 1}&role=${this.role}`, {
      axios
        .get(url, {
          params: {
            role: this.role,
            from_date: date,
            to_date: date,
            page_number: (currentPage + 1),
            page_size: pageSize,
            ...selectorData
          },
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          if (res.data.circulars.length) {
            this.setState({
              currentPage: this.state.currentPage + 1,
              pdf: [...this.state.pdf, ...res.data.circulars]
            })
          }
        })
    }
  }
  componentWillMount () {
    setTimeout(() => {
      this.setState({ isGSelectEnabled: true })
    }, 10000)
  }
  getHrefTODownload = () => {
    let { selectorData, currentPage, valueRole, pageSize, date } = this.state
    let { DownloadCircularExcel } = urls
    let userId = this.user_id
    // let hrefLink = DownloadExcel + '?branch_id=' + selectorData.branch_id + '?section_id=' + selectorData.section_id + '?grade_id=' + selectorData.grade_id + '?subject_id=' + selectorData.subject_id + '?from_date=' + selectedDate.from_date + '?to_date=' + selectedDate.to_date + '?user_id=' +
    let hrefLink = DownloadCircularExcel + '?'
    hrefLink += selectorData.branch_id ? `branch_id=${selectorData.branch_id}&` : ''
    hrefLink += selectorData.grade_id ? `grade_id=${selectorData.grade_id}&` : ''
    hrefLink += selectorData.section_mapping_id ? `section_id=${selectorData.section_mapping_id}&` : ''
    // hrefLink += selectorData.subject_mapping_id ? `subject_id=${selectorData.subject_mapping_id}&` : ''
    hrefLink += date ? `from_date=${date}&` : ''
    hrefLink += date ? `to_date=${date}&` : ''
    hrefLink += valueRole ? `role=${valueRole.value}&` : ''
    hrefLink += `user_id=` + userId + `&`
    hrefLink += `page_number=` + currentPage + `&`
    hrefLink += `page_size=` + pageSize
    return hrefLink
  }
  subComponent =(props) => {
    let { original = {} } = props || {}
    let { description } = original
    return <div style={{ margin: 5, padding: 5, whiteSpace: 'pre-line' }}>{ReactHTMLParser(anchorme(description))}</div>
  }

  render () {
    const { classes } = this.props
    const { pdf } = this.state
    return (
      <React.Fragment>
        {
          this.role === 'Student'
            ? <div className='circular-container'onScroll={this.scrollHandle}>
              <div style={{ display: 'flex', alignItems: 'center' }} >
                <div>
                  <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
                </div>
                <TextField
                  id='date'
                  label='Date'
                  type='date'
                  margin='normal'
                  defaultValue={this.state.date}
                  onChange={e => this.setState({ date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <Button color='primary' variant='contained'
                  onClick={() => this.getAllCircular()} >Filter</Button>
              </div>
              {pdf && pdf.length > 0 && pdf.map(circular => {
                return (
                  <Paper elevation={3} style={{ marginTop: 30, padding: 5, paddingLeft: 10 }}>
                    <h3 style={{ padding: 0, margin: 0 }}>
                      <small><u>Title:</u></small>&nbsp;<br />&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontWeight: 'normal' }}>
                        {circular.circular_name}
                      </span>
                    </h3>
                    <h4 style={{ padding: 0, margin: 0 }}>
                      <small><u>Description:</u></small>&nbsp;<br />&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontWeight: 'normal', whiteSpace: 'pre-line' }}>
                        {ReactHTMLParser(anchorme(circular.description))}
                      </span>
                    </h4>
                    {circular.media && circular.media.length > 0 &&
                        circular.media.map((file, index) => {
                          return <Chip
                            key={index}
                            clickable
                            onClick={e => window.open(file.file_content)}
                            label='View File'
                            color='secondary'
                            style={{ backgroundColor: '#5d1049' }}
                          />
                        })}
                    {circular.time_stamp && <Chip label={moment(circular.time_stamp).format('MMMM Do YYYY, h:mm:ss a')} />}
                  </Paper>

                )
              })
              }

            </div>
            : ''
        }

        {this.role !== 'Student'
          ? <div className={classes.root}>
            <Toolbar>
              <Grid container>
                <Grid style={{ marginLeft: 4 }} item>
                  <GSelect initialValue={{ branch_name: decodeURIComponent(window.location.href.split('/')[(window.location.href.split('/').length) - 1]) }} config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
                </Grid>

                <React.Fragment>

                  <Toolbar>

                    <OmsSelect
                      label={'Role'}
                      options={[{ label: 'Student', value: 'Student' }, { label: 'Teacher', value: 'Teacher' }]}

                      // defaultvalue={this.state.gradevalue}
                      change={this.changehandlerrole}
                      defaultValue={this.state.valueRole}
                      error={this.state.roleError}

                    />
                    {/* <Grid > */}
                    <TextField
                      id='date'
                      label='Date'
                      type='date'
                      margin='normal'
                      defaultValue={this.state.date}
                      onChange={e => this.setState({ date: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {/* </Grid> */}
                  </Toolbar>
                </React.Fragment>
                <Grid item>

                  <Button variant='contained' style={{ marginTop: 16 }} color='primary' onClick={() => this.getFiles(this.state.page || 1)}>
              Get Circular
                  </Button>
                  &nbsp; &nbsp;
                  <Button variant='contained' style={{ marginTop: 16 }} color='primary' href={this.getHrefTODownload()}>
              Download Excel
                  </Button>
                </Grid>
              </Grid>
            </Toolbar>

            {this.state.showReactTable && <ReactTable
              columns={[
                {
                  Header: 'Circular Name',
                  accessor: 'circular_name'
                },
                {
                  id: 'description',
                  Header: 'Description',
                  // accessor: 'description'
                  accessor: props => {
                    let { description } = props
                    return ReactHTMLParser(anchorme(description))
                  }

                },

                {
                  Header: 'File Name',
                  Cell: (props) => {
                    let { original: { media = [] } } = props
                    return media.length > 0 ? <a target='_blank' href={props.original.media[0].file_content}>View File</a> : 'No Media File'
                  }
                },
                {
                  Header: 'Date',
                  accessor: 'time_stamp'

                },
                {
                  id: 'x',
                  Header: 'Actions',
                  accessor: data => {
                    return (
                      <div>
                        {this.role !== 'CFO' && <IconButton
                          aria-label='Delete'

                          onClick={e => this.handleDelete(data.id)}
                          className={classes.margin}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>}
                      </div>
                    )
                  }
                }

              ]}
              manual
              SubComponent={this.subComponent}
              onFetchData={this.fetchData}
              data={this.state.pdf}
              defaultPageSize={5}
              showPageSizeOptions={false}
              pages={this.state.pages}
              pageSize={this.state.pageSize}
              // page={this.state.page}
              page={this.state.page - 1}

              // onPageChange={(pageIndex) => this.getCircular({ page: pageIndex + 1 })}
            />}
          </div>
          : ''

        }

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  roles: state.roles.items,
  gradeLoading: state.gradeMap.loading,
  sectionLoading: state.sectionMap.loading

})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadId => dispatch(apiActions.getSectionMapping(acadId)),
  loadRoles: dispatch(apiActions.listRoles())

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(ViewCircular)))
