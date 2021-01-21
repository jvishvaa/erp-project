import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
import { apiActions } from '../../_actions'
import { OmsSelect } from '../../ui'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.changeHandlerGrade = this.changeHandlerGrade.bind(this)
    this.changeHandlerSection = this.changeHandlerSection.bind(this)
  }

  componentDidMount () {
    this.mappindDetails = this.userProfile.academic_profile
    this.props.gradeMapBranch(this.mappindDetails.branch_id)
    this.setState({
      branchData: { value: this.mappindDetails.branch_id, label: this.mappindDetails.branch }
    })
  }

  changeHandlerGrade (event) {
    this.props.sectionMap(event.value)
    this.setState({ gradeValue: event, sectionValue: [] })
  }

  changeHandlerSection (event) {
    this.setState({ sectionValue: event })
    let sectionId = []
    sectionId.push(event.value)
    this.props.sectionId(sectionId)
  }

  render () {
    let { branchData, sectionValue } = this.state
    return (
      <React.Fragment>
        <Form>
          <Form.Group>
            <Form.Field required width={4}>
              <OmsSelect
                label={'Branch'}
                defaultValue={branchData}
                disabled
              />
            </Form.Field>
            <Form.Field required width={4}>
              <OmsSelect
                label={'Grade'}
                options={this.props.grades
                  ? this.props.grades.map(grade => ({
                    value: grade.id,
                    label: grade.grade.grade
                  }))
                  : []
                }
                change={e => this.changeHandlerGrade(e)}
                disabled={this.props.gradeLoading}
              />
            </Form.Field>
            <Form.Field required width={4}>
              <OmsSelect
                label={'Section'}
                options={this.props.sections
                  ? this.props.sections.map(section => ({
                    value: section.id,
                    label: section.section.section_name
                  }))
                  : []
                }
                defaultValue={sectionValue}
                change={e => this.changeHandlerSection(e)}
                disabled={this.props.sectionLoading}
              />
              <p style={{ color: 'red' }}>{this.props.sectionError}</p>
            </Form.Field>
          </Form.Group>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading,
  sections: state.sectionMap.items,
  sectionLoading: state.sectionMap.loading
})

const mapDispatchToProps = dispatch => ({
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadId => dispatch(apiActions.getSectionMapping(acadId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
