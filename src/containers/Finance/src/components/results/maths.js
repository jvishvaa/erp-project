import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import './report.css'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class reportMath extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    this.setState({ assData: this.props.assData })
  }

  answerColor (questionNumber) {
    if (!this.state.assData.question_data[questionNumber].marked_answer) {
      return 'greyShade'
    } else if (this.state.assData.question_data[questionNumber].marks_obtained === '1') {
      return 'correctAns'
    } else {
      return 'wrongAns'
    }
  }

  analysisColor (section) {
    if (this.state.assData.analysis[section].includes('better')) {
      return 'analysisBetter'
    } else return 'analysisLesser'
  }

  render () {
    let { assData } = this.state
    return (
      <React.Fragment>
        {assData && assData.question_data
          ? <div>
            <table border='1' style={{ textAlign: 'center' }} >
              <colgroup>
                <col width='5%' />
                <col width='10%' />
                <col width='6%' />
                <col width='6%' />
                <col width='6%' />
                <col width='10%' />
                <col width='10%' />
                <col width='10%' />
                <col width='35%' />
              </colgroup>
              <thead>
                <tr>
                  <td className='blueHeader' colSpan={9}>{assData.test_name} - {assData.grade_name} - {assData.subject_name}</td>
                </tr>
                <tr className='greyShade'>
                  <td> Q. No. </td>
                  <td> Q. Category </td>
                  <td> Correct Ans. </td>
                  <td> Marked Ans. </td>
                  <td> Marks Obtained </td>
                  <td> Category wise Aggregate Student Score (%) </td>
                  <td> Section wise Aggregate Class Score (%) </td>
                  <td> Section wise Aggregate National Score (%) </td>
                  <td> Analysis </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='greyShade'> {assData.question_data[0].q_no} </td>
                  <td className='sectionOne' rowSpan={7}> Basic </td>
                  <td> {assData.question_data[0].correct_answer} </td>
                  <td className={this.answerColor(0)}> {assData.question_data[0].marked_answer ? assData.question_data[0].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[0].marks_obtained} </td>
                  <td className='sectionOne' rowSpan={7}> {assData.student_aggregate ? assData.student_aggregate.section_one : '-'} </td>
                  <td className='sectionOne' rowSpan={7}> {assData.class_aggregate ? assData.class_aggregate.section_one : '-'} </td>
                  <td className='sectionOne' rowSpan={7}> {assData.national_aggregate ? assData.national_aggregate.section_one : '-'} </td>
                  <td className={this.analysisColor('section_one')} rowSpan={7}> {assData.analysis.section_one} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[1].q_no} </td>
                  <td> {assData.question_data[1].correct_answer} </td>
                  <td className={this.answerColor(1)}> {assData.question_data[1].marked_answer ? assData.question_data[1].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[1].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[2].q_no} </td>
                  <td> {assData.question_data[2].correct_answer} </td>
                  <td className={this.answerColor(2)}> {assData.question_data[2].marked_answer ? assData.question_data[2].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[2].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[3].q_no} </td>
                  <td> {assData.question_data[3].correct_answer} </td>
                  <td className={this.answerColor(3)}> {assData.question_data[3].marked_answer ? assData.question_data[3].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[3].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[4].q_no} </td>
                  <td> {assData.question_data[4].correct_answer} </td>
                  <td className={this.answerColor(4)}> {assData.question_data[4].marked_answer ? assData.question_data[4].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[4].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[5].q_no} </td>
                  <td> {assData.question_data[5].correct_answer} </td>
                  <td className={this.answerColor(5)}> {assData.question_data[5].marked_answer ? assData.question_data[5].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[5].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[6].q_no} </td>
                  <td> {assData.question_data[6].correct_answer} </td>
                  <td className={this.answerColor(6)}> {assData.question_data[6].marked_answer ? assData.question_data[6].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[6].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[7].q_no} </td>
                  <td className='sectionTwo' rowSpan={3}> Conceptual </td>
                  <td> {assData.question_data[7].correct_answer} </td>
                  <td className={this.answerColor(7)}> {assData.question_data[7].marked_answer ? assData.question_data[7].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[7].marks_obtained} </td>
                  <td className='sectionTwo' rowSpan={3}> {assData.student_aggregate ? assData.student_aggregate.section_two : '-'} </td>
                  <td className='sectionTwo' rowSpan={3}> {assData.class_aggregate ? assData.class_aggregate.section_two : '-'} </td>
                  <td className='sectionTwo' rowSpan={3}> {assData.national_aggregate ? assData.national_aggregate.section_two : '-'} </td>
                  <td className={this.analysisColor('section_two')} rowSpan={3}> {assData.analysis.section_two} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[8].q_no} </td>
                  <td> {assData.question_data[8].correct_answer} </td>
                  <td className={this.answerColor(8)}> {assData.question_data[8].marked_answer ? assData.question_data[8].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[8].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[9].q_no} </td>
                  <td> {assData.question_data[9].correct_answer} </td>
                  <td className={this.answerColor(9)}> {assData.question_data[9].marked_answer ? assData.question_data[9].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[9].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[10].q_no} </td>
                  <td className='sectionThree' rowSpan={3}> Application Based </td>
                  <td> {assData.question_data[10].correct_answer} </td>
                  <td className={this.answerColor(10)}> {assData.question_data[10].marked_answer ? assData.question_data[10].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[10].marks_obtained} </td>
                  <td className='sectionThree' rowSpan={3}> {assData.student_aggregate ? assData.student_aggregate.section_three : '-'} </td>
                  <td className='sectionThree' rowSpan={3}> {assData.class_aggregate ? assData.class_aggregate.section_three : '-'} </td>
                  <td className='sectionThree' rowSpan={3}> {assData.national_aggregate ? assData.national_aggregate.section_three : '-'} </td>
                  <td className={this.analysisColor('section_three')} rowSpan={3}> {assData.analysis.section_three} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[11].q_no} </td>
                  <td> {assData.question_data[11].correct_answer} </td>
                  <td className={this.answerColor(11)}> {assData.question_data[11].marked_answer ? assData.question_data[11].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[11].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[12].q_no} </td>
                  <td> {assData.question_data[12].correct_answer} </td>
                  <td className={this.answerColor(12)}> {assData.question_data[12].marked_answer ? assData.question_data[12].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[12].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[13].q_no} </td>
                  <td className='sectionFour' rowSpan={2}> Analytical </td>
                  <td> {assData.question_data[13].correct_answer} </td>
                  <td className={this.answerColor(13)}> {assData.question_data[13].marked_answer ? assData.question_data[13].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[13].marks_obtained} </td>
                  <td className='sectionFour' rowSpan={2}> {assData.student_aggregate ? assData.student_aggregate.section_four : '-'} </td>
                  <td className='sectionFour' rowSpan={2}> {assData.class_aggregate ? assData.class_aggregate.section_four : '-'} </td>
                  <td className='sectionFour' rowSpan={2}> {assData.national_aggregate ? assData.national_aggregate.section_four : '-'} </td>
                  <td className={this.analysisColor('section_four')} rowSpan={2}> {assData.analysis.section_four} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[14].q_no} </td>
                  <td> {assData.question_data[14].correct_answer} </td>
                  <td className={this.answerColor(14)}> {assData.question_data[14].marked_answer ? assData.question_data[14].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[14].marks_obtained} </td>
                </tr>
              </tbody>
              <tfoot className='greyShade'>
                <tr height='60'>
                  <td colSpan={2}> Over All </td>
                  <td className='totalFont' colSpan={3}> {assData.total_marks_obtained} out of {assData.total_marks} </td>
                  <td className='totalFont'> {assData.student_aggregate ? assData.student_aggregate.total : '-'} </td>
                  <td className='totalFont'> {assData.class_aggregate ? assData.class_aggregate.total : '-'} </td>
                  <td className='totalFont'> {assData.national_aggregate ? assData.national_aggregate.total : '-'} </td>
                  <td rowSpan={2}> {assData.student_name.charAt(0).toUpperCase() + assData.student_name.slice(1)}'s {assData.remark} </td>
                </tr>
                <tr height='80'>
                  <td colSpan={5}>
                    <table style={{ textAlign: 'left', margin: 'auto' }}>
                      <tbody>
                        <tr>
                          <td colSpan={2}>
                          Category Analysis Color Code
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingRight: '5px' }}>
                            <svg width='60' height='20'>
                              <rect width='60' height='20' style={{ fill: '#EDFAE0', strokeWidth: '1', stroke: 'rgb(0,0,0)' }} />
                            </svg>
                          </td>
                          <td>
                            Equal or Above Section Aggregate
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <svg width='60' height='20'>
                              <rect width='60' height='20' style={{ fill: '#FDEFEF', strokeWidth: '1', stroke: 'rgb(0,0,0)' }} />
                            </svg>
                          </td>
                          <td>
                            Less than Section Aggregate
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className='resultFont' colSpan={3}> {assData.result} </td>
                </tr>
              </tfoot>
            </table>
            {assData.omr_sheet.includes('no-img')
              ? ''
              : <div style={{ marginTop: '30px' }}>
                <a
                  href={assData.omr_sheet}
                  download
                  target='_blank'
                >
              Download OMR
                </a>
              </div>
            }
          </div>
          : ''
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(reportMath)))
