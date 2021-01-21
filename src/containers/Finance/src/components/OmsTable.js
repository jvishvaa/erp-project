import React from 'react'
import { Table } from 'semantic-ui-react'
import './css/staff.css'

const TableExamplePositiveNegative = (props) => (

  <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Notes</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell className='cell_width'>No Name Specified</Table.Cell>
        <Table.Cell className='cell_width'>Unknown</Table.Cell>
        <Table.Cell className='cell_width' negative>None</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

export default TableExamplePositiveNegative
