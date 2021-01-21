import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class QuestionPaperTemplate extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={6}>
              <div style={{ textAlign: 'center', border: '2px solid black', padding: '5px' }}>
                <Grid.Row>
                  <img src={require('./eduvate-logo1.png')} alt=' ' width='150px' />
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={6}>
                    <label>Grade-{this.props.paperDetails.grade && this.props.paperDetails.grade.grade}</label> &nbsp; &nbsp;
                    <label>Weekly Test-{this.props.paperDetails.question_paper_name}</label>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={10} style={{ fontSize: '12px' }}>
                    <label>Subject-{this.props.paperDetails.subject && this.props.paperDetails.subject.subject_name}</label> &nbsp; &nbsp;
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={10} style={{ fontSize: '12px' }}>
                    <label>Time-{this.props.paperDetails.duration}&nbsp;hours</label> &nbsp; &nbsp;
                    <label>Marks-{this.props.paperDetails.total_mark}</label> &nbsp; &nbsp;
                  </Grid.Column>
                </Grid.Row>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <img src={require('./instruction.png')} alt=' ' width='250px' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={10}>
              <p style={{ fontSize: '15px' }}>
                NAME _____________________________ ROLLNO______________ SECTION______
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)((withRouter(QuestionPaperTemplate)))
