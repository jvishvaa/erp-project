/* eslint-disable react/no-array-index-key */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import Collapse from '@material-ui/core/Collapse';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import './expand-rows.css';

const ExpandRows = (props) => {
  const { row, subrows } = props || {};
  const [expandRow, setExpandRow] = useState(false);
  return (
    <>
      <TableRow onClick={() => setExpandRow(!expandRow)} key={row.id}>
        <TableCell>
          <Button>Extend / Collapse</Button>
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell align='right'>{row.calories}</TableCell>
        <TableCell align='right'>{row.fat}</TableCell>
        <TableCell align='right'>{row.carbs}</TableCell>
        <TableCell align='right'>{row.protein}</TableCell>
      </TableRow>
      <TableCell padding='none' colSpan={12}>
        <Collapse
          in={expandRow}
          component='table'
          style={{ display: 'block', width: '100%' }}
        >
          <thead style={{ width: '100%' }}>
            <tr>
              <th className='sms_credit_table_header'>Branch</th>
              <th className='sms_credit_table_header'>Available SMS Credit</th>
              <th className='sms_credit_table_header'>Used SMS Credit</th>
              <th className='sms_credit_table_header'>Amount to be Added</th>
              <th className='sms_credit_table_header'>Add SMS Credit</th>
            </tr>
          </thead>
        </Collapse>
      </TableCell>
    </>
  );
};

export default ExpandRows;
