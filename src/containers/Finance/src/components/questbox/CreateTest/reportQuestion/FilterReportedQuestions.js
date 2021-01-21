import React, { useState, useEffect } from 'react'
import { Grid, Paper, Collapse, ListItem, ListItemText, Button } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { connect } from 'react-redux'
import axios from 'axios'
import Checkbox from '../../Checkbox/Checkbox'
import GSelect from '../../../../_components/globalselector'
import { COMBINATIONS } from '../../../../components/videoUpload/config/combination'
import { apiActions } from '../../../../_actions/index'
import { urls } from '../../../../urls'

const FilterReportedQuestions = (props) => {
  const [open, setOpen] = useState(false)
  const [questionCategoriesList, setQuestionCategories] = useState([])
  const [questionLevelsList, setQuestionLevelsList] = useState([])
  const [questionTypesList, setQuestionTypesList] = useState([])
  const [subjectsList, setSubjectsList] = useState([])
  const [gradeList, setGradesList] = useState([])
  const [checkedQuestionTypes, setCheckedQuestionTypes] = useState(new Set())
  const [checkedQuestionLevels, setCheckedQuestionLevels] = useState(new Set())
  const [checkedQuestionCategories, setCheckedQuestionCategories] = useState(new Set())
  const [checkedSubjects, setCheckedSubjects] = useState(new Set())
  const [checkedGrades, setCheckedGrades] = useState(new Set())
  const [checkedChapter, setCheckedChapter] = useState(new Set())
  const role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role

  const handleOnExistence = (property, value, setState) => {
    if (!property.has(value)) {
      setState(property.add(value))
    } else {
      let checkedItemsCopy = property
      checkedItemsCopy.delete(value)
      setState(checkedItemsCopy)
    }
  }

  const handleCheckbox = (e, type) => {
    if (type.name === 'Question Type') {
      handleOnExistence(checkedQuestionTypes, type.value, setCheckedQuestionTypes)
    }
    if (type.name === 'Question Level') {
      handleOnExistence(checkedQuestionLevels, type.value, setCheckedQuestionLevels)
    }
    if (type.name === 'Question Category') {
      handleOnExistence(checkedQuestionCategories, type.value, setCheckedQuestionCategories)
    }
    if (type.name === 'Subjects') {
      handleOnExistence(checkedSubjects, type.value, setCheckedSubjects)
    }
    if (type.name === 'Grades') {
      handleOnExistence(checkedGrades, type.value, setCheckedGrades)
    }
  }

  const getFilterCategories = async (param) => {
    const result = await axios.get(urls[param], {
      headers: {
        Authorization: 'Bearer ' + props.user
      }
    })

    return result
  }

  const filterValue = (arr = [], accessor, setState) => {
    const filteredItems = arr.map(item => {
      return {
        key: `${item.id}`,
        value: `${item.id}`,
        text: item[accessor]
      }
    })
    setState(filteredItems)
  }

  const getFilterContent = (key, heading, array, checkedItemsList) => {
    return (
      <div>
        <Checkbox
          key={key}
          heading={heading}
          array={array}
          change={handleCheckbox}
          checkedItems={checkedItemsList}
        />
      </div>
    )
  }

  const handleGlobalSelector = (data) => {
    const { subject_id: subjectId, grade_id: gradeId, id } = data
    if (subjectId) setCheckedSubjects(checkedSubjects.add(subjectId))
    if (gradeId) setCheckedGrades(checkedGrades.add(gradeId))
    if (id) setCheckedChapter(checkedChapter.add(id))
  }

  useEffect(() => {
    getFilterCategories('SUBJECT')
      .then(res => { filterValue(res.data, 'subject_name', setSubjectsList) })
      .catch(err => { console.log(err) })

    getFilterCategories('QuestionType')
      .then(res => { filterValue(res.data, 'question_type', setQuestionTypesList) })
      .catch(err => { console.log(err) })

    getFilterCategories('QuestionLevel')
      .then(res => { filterValue(res.data, 'question_level', setQuestionLevelsList) })
      .catch(err => { console.log(err) })

    getFilterCategories('QuestionCategory')
      .then(res => { filterValue(res.data, 'category_name', setQuestionCategories) })
      .catch(err => { console.log(err) })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    filterValue(props.grades, 'grade', setGradesList)
  }, [props.grades])

  const handleApplyFilter = () => {
    props.onFilter({
      checkedQuestionTypes: Array.from(checkedQuestionTypes),
      checkedQuestionLevels: Array.from(checkedQuestionLevels),
      checkedQuestionCategories: Array.from(checkedQuestionCategories),
      checkedSubjects: Array.from(checkedSubjects),
      checkedGrades: Array.from(checkedGrades),
      checkedChapter: Array.from(checkedChapter)
    })
  }

  return (
    <Grid container style={{ position: 'relative' }}>
      <Grid item xs={2}>
        <ListItem button
          onOut
          onClick={() => { setOpen(!open) }}>
          <ListItemText style={{ fontSize: '4px', padding: 0 }} inset primary={'Filter'} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Grid>
      {open
        ? <Grid item xs={3} style={{ position: 'absolute', left: 0, top: 45, zIndex: 9999 }} >
          <Paper elevation={10}>
            <Collapse in={open} timeout='auto' unmountOnExit >
              {getFilterContent('Question Type', 'Question Type', questionTypesList, checkedQuestionTypes)
              }
              {getFilterContent('Question Level', 'Question Level', questionLevelsList, checkedQuestionLevels)
              }
              {getFilterContent('Question Level', 'Question Category', questionCategoriesList, checkedQuestionCategories)
              }
              {
                role === 'Admin'
                  ? <React.Fragment>
                    {getFilterContent('Subjects', 'Subjects', subjectsList, checkedSubjects)}
                    {getFilterContent('Grades', 'Grades', gradeList, checkedGrades)}
                  </React.Fragment>
                  : (<div style={{ padding: '10px 15px 10px 15px', boxSizing: 'border-box' }}>
                    <GSelect variant={'selector'} onChange={handleGlobalSelector} config={COMBINATIONS} />
                  </div>)
              }
              <Button
                onClick={handleApplyFilter}
                variant='outlined'
                color='primary'
                size='large'
                style={{ width: '100%' }}
              >
        Apply Filter
              </Button>
            </Collapse>
          </Paper>
        </Grid> : null
      }
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    grades: state.grades.items,
    user: state.authentication.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listGrades: dispatch(apiActions.listGrades())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterReportedQuestions)
