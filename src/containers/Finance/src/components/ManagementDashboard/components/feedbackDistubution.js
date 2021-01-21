import React from 'react'
import { Grid, Card, CardContent, Divider } from '@material-ui/core'
import BarGraph from '../../../ui/BarGraph/BarGraph'

function FeedbackDistubution (props) {
  const { feedbackDistubution } = props
  return (
    <React.Fragment>
      <Grid item xs={12} sm={6} md={6} className='graphs__dashbord' >
        <Card style={{ borderRadius: '9px', border: '1px solid rgb(202, 239, 243)' }} >

          <CardContent >
            <div style={{ display: 'flex', 'margin-left': '-20vh' }}>
              <img src={require('../images/google.svg')} alt='' width='350px' height='25vh' />
              <p style={{ 'margin-top': '1vh', 'margin-left': '-18vh', color: '#707070' }}>Feedback Distribution</p>
            </div>

            <BarGraph properties={{ ...feedbackDistubution }} />
            <Divider />
          </CardContent>

        </Card>
      </Grid>
    </React.Fragment>
  )
}
export default FeedbackDistubution
