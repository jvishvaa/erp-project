import React from 'react'
import { Grid, CardContent, CardHeader, Card, Typography } from '@material-ui/core'

export default class InsightCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    const { poAmount, invoiceAmount, paidAmount, balancePayment } = this.props
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6} md={6} className='graphs__dashbord'>
          <Card style={{ borderRadius: '20px', border: '2px solid rgb(255, 255, 255)' }} >
            <CardHeader
              title={<p style={{ borderBottomStyle: 'solid', width: '95px', marginLeft: '12px', borderColor: 'lightgrey', color: '#5d1049', 'font-weight': '500', 'font-family': 'sans-serif' }}>Insight</p>}

            />
            <CardContent >
              <Typography className='insight__card__text' style={{ color: 'maroon' }}>
                &nbsp;&nbsp;Total PO Budget <p style={{ marginLeft: 'auto', color: 'black' }}>{poAmount} Rs &nbsp;</p>
              </Typography >
              <Typography className='insight__card__text' style={{ marginTop: '10px', color: 'blue' }}>
                &nbsp;&nbsp;Total Invoice Amount  <p style={{ marginLeft: 'auto', color: 'black' }}>{invoiceAmount} Rs &nbsp;</p>
              </Typography>
              <Typography className='insight__card__text' style={{ marginTop: '10px', color: 'green' }}>
                &nbsp;&nbsp;Total Payment Mode  <p style={{ marginLeft: 'auto', color: 'black' }}>{paidAmount} Rs &nbsp;</p>
              </Typography>
              <Typography className='insight__card__text'style={{ marginTop: '10px', color: 'orange' }}>
                &nbsp;&nbsp;Balance Payment  <p style={{ marginLeft: 'auto', color: 'black' }}>{balancePayment} Rs &nbsp;</p>
              </Typography>

            </CardContent>

          </Card>
        </Grid>
      </React.Fragment>
    )
  }
}
