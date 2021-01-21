import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Toolbar, Grid, Button } from '@material-ui/core'
import BarGraph from '../../ui/BarGraph/BarGraph'
import { urls } from '../../urls'
import { OmsSelect, InternalPageStatus } from '../../ui'
import { apiActions } from '../../_actions'

const GradebookAnalytics = (props) => {
  const [labels, setLabels] = useState([])
  const [gradeWiseStudentTotal, setGradewiseStudentTotal] = useState([])
  const [gradeWiseStudentCompleted, setGradewiseStudentCompleted] = useState([])
  const [selectedGradebookCategory, setGradebookCategory] = useState({ label: 'Coscholastic', value: 'Coscholastic' })
  const [gradeBookTypes] = useState([
    { label: 'Coscholastic', value: 'Coscholastic' }
  ])
  const [termList, setTermList] = useState([])
  const [selectedTermId, setTermId] = useState(null)
  const [selectedBranchId, setBranchId] = useState(null)
  const [showBranchSelector, setShowBranchSelector] = useState(false)
  const [showCriteriaSelector, setShowCriteriaSelector] = useState(false)
  const [gradebookCriterias, setGradebookCriterias] = useState([])
  const [loader, setLoader] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [criteriaType, setCriteriaType] = useState('')
  const [isButtonEnabled, setEnableButton] = useState(false)
  const [isDownloadButtonEnabled, setDownloadEnableButton] = useState(false)
  const userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
  const barGraphProperties = {
    labels: labels,
    graphTitle: 'Analysis',
    titleXaxis: 'Grades',
    titleYaxis: 'Total Students Count',
    mainTitle: 'Analysis of students marks entered in gradebook',
    isMultiple: true,
    totalList: gradeWiseStudentTotal,
    completedList: gradeWiseStudentCompleted,
    showLegend: true
  }

  const setData = (data) => {
    const labels = data.gradewise_details.map(grade => {
      return grade.grade_name
    })

    const gradeWiseTotalStudentsList = data.gradewise_details.map(grade => {
      return grade.total_student
    })

    const gradeWiseTotalStudentsMarksEntered = data.gradewise_details.map(grade => {
      return grade.entered_count
    })

    setLabels(labels)
    setGradewiseStudentTotal(gradeWiseTotalStudentsList)
    setGradewiseStudentCompleted(gradeWiseTotalStudentsMarksEntered)
  }

  const getGradebookAnalytics = () => {
    let path = `${urls.GradebookAnalysis}?criteria_type=Coscholastic&term_id=${selectedTermId}&category=${criteriaType}&branch_id=${selectedBranchId}`
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + props.user
      }
    })
      .then(res => {
        setData(res.data)
        setShowGraph(true)
        setLoader(false)
      })
      .catch(err => {
        console.log(err)
        setShowGraph(false)
        setLoader(false)
      })
  }

  const getTerms = () => {
    axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + props.user
      }
    })
      .then(res => {
        setTermList(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const gradebookEvaluationCategories = () => {
    const path = `${urls.GradebookCategory}?term_id=${selectedTermId}&criteria_type=${selectedGradebookCategory.value}`
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + props.user
      }
    })
      .then(res => {
        const { data } = res
        const gradebookCriterias = data.map(category => {
          return { label: category.gradebook_evaluation_category, value: category.gradebook_evaluation_category }
        })
        setGradebookCriterias(gradebookCriterias)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getTerms()
    props.listBranches()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (criteriaType) {
      setShowBranchSelector(true)
      setDownloadEnableButton(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteriaType])

  useEffect(() => {
    if (selectedTermId) {
      gradebookEvaluationCategories()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTermId])

  const handleChange = (data) => {
    setGradebookCategory(data)
  }

  const handleTermChange = (data) => {
    setTermId(data.value)
    setShowCriteriaSelector(true)
  }

  const handleBranchChange = (data) => {
    setEnableButton(true)
    setBranchId(data.value)
    setShowBranchSelector(true)
  }

  const handleCriteria = (data) => {
    setCriteriaType(data.value)
  }

  const handleGetAnalytics = () => {
    setLoader(true)
    setShowGraph(false)
    getGradebookAnalytics()
  }

  const handleExcelDownload = () => {
    const path = `${urls.GradebookAnalysisExcelDownload}?criteria_type=${selectedGradebookCategory.value}&term_id=${selectedTermId}&category=${criteriaType}&user_id=${userId}`
    const win = window.open(path, '_blank')
    if (win !== null) {
      win.focus()
    }
  }

  return (
    <React.Fragment>
      <Toolbar style={{ backgroundColor: '#ecf0f1', padding: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={2}>
            <OmsSelect
              label='Select'
              defaultValue={selectedGradebookCategory}
              options={gradeBookTypes}
              change={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <OmsSelect
              label={'Term'}
              options={termList.map((term) => {
                return { label: term.term, value: term.id }
              })}
              change={handleTermChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            {
              showCriteriaSelector
                ? <OmsSelect
                  label={'Select Criteria'}
                  options={gradebookCriterias}
                  change={handleCriteria}
                />
                : ''
            }
          </Grid>
          <Grid item xs={12} sm={2}>
            {
              showBranchSelector
                ? <OmsSelect
                  label={'Branch'}
                  options={
                    props.branches
                      ? props.branches.map(branch => ({
                        value: branch.id,
                        label: branch.branch_name
                      }))
                      : []
                  }
                  change={handleBranchChange}
                />
                : ''
            }

          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              onClick={handleExcelDownload}
              disabled={!isDownloadButtonEnabled}
              color='primary'
              variant='contained'
              style={{ marginTop: 10 }}
            >Download Excel</Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              onClick={handleGetAnalytics}
              disabled={!isButtonEnabled}
              color='primary'
              variant='contained'
              style={{ marginTop: 10 }}
            >Get Analytics</Button>
          </Grid>
        </Grid>
      </Toolbar>
      <div style={{ padding: 60 }}>
        {
          loader
            ? <InternalPageStatus label='Loading Gradebook Analytics' />
            : ''
        }
        {
          showGraph
            ? <BarGraph properties={{ ...barGraphProperties }} />
            : ''
        }

      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.authentication.user,
    branches: state.branches.items
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listBranches: () => dispatch(apiActions.listBranches())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GradebookAnalytics)
