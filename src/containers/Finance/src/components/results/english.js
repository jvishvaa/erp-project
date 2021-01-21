import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './report.css'

class reportEnglish extends Component {
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

  render () {
    let { assData } = this.state
    return (
      <React.Fragment>
        {assData && assData.question_data
          ? <div>
            <table border='1' cellPadding='10' style={{ textAlign: 'center' }} >
              <colgroup>
                <col width='12%' />
                <col width='4%' />
                <col width='20%' />
                <col width='6%' />
                <col width='6%' />
                <col width='6%' />
                <col width='10%' />
                <col width='10%' />
                <col width='10%' />
              </colgroup>
              <thead>
                <tr>
                  <td className='blueHeader' colSpan={9}>{assData.test_name} - {assData.grade_name} - {assData.subject_name}</td>
                </tr>
                <tr className='greyShade'>
                  <td> Question Category </td>
                  <td> Q. No. </td>
                  <td> Skills Tested </td>
                  <td> Correct Ans. </td>
                  <td> Marked Ans. </td>
                  <td> Marks Obtained </td>
                  <td> Category wise Aggregate Student Score (%) </td>
                  <td> Section wise Aggregate Class Score (%) </td>
                  <td> Section wise Aggregate National Score (%) </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='sectionOne' rowSpan={6}> Reading Comprehension </td>
                  <td className='greyShade'> {assData.question_data[0].q_no} </td>
                  <td rowSpan={2}> Identify direct facts/fact or opinion based on the passage </td>
                  <td> {assData.question_data[0].correct_answer} </td>
                  <td className={this.answerColor(0)}> {assData.question_data[0].marked_answer ? assData.question_data[0].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[0].marks_obtained} </td>
                  <td className='sectionOne' rowSpan={6}> {assData.student_aggregate.section_one} </td>
                  <td className='sectionOne' rowSpan={6}> {assData.class_aggregate.section_one} </td>
                  <td className='sectionOne' rowSpan={6}> {assData.national_aggregate.section_one} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[1].q_no} </td>
                  <td> {assData.question_data[1].correct_answer} </td>
                  <td className={this.answerColor(1)}> {assData.question_data[1].marked_answer ? assData.question_data[1].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[1].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[2].q_no} </td>
                  <td> Infer main idea/purpose of the passage </td>
                  <td> {assData.question_data[2].correct_answer} </td>
                  <td className={this.answerColor(2)}> {assData.question_data[2].marked_answer ? assData.question_data[2].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[2].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[3].q_no} </td>
                  <td> Identify traits of character/s in the passage </td>
                  <td> {assData.question_data[3].correct_answer} </td>
                  <td className={this.answerColor(3)}> {assData.question_data[3].marked_answer ? assData.question_data[3].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[3].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[4].q_no} </td>
                  <td rowSpan={2}> Analysis and infer information based on the passage </td>
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
                  <td className='sectionTwo' rowSpan={3}> Vocabulary </td>
                  <td className='greyShade'> {assData.question_data[6].q_no} </td>
                  <td rowSpan={2}> Deduce word meaning/synonym/antonym/similar usage etc using contextual clues </td>
                  <td> {assData.question_data[6].correct_answer} </td>
                  <td className={this.answerColor(6)}> {assData.question_data[6].marked_answer ? assData.question_data[6].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[6].marks_obtained} </td>
                  <td className='sectionTwo' rowSpan={3}> {assData.student_aggregate.section_two} </td>
                  <td className='sectionTwo' rowSpan={3}> {assData.class_aggregate.section_two} </td>
                  <td className='sectionTwo' rowSpan={3}> {assData.national_aggregate.section_two} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[7].q_no} </td>
                  <td> {assData.question_data[7].correct_answer} </td>
                  <td className={this.answerColor(7)}> {assData.question_data[7].marked_answer ? assData.question_data[7].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[7].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[8].q_no} </td>
                  <td> Apply verbal logic to identify correct relation between the given words </td>
                  <td> {assData.question_data[8].correct_answer} </td>
                  <td className={this.answerColor(8)}> {assData.question_data[8].marked_answer ? assData.question_data[8].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[8].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='sectionThree' rowSpan={6}> Grammer </td>
                  <td className='greyShade'> {assData.question_data[9].q_no} </td>
                  <td rowSpan={4}> Apply knowledge of grammatical concepts </td>
                  <td> {assData.question_data[9].correct_answer} </td>
                  <td className={this.answerColor(9)}> {assData.question_data[9].marked_answer ? assData.question_data[9].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[9].marks_obtained} </td>
                  <td className='sectionThree' rowSpan={6}> {assData.student_aggregate.section_three} </td>
                  <td className='sectionThree' rowSpan={6}> {assData.class_aggregate.section_three} </td>
                  <td className='sectionThree' rowSpan={6}> {assData.national_aggregate.section_three} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[10].q_no} </td>
                  <td> {assData.question_data[10].correct_answer} </td>
                  <td className={this.answerColor(10)}> {assData.question_data[10].marked_answer ? assData.question_data[10].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[10].marks_obtained} </td>
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
                  <td rowSpan={2}> Apply knowledge of grammatical concepts/rules to rearrange given words to form a meaningful sentence/identify correct structure/error etc from the given options </td>
                  <td> {assData.question_data[13].correct_answer} </td>
                  <td className={this.answerColor(13)}> {assData.question_data[13].marked_answer ? assData.question_data[13].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[13].marks_obtained} </td>
                </tr>
                <tr>
                  <td className='greyShade'> {assData.question_data[14].q_no} </td>
                  <td> {assData.question_data[14].correct_answer} </td>
                  <td className={this.answerColor(14)}> {assData.question_data[14].marked_answer ? assData.question_data[14].marked_answer : 'N.A.'} </td>
                  <td> {assData.question_data[14].marks_obtained} </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className='greyShade'>
                  <td className='resultFont'> {assData.result} </td>
                  <td colSpan={2}> {assData.student_name.charAt(0).toUpperCase() + assData.student_name.slice(1)} is {assData.remark} </td>
                  <td colSpan={3}> {assData.total_marks_obtained} out of {assData.total_marks} </td>
                  <td> {assData.student_aggregate.total} </td>
                  <td> {assData.class_aggregate.total} </td>
                  <td> {assData.national_aggregate.total} </td>
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

export default withRouter(reportEnglish)
