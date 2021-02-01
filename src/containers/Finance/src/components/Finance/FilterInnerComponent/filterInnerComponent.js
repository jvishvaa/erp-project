import React from 'react'
import TextField from '@material-ui/core/TextField'

export class FilterInnerComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      filterValue: ''
    }
  }

  changeFilterValue (event) {
    const filterValue = event.target.value
    const newState = {
      ...this.state,
      filterValue
    }
    // Update local state
    this.setState(newState)
    // Fire the callback to alert React-Table of the new filter
    this.props.onChange(newState)
  }

  render () {
    return (
      <div className='filter'>
        <TextField
          onChange={evt => this.changeFilterValue(evt)}
          style={{
            width: '100%',
            height: '40px',
            float: 'left',
            fontSize: '12px'
          }}
          value={this.state.filterValue}
        />
      </div>
    )
  }
}

export function filterMethod (filter, row) {
  // Pivoted rows won't contain the column.
  //  If that's the case, we set the to true (allowing us to only filter on the current column)
  const rowValue = row[filter.id]
  if (!rowValue) {
    return true
  }

  const filterValue = filter.value.filterValue || ''
  if (filterValue === '') {
    return true
  }
  if (rowValue) {
    return rowValue.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
  }
}
