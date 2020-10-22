/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './custom-selection-table.css';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 100 },
//   { field: 'firstName', headerName: 'First name', width: 200 },
//   { field: 'lastName', headerName: 'Last name', width: 200 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 100,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 250,
//     valueGetter: (params) =>
//       `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

export default function CustomSelectionTable(props) {
  const {
    header,
    rows,
    totalRows,
    changePage,
    setSelectedUsers,
    completeData,
    selectedUsers,
  } = props || {};
  const rowSelection = (e) => {
    if (e.rows.length !== selectedUsers.length && e.rows.length) {
      const usersId = [];
      e.rows.map((items) => usersId.push(items.id));
      setSelectedUsers(usersId);
    }
  };
  const pageChange = (e) => {
    changePage(e.page);
  };
  const data = {
    rows: [...rows],
    columns: [...header],
  };

  let apiRef = React.useRef(null);

  React.useEffect(() => {
    apiRef.current && apiRef.current.setRowModels(completeData);
  }, [data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        pageSize={5}
        rowCount={totalRows}
        checkboxSelection
        onSelectionChange={rowSelection}
        onPageChange={pageChange}
        paginationMode='server'
        ref={(input) => (apiRef = input)}
        {...data}
        onRowSelected={() => {
          console.log('onRowSelected');
        }}
        selectRows={() => {
          console.log('selectRows');
        }}
        components={{
          noRowsOverlay: (params) => {
            if (!apiRef.current) {
              apiRef.current = params.api.current;
            }
            return <div>No rows</div>;
          },
        }}
      />
    </div>
  );
}
