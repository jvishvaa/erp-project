import React from 'react'
import { Paper, TablePagination } from '@material-ui/core'
import PaginationActionsWrapped from './paginationAction'

const Pagination = ({ elevation = 4, ...restProps }) => {
  let { onChangePage } = restProps
  if (typeof onChangePage !== 'function') {
    return (
      <Paper elevation={elevation} >
        <div style={{ padding: 10 }}>
          Render Pagination Failed:
          <p style={{ color: 'red' }}>onChangePage attribute must be of function expression&nbsp;
            <a href='https://v3-9-0.material-ui.com/api/table-pagination/' target='blank'>click here for ref</a>
          </p>
        </div>
      </Paper>
    )
  }
  return (
    <React.Fragment>
      <Paper elevation={elevation} >
        <TablePagination
          //  >-------------------------default attributes with user defined values
          // rowsPerPageOptions={[10, 20, 30, 50, 100]}
          // labelRowsPerPage={'Rows per page'}
          // count={190}
          // rowsPerPage={10}
          // page={0}
          // onChangePage={(e, i) => { this.props.page(i + 1) }}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
          // ----------------------------------------------------------------<
          ActionsComponent={PaginationActionsWrapped}
          labelDisplayedRows={() => 'Page'}
          colSpan={3}
          SelectProps={{
            native: true
          }}
          {...restProps}
        />
      </Paper>
    </React.Fragment>
  )
}
export default Pagination
