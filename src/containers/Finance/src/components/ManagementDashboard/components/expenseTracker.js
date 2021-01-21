import React from 'react'
import { Grid, CardContent, CardHeader, Card } from '@material-ui/core'
import LineGraph from '../../../ui/BarGraph/lineGraph'
import '../styles/dashbord.css'
import { OmsSelect } from '../../../ui'

export default class ExpenseTracker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      default: { label: 'Monthly', value: '1' }
    }
  }

  handleExpenseType=(e) => {
    this.setState({ default: e })
    this.props.toggleValues(e)
  }
  render () {
    const { plottedValues, dataTypeValues, totalInvoiceAmount } = this.props
    console.log(this.state.type)
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6} md={6} className='graphs__dashbord'>
          <Card style={{ borderRadius: '20px', backgroundColor: 'cornsilk', border: '2px solid cornsilk' }}>
            <CardHeader
              title={<p style={{ color: '#5d1049', borderBottomStyle: 'solid', width: '95px', marginLeft: '12px', borderColor: 'lightgrey', display: 'contents', 'font-weight': '500', 'font-family': 'sans-serif' }}>Expense Tracker</p>}
              action={<p style={{ fontFamily: 'serif', marginTop: '10px', 'font-size': 'medium', color: '#5d1049' }}>{totalInvoiceAmount} Rs</p>

              }
            />
            <div className='expense_tracker_bar' style={{ width: '25%', marginLeft: '75%' }}>
              <OmsSelect
                style={{ 'margin-top': '16px', width: '20px' }}
                placeholder='Select'
                options={
                  dataTypeValues
                    ? dataTypeValues.map(val => ({
                      value: val.value,
                      label: val.label
                    })) : []
                }
                change={this.handleExpenseType}
                defaultValue={this.state.default}

              />
            </div>

            <CardContent>
              <LineGraph properties={{ ...plottedValues }} />

            </CardContent>
          </Card>
        </Grid>

      </React.Fragment>
    )
  }
}
