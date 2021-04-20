import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { Paper } from '@material-ui/core/'
import '../../../css/staff.css'

class FeedBack extends Component {
  render () {
    return (
      <React.Fragment>
        <div className='student-section'>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={16} className='student-addStudent-StudentSection'>
                <Paper style={{ marginTop: -50 }}>
                  <p style={{ marginTop: '90px', padding: '50px' }}>Thank You!!!!</p>
                </Paper>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

export default ((withRouter(FeedBack)))
