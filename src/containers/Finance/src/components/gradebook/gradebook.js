import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid,
  // Tab, Tabs,
  Button } from '@material-ui/core'
import { Lock, LockOpen } from '@material-ui/icons'
import axios from 'axios'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/combinations'
import { COSCHOLASTICCOMBINATIONS } from './config/coscholasticCombinations'
import { OmsSelect } from '../../ui'
import Tab1Contents from './gradebook-tabs/tab1Contents'
import Tab2Contents from './gradebook-tabs/tab2Contents'
import Tab3Contents from './gradebook-tabs/tab3Contents'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'

/**
 * All the Gradebook categories and students loaded based on [BRANCH -> GRADE -> SUBJECT] and are shown inside a react-table
 * The UI includes two tabs: 1.To edit each student's secured marks 2. To edit each student's
 * Inside each Gradebook category students belonging to the selected values are loaded along with their secured marks
 *The Secured marks can be re-evaluated(changed) by Academic-Coordinator and principal
 *Teacher can only view the Gradebook of the students
 */

/** Class representing Gradebook */
class Gradebook extends Component {
  constructor () {
    super()
    this.state = {
      gradeBookCrieteriaData: [],
      coScholasticData: [],
      currentTab: 0,
      loading: false,
      selectedData: {},
      isGlobalLocked: false,
      termList: [],
      showSelectors: false,
      selectedTermId: null,
      isBranchLocked: false,
      selectedCriteriaType: 'Scholastic',
      selectedGradeName: ''
    }
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  componentDidMount () {
    this.getTerms()
      .then(result => { this.setState({ termList: result.data }) })
      .catch(err => { console.log(err) })
    this.props.branchList()
  }

  getTerms = async () => {
    let res = await axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  getBranchLockStatus = async () => {
    const { selectedTermId, selectedData } = this.state
    let res = await axios.get(`${urls.LockGradebook}?term_id=${selectedTermId}&branch_id=${selectedData.branch_id}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  setGradeName = (gradesList = [], gradeId = '') => {
    const selectedGradeName = gradesList.find(grade => {
      return grade.acad_branch_grade_mapping_id === Number(gradeId)
    })
    this.setState({ selectedGradeName: selectedGradeName.grade_name })
  }

  onChange = (data, object) => {
    if (JSON.stringify(this.state.selectedData) !== JSON.stringify(data)) {
      this.setState({ selectedData: data }, () => {
        if (data.branch_id && !data.acad_branch_grade_mapping_id) {
          console.log('inside first')
          this.getBranchLockStatus()
            .then(res => {
              this.setState({ isBranchLocked: JSON.parse(res.data.locked_status) })
            })
            .catch(err => {
              console.log(err)
            })
        } else if (data.acad_branch_grade_mapping_id) {
          this.role !== 'Subjecthead' ? this.setGradeName(object[1], data.acad_branch_grade_mapping_id) : this.setGradeName(object[2], data.acad_branch_grade_mapping_id)
        }
      })
    }
  }

  handleTabChange = (data) => {
    this.setState({ currentTab: data.value, selectedValue: data, selectedCriteriaType: data.label })
  }

  handleTermChange = (data) => {
    this.setState({ showSelectors: true, isGlobalLocked: JSON.parse(data.locked), selectedTermId: data.value }, () => {
      if (this.state.selectedData.branch_id) {
        this.getBranchLockStatus()
          .then(res => {
            this.setState({ isBranchLocked: JSON.parse(res.data.locked_status) })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  setLockStatus = (type, path) => {
    const { isGlobalLocked, selectedTermId, selectedData, isBranchLocked } = this.state
    let formData = new FormData()
    formData.append('term_id', selectedTermId)
    if (type === 'Branch') {
      formData.append('lock_status', !isBranchLocked === true ? 'True' : 'False')
      formData.append('branch_id', selectedData.branch_id)
    } else if (type === 'Global') {
      formData.append('lock_status', !isGlobalLocked === true ? 'True' : 'False')
    }
    axios.post(path, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then((res) => {
        if (type === 'Global') {
          let termListCopy = [...this.state.termList]
          termListCopy.map((term, index) => {
            if (term.id === this.state.selectedTermId) {
              termListCopy[index].locked = !termListCopy[index].locked
            }
          })
          this.setState({ isGlobalLocked: !isGlobalLocked, termList: termListCopy })
        } else {
          this.setState({ isBranchLocked: !isBranchLocked })
        }
        this.props.alert.success('Lock status set successfully')
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Something went wrong')
      })
  }

  handleBranchChange = (data) => {
    const { value } = data
    this.setState({ selectedData: { branch_id: value } }, () => {
      this.props.gradeMapBranch(value)
    })
  }

  handleGradeChange = (data) => {
    this.setState({ selectedData: { ...this.state.selectedData, acad_branch_grade_mapping_id: data.value } })
  }

  render () {
    const { currentTab, selectedData, showSelectors, termList, selectedTermId, isGlobalLocked, isBranchLocked, selectedCriteriaType, selectedGradeName } = this.state
    let gradebookTypes = [
      { label: 'Scholastic', value: 0 },
      { label: 'Coscholastic', value: 1 },
      { label: 'Teacher Remark, Attendance & Board Registration no.', value: 2 },
      { label: 'Theatre', value: 3 },
      { label: 'Gameskill', value: 4 }
    ]
    return (
      <div>
        <div>
          <Grid container>
            <Grid item xs={12} sm={5}>
              <OmsSelect
                label='Select'
                placeholder='Scholastic'
                options={
                  gradebookTypes.map((gradebook) => {
                    return { label: gradebook.label, value: gradebook.value }
                  })
                }
                change={this.handleTabChange}
              />

            </Grid>
            <Grid style={{ marginLeft: 10 }}>
              <OmsSelect
                label={'Term'}
                options={termList.map((term) => {
                  return { label: term.term, value: term.id, locked: term.locked }
                })}
                change={this.handleTermChange}
              />
            </Grid>     </Grid>
          <Grid container>
            <Grid item xs={12} sm={12} >
              {
                showSelectors && currentTab === 0 ? <GSelect onChange={this.onChange} variant={'selector'} config={COMBINATIONS} /> : ''
              }
              {
                showSelectors && currentTab === 1 ? <GSelect onChange={this.onChange} variant={'selector'} config={COSCHOLASTICCOMBINATIONS} /> : ''
              }
              {
                showSelectors && currentTab === 2 ? <GSelect onChange={this.onChange} variant={'selector'} config={COSCHOLASTICCOMBINATIONS} /> : ''
              }
              {
                this.role !== 'Subjecthead' && showSelectors && currentTab === 3 ? <GSelect onChange={this.onChange} variant={'selector'} config={COSCHOLASTICCOMBINATIONS} />
                  : currentTab === 3 && showSelectors ? <Grid container>
                    <Grid item xs={12} sm={3}>
                      <OmsSelect
                        label='Branch'
                        placeholder='Select Branch'
                        options={this.props.branch
                          ? this.props.branch
                            .map(branch => ({ value: branch.id, label: branch.branch_name }))
                          : []
                        }
                        change={this.handleBranchChange}
                      />
                    </Grid>
                    {
                      this.state.selectedData.branch_id
                        ? <Grid item xs={12} sm={3}>
                          <OmsSelect
                            label='Grade'
                            placeholder='Select Grade'
                            options={this.props.grade
                              ? this.props.grade
                                .map(grade => ({ value: grade.id, label: grade.grade.grade }))
                              : []
                            }
                            change={this.handleGradeChange}
                          />
                        </Grid>
                        : ''
                    }
                  </Grid>
                    : ''
              }
              {
                showSelectors && currentTab === 4 ? <GSelect onChange={this.onChange} variant={'selector'} config={COSCHOLASTICCOMBINATIONS} /> : ''
              }
            </Grid>
          </Grid>
        </div>
        <div style={{ marginTop: 20, padding: '10px 20px' }}>
          {selectedTermId && (this.role === 'Subjecthead' || this.role === 'Admin') ? <Button variant='outlined' style={{ padding: 10 }}
            onClick={() => { this.setLockStatus('Global', urls.LockGradebook) }}
          >
            {this.state.isGlobalLocked
              ? <span style={{ display: 'flex' }}><Lock /> Unlock Global Lock</span>
              : <span style={{ display: 'flex' }}><LockOpen /> <span>Set Global Lock</span></span>
            }
          </Button> : ''}
          {
            (this.role === 'Subjecthead' || this.role === 'Admin') && selectedData.branch_id
              ? <Button
                variant='outlined'
                style={{ padding: 10, marginLeft: 10 }}
                disabled={this.state.isGlobalLocked}
                onClick={() => { this.setLockStatus('Branch', urls.LockGradebook) }}
              >
                {
                  this.state.isBranchLocked
                    ? <span style={{ display: 'flex' }}><Lock /> <span>Unlock Branch Lock</span></span>
                    : <span style={{ display: 'flex' }}><LockOpen /> <span>Set Branch Lock</span></span>
                }
              </Button>
              : ''
          }

        </div>
        <div style={{ padding: 20 }}>
          {currentTab === 0 &&
          <Tab1Contents
            // subjectMappingId={!subjectMappingId ? '' : subjectMappingId}
            user={this.props.user}
            alert={this.props.alert}
            selectedTermId={selectedTermId}
            selectedData={selectedData}
            role={this.role}
            isGlobalLocked={isGlobalLocked}
            isBranchLocked={isBranchLocked}
            criteriaType={selectedCriteriaType}
            gradeName={selectedGradeName}
          />}
          {(currentTab === 1 || currentTab === 3 || currentTab === 4) &&
          <Tab2Contents
            // subjectMappingId={!subjectMappingId ? '' : subjectMappingId}
            user={this.props.user}
            alert={this.props.alert}
            selectedTermId={selectedTermId}
            selectedData={selectedData}
            role={this.role}
            isGlobalLocked={isGlobalLocked}
            isBranchLocked={isBranchLocked}
            criteriaType={selectedCriteriaType}
            gradeName={selectedGradeName}
          />}
          { currentTab === 2 &&
          <Tab3Contents
            // subjectMappingId={!subjectMappingId ? '' : subjectMappingId}
            user={this.props.user}
            alert={this.props.alert}
            selectedTermId={selectedTermId}
            selectedData={selectedData}
            role={this.role}
            isGlobalLocked={isGlobalLocked}
            isBranchLocked={isBranchLocked}
            gradeName={selectedGradeName}
          />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  branch: state.branches.items,
  grade: state.gradeMap.items
})

const mapDispatchToProps = dispatch => ({
  branchList: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Gradebook)
