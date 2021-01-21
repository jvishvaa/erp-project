import React from 'react'
import { Grid, CardContent, CardHeader, Card } from '@material-ui/core'
import GSelect from '../../../_components/globalselector'
import { COMBINATIONS } from '../utils/config'
import { OmsSelect } from '../../../ui'
import '../styles/dashbord.css'
import BarGraph from '../../../ui/BarGraph/BarGraph'

export default class BranchExpenseTracker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleExpenseType=(e) => {
    this.props.toggleValues(e)
  }
  onChange=(data) => {
    let { selectorData } = this.state
    console.log(data, selectorData)
    this.props.handleSelectorData(data)
  }
  render () {
    const { plottedValues, dataTypeValues, gKey } = this.props
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6} md={6} className='graphs__dashbord'>
          <Card style={{ borderRadius: '20px', backgroundColor: 'aliceblue', border: '2px solid aliceblue' }}>
            <CardHeader
              title={<p style={{ color: '#5d1049', borderBottomStyle: 'solid', width: '95px', marginLeft: '12px', borderColor: 'lightgrey', display: 'contents', 'font-weight': '500', 'font-family': 'sans-serif' }}>Branch Expense</p>}

            />
            <div className='expense_bar' style={{ width: '25%', display: 'flex', marginLeft: '50%' }}>

              <OmsSelect
                style={{ 'margin-top': '16px', width: '20px' }}
                label='Type'
                placeholder='Select'
                options={
                  dataTypeValues &&
                  dataTypeValues.map(val => ({
                    value: val.value,
                    label: val.label
                  }))
                }
                change={this.handleExpenseType}
              />

              <GSelect key={gKey} style={{ paddingLeft: '10px' }}className='labels' config={COMBINATIONS} variant={'selector'} onChange={this.onChange} />

            </div>

            <CardContent>
              <BarGraph properties={{ ...plottedValues }} />

            </CardContent>
          </Card>
        </Grid>

      </React.Fragment>
    )
  }
}
