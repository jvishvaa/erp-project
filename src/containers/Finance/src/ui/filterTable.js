// import FilterableTable from 'react-filterable-table'
import ReactTable from 'react-table'

const React = require('react')

class OMSFilterTable extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.props = props
  }

  render () {
    return (
      <ReactTable
        showPageSizeOptions={false}
        defaultPageSize={5}
        columns={this.props.tableFields.map((field, index) => ({
          id: index,
          accessor: field.name,
          Header: field.displayName,
          minWidth: 180
        }))}
        data={this.props.tableData ? this.props.tableData : []}
        loading={this.props.loading}
      />
    )
  }
}

export default OMSFilterTable
