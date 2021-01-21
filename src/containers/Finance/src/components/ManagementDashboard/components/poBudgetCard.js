import React from 'react'
import { Grid, CardContent, CardHeader, Card } from '@material-ui/core'
import Piechart from '../../../ui/BarGraph/Piechart'

export default class PoBudgetCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    const { pieChartvalues } = this.props
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6} md={6} className='graphs__dashbord'>

          <Card style={{ borderRadius: '20px', border: '2px solid rgb(255, 255, 255)' }}>
            <CardHeader
              title={<p style={{ color: '#5d1049', borderBottomStyle: 'solid', width: '175px', marginLeft: '12px', borderColor: 'lightgrey', 'font-weight': '500', 'font-family': 'sans-serif' }}>Total PO Budget</p>}

            />
            <CardContent>
              <Piechart properties={{ ...pieChartvalues }} />
            </CardContent>
          </Card>
        </Grid>

      </React.Fragment>
    )
  }
}
