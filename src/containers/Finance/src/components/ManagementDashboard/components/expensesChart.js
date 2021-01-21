// commented lines are used for google api integartion as of now it is on hold

import React from 'react'
import { Grid, Card, CardHeader, CardContent } from '@material-ui/core'
import MixedGraph from '../../../ui/BarGraph/MixedGraph'

function ExpenseChart (props) {
  const { expenses } = props
  return (
    <React.Fragment>
      <Grid item xs={12} sm={12} md={12} className='graphs__dashbord'>
        <Card style={{ borderRadius: '9px', border: '1px solid rgb(202, 239, 243)', width: 'auto', marginTop: '5vh', backgroundColor: 'cornsilk' }} >
          <CardHeader
            title={

              <p style={{ borderBottomStyle: 'solid', width: '95px', marginLeft: '12px', borderColor: 'lightgrey', color: '#5d1049', 'font-weight': '500', 'font-family': 'sans-serif', display: 'contents' }}>Expenses Chart</p>

            }

          />
          <CardContent >
            <div style={{ display: 'flex', 'align-items': 'center', 'margin-bottom': '2vh', 'margin-top': '-4vh' }}>
              {/* <img src={require('../images/Rectangle 637.svg')} alt='' width='20px' height='10vh' />
              <img src={require('../images/google.svg')} alt='' width='67px' height='15vh' /> */}
              <img src={require('../images/Rectangle 638.svg')} alt='' width='20px' height='10vh' />

              <img src={require('../images/facebook.svg')} alt='' width='70px' height='25vh' />

            </div>

            <MixedGraph properties={{ ...expenses }} />

          </CardContent>

        </Card>
      </Grid>
    </React.Fragment>
  )
}
export default ExpenseChart
