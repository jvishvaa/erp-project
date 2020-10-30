/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './custom-selection-table.css';

export default function CustomSelectionTable(props) {
  const {
    header,
    rows,
    totalRows,
    changePage,
    setSelectedUsers,
    completeData,
    selectedUsers,
    pageno,
  } = props || {};
  const selectRow = (e) => {
    if (
      selectedUsers.length &&
      !e.isSelected &&
      selectedUsers[pageno - 1].selected.includes(e.data.id)
    ) {
      let tempSelection = [];
      tempSelection = selectedUsers;
      tempSelection[pageno - 1].selected.splice(
        tempSelection[pageno - 1].selected.indexOf(e.data.id),
        1
      );
      setSelectedUsers(tempSelection);
      console.log(tempSelection);
    }
    if (selectedUsers.length && e.isSelected) {
      let tempSelection = [];
      tempSelection = selectedUsers;
      tempSelection[pageno - 1].selected.push(e.data.id);
      console.log(tempSelection);
      setSelectedUsers(tempSelection);
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
    <div
      className='custom_selection_table_wrapper'
      style={{ height: 400, width: '100%' }}
    >
      <DataGrid
        pageSize={5}
        rowCount={totalRows}
        checkboxSelection
        onPageChange={pageChange}
        paginationMode='server'
        ref={(input) => (apiRef = input)}
        {...data}
        onRowSelected={selectRow}
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
