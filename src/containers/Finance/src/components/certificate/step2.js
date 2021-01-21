/* eslint-disable no-undef */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Card, CardContent, Typography, Paper } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import axios from 'axios'
import { urls } from '../../urls'
// import GSelect from '../../_components/globalselector'
// import { COMBINATIONS } from './CgSelector'
import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
// import { gradeMap } from '../../_reducers/gradeMap.reducer'

const styles = theme => ({
  label: {
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5
  },
  level__drop: {
    width: '100%'
  },
  root: {
    minWidth: 'auto',
    minHeight: 'auto'
  },
  under__line: {
    'margin-top': '2%',
    'margin-bottom': '2%',
    'border-bottom': '2px solid #5d2449'
  }
})

const AutoCompleteField = [
  { label: 'First Prize - Name' },
  { label: 'Second Prize - Name' },
  { label: 'Third Prize - Name' }
]

class Step2 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      erpList: [],
      winnerList: [],
      erpOption: [],
      loadingErp: false,
      isSkipped: this.props.isSkipped,
      loadingWinnersNames: false
      // clearData: false
      // key: 0
    }
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  componentWillMount () {
    // // eslint-disable-next-line no-debugger
    // debugger
    let { branchValue, gradeValue, winnerList, gradeMapId, branchId, role, sectionMapId } = this.props

    this.setState({
      branchValue: branchValue,
      gradeValue: gradeValue,
      winnerList: winnerList

    })

    console.log(this.state.gradeValue)

    this.props.listBranches()
    let academicProfile = JSON.parse(localStorage.getItem('user_profile')).academic_profile
    let issuerbranchId = academicProfile && academicProfile.branch_id

    if (this.role === 'Principal' || this.role === 'AcademicCoordinator' ||
    this.role === 'EA Academics') {
      this.setState({
        branchId: issuerbranchId,
        branchValue: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
      this.handleClickBranch({ value: academicProfile.branch_id, label: academicProfile.branch })
    } else if (branchValue) {
      this.handleClickBranch(branchValue)
    }

    if (role && role === 'Student') {
      if (gradeMapId) {
        this.props.gradeMapBranch(branchId)
        this.getErpList(null, gradeMapId)
      } else if (sectionMapId) {
        this.getErpList(null, null, sectionMapId)
      }
    } else if (branchId) {
      this.getErpList(branchId, null)
    }
  }
  getErpList (branchId, gradeMapId, secMapId) {
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({ loadingWinnersNames: true })
    let { role } = this.props

    if (branchId || gradeMapId || secMapId) {
      let path = ''
      if (branchId) {
        path = `?role=${role}&branch_id=${branchId}`
      } else if (gradeMapId) {
        path = `?role=${role}&acad_branch_mapping_id=${gradeMapId}`
      } else if (secMapId) {
        path = `?role=${role}&section_map_id=${secMapId}`
      }
      axios.get(`${urls.CertificateErpList}${path}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }

      }).then(res => {
        let { data: { data = [] } = {} } = res
        this.setState({ erpList: data })
        if (data) {
          this.setState({ loadingWinnersNames: false })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  handleClickBranch = (e, clear) => {
    // // eslint-disable-next-line no-debugger
    // debugger

    let { winnerList } = this.state
    console.log(this.props.gradeValue, this.props.winnerList)
    let { role } = this.props

    let branchId = this.role === 'Admin' ? e.map(e => e.value) : e.value
    let branchName = this.role === 'Admin' ? e.map(e => e.label) : e.label
    console.log(branchId, typeof (branchId), 'brrr')
    // let branchId = e.value
    if (role !== 'Student') {
      this.getErpList(branchId)
    }
    if (winnerList && winnerList.length) {
      this.setState({ clearData1: true })
    }
    this.setState({ branchId, branchValue: e })
    if (clear) {
      this.setState({ gradeValue: [], winnerList: [], erpList: [] })

      this.props.handleBranch(branchId, branchName, e, [], [])
    } else if (this.props.winnerList && this.props.winnerList.length) {
      this.props.handleBranch(branchId, branchName, e, this.props.winnerList, this.props.gradeValue)
    } else {
      this.props.handleBranch(branchId, branchName, e, [], [])
    }
    if (this.props.gradeValue && this.props.gradeValue.length) {
      this.handleClickGrade(this.props.gradeValue)
    }
    if (!this.props.isSkipped) {
      this.props.gradeMapBranch(branchId)
    }
  }

  handleClickGrade = (e, clear) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    let gradeArry = e.map(e => e.value)
    let { winnerList } = this.state

    if (gradeArry && gradeArry.length) {
      this.getErpList(null, gradeArry)
    }
    if (winnerList && winnerList.length) {
      this.setState({ clearData1: true })
    }
    this.setState({ gradeValue: e })
    if (clear) {
      this.setState({ winnerList: [], erpList: [] })
      this.props.handleGrade(e.value, e.label, e, [])
    } else {
      this.props.handleGrade(e.value, e.label, e, this.props.winnerList)
    }

    console.log(e.value)
  }
  handleChange = (event, rank) => {
    let { winnerList } = this.state
    let exitsWinnersList = winnerList.filter(({ rank: wRank }) => wRank === rank)
    let excludedWinnerList = exitsWinnersList.filter(({ erp: werp }) => !event.some(({ erp: everp }) => werp === everp))
    if (excludedWinnerList && excludedWinnerList.length) {
      winnerList = winnerList.filter(({ erp: werp }) => !excludedWinnerList.some(({ erp: rerp }) => werp === rerp))
    } else {
      event.map(e => {
        if (e) {
          winnerList.push({
            name: e.name,
            erp: e.erp,
            rank: rank,
            brId: e.branch && e.branch.id,
            brName: e.branch && e.branch.branch_name,
            grade: e.grade && e.grade.grade,
            mappingId: e.acad_branch_mapping && e.acad_branch_mapping.id,
            sectionMapId: e.acad_section_mapping && e.acad_section_mapping.id })
        }
      })
      winnerList = winnerList.filter((item, index, array) => {
        return array.map((mapItem) => mapItem['erp']).indexOf(item['erp']) === index
      })
    }

    console.log(winnerList, 'winnerList')
    this.setState({ winnerList: winnerList })
    this.props.handleWinner(winnerList)
    this.setState({ rank })
    this.props.handleWinner(winnerList)
  }

  render () {
    let { classes, role } = this.props
    console.log(role)
    let { branchValue, gradeValue, winnerList, erpList, clearData1, loadingWinnersNames } = this.state
    console.log(winnerList, 'winner')
    return (
      <div>
        <Grid className={classes.under__line} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={4}>

            {role === 'Student'
              ? <Grid>
                <OmsSelect
                  id='winnerBranch'
                  name='winnerBranch'
                  label={'Branch'}
                  isMulti
                  defaultValue={branchValue}
                  options={this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.id,
                      label: branch.branch_name
                    }))

                    : []

                  }
                  disabled={this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics'}

                  change={(e) => this.handleClickBranch(e, true)}
                />
                <br />
                <OmsSelect
                  id='winnerGrade'
                  isMulti
                  name='winnerGrade'
                  placeholder='Grade'
                  options={this.props.grades
                    ? this.props.grades.map(grade => ({
                      value: grade.id,
                      label: `${grade.branch.branch_name} - ${grade.grade.grade}`
                    }))
                    : []}
                  defaultValue={gradeValue}
                  change={(e) => this.handleClickGrade(e, true)}
                /></Grid>
              : <Grid>
                <OmsSelect
                  label={'Branch'}
                  isMulti
                  defaultValue={branchValue}
                  options={this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.id,
                      label: branch.branch_name
                    }))
                    : []
                  }
                  disabled={this.role === 'Principal' || this.role === 'AcademicCoordinator' ||
             this.role === 'EA Academics'}
                  change={(e) => this.handleClickBranch(e, true)}
                />
              </Grid>}
          </Grid>
          {loadingWinnersNames && <div className='notification-text'>please wait getting names...</div>}
          <Grid item xs={12} sm={4} md={4}>
            {AutoCompleteField.map((acf, index) => {
              return (<Autocomplete
                id='1'
                key={clearData1}
                options={erpList && winnerList && erpList.filter(ar => !winnerList.find(rm => rm.erp === ar.erp))
                }
                style={{ paddingTop: 10 }}
                multiple
                onChange={(e, data) => this.handleChange(data, index + 1)}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField
                  {...params} required label={acf.label} InputLabelProps={{
                    classes: {
                      root: classes.label
                    }
                  }}variant='outlined'
                  className={classes.level__drop}
                />}
                value={winnerList && winnerList.filter(e => e.rank === index + 1)}

              />)
            })}

          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Card className={classes.root}>
              <CardContent>
                {winnerList.length !== 0
                  ? winnerList && winnerList.map((item, index) => {
                    return <React.Fragment>
                      <Paper style={{ width: '100%', padding: 10, margin: 10, backgroundColor: index % 2 ? '#f5beb4' : '#cbf6db' }} elevation={3}>
                        <Typography style={{ paddingLeft: 5 }} align='center' variant='body2' color='textSecondary'>Position : {item.rank === 1 ? item.rank + 'st' : item.rank === 2 ? item.rank + 'nd' : item.rank === 3 ? item.rank + 'rd' : ''}</Typography>
                        <Typography style={{ padding: 5 }}>ERP: {item.erp}</Typography>
                        <Typography style={{ padding: 5 }}>Name: {item.name}</Typography>
                        <Typography style={{ padding: 5 }}>Grade: {item.grade}</Typography>
                      </Paper>
                    </React.Fragment>
                  })
                  : <Typography>No Winners Selected</Typography>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  grades: state.gradeMap.items
})
const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Step2)))
