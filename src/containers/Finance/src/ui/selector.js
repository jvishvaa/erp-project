import React from 'react'
import { connect } from 'react-redux'
import OMSSelect from './select'
import { apiActions } from '../_actions'

class Selector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      branches: props.branches,
      grades: props.grades,
      subjects: props.subjects,
      sections: props.sections
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    let { branch } = this.props
    branch && this.props.listBranches()
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.branches !== prevState.branches) {
      return { branches: nextProps.branches, grades: [], subjects: [], sections: [], grade: {}, section: {}, subject: {} }
    }
    if (nextProps.grades !== prevState.grades) {
      return { grades: nextProps.grades, subjects: [], sections: [], grade: {}, section: {}, subject: {} }
    }
    if (nextProps.subjects !== prevState.subjects) {
      return { subjects: nextProps.subjects }
    }
    if (nextProps.sections !== prevState.sections) {
      return { sections: nextProps.sections }
    }
    return null
  }

  handleChange (dropdown, item) {
    let { value } = item
    let { section, subject } = this.props
    this.setState({ [dropdown]: item })
    switch (dropdown) {
      case 'branch': this.props.listGrades(value)
        this.props.onSelectBranch && this.props.onSelectBranch({
          id: item.value,
          name: item.label
        })
        this.setState({ grade: {}, subject: {}, section: {} })
        break
      case 'grade': section && this.props.listSections(value)
        this.props.onSelectGrade && this.props.onSelectGrade({
          id: item.id,
          mapping_id: item.value,
          name: item.label
        })
        subject && this.props.listSubjects(value)
        section && this.props.listSections(value)
        this.setState({ subject: {}, section: {} })
        break
      case 'subject':
        this.props.onSelectSubject && this.props.onSelectSubject({
          id: item.id,
          mapping_id: item.value,
          name: item.label
        })
        break
      case 'section':
        this.props.onSelectSection && this.props.onSelectSection({
          id: item.id,
          mapping_id: item.value,
          name: item.label
        })
        break
    }
  }
  render () {
    let { branch, grade, subject, section } = this.props
    let { branches, grades, subjects, sections } = this.state
    return <React.Fragment>
      {branch && <OMSSelect
        defaultValue={this.state.branch}
        change={(e) => this.handleChange('branch', e)}
        options={Array.isArray(branches) ? branches.map(branch => ({
          value: branch.id,
          label: branch.branch_name
        })) : []} label={'Branch'} />}
      {grade && <OMSSelect
        change={(e) => this.handleChange('grade', e)}
        defaultValue={this.state.grade}
        options={Array.isArray(grades) ? grades.map(grade => ({
          value: grade.id,
          id: grade.grade.id,
          label: grade.grade.grade
        })) : []} label={'Grade'} />}
      {subject && <OMSSelect
        defaultValue={this.state.subject}
        options={Array.isArray(subjects) ? subjects.map(subject => ({
          value: subject.id,
          id: subject.subject.id,
          label: subject.subject.subject_name
        })) : []
        }
        change={(e) => this.handleChange('subject', e)}
        label={'Subject'} />}
      {section && <OMSSelect
        options={Array.isArray(sections) ? sections.map(section => ({
          value: section.id,
          id: section.section.id,
          label: section.section.section_name
        })) : []
        }
        change={(e) => this.handleChange('section', e)}
        label={'Section'} />}
    </React.Fragment>
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  subjects: state.subjectMap.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listGrades: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  listSections: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  listSubjects: acadMapId => dispatch(apiActions.getSubjectMapping(acadMapId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Selector)
