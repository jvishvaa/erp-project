/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './custom-selection-table.css';

export default function CustomSelectionTable({ pageSize, ...props }) {
  const {
    header,
    rows,
    totalRows,
    changePage,
    setSelectedUsers,
    completeData,
    selectedUsers,
    pageno,
    setSelectAll,
    name,
  } = props || {};

  React.useEffect(() => {
    console.log('=== completeData: ', completeData)
    console.log('=== selectedUsers: ', selectedUsers)
    //apiRef.current && apiRef.current.setRowModels(completeData);
  }, [completeData, selectedUsers]);
  const selectRow = (e) => {
    console.log('=== on Select: ', e)
    if (name !== 'assign_role') {
      setSelectAll(false);
    }
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
    }
    if (selectedUsers.length && e.isSelected) {
      let tempSelection = [];
      tempSelection = selectedUsers;
      tempSelection[pageno - 1].selected.push(e.data.id);
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



  return (
    <div
      className={`custom_selection_table_wrapper ${
        completeData.length > 5
          ? 'long_height_custom_selection_table_wrapper'
          : 'short_height_custom_selection_table_wrapper'
      }`}
      style={{
        width: '100%',
        margin: 'auto',
        background: '#ffffff',
      }}
    >
      <DataGrid
        pageSize={pageSize || 15}
        rowCount={totalRows}
        checkboxSelection
        onPageChange={pageChange}
        hideFooterSelectedRowCount
        hideFooterRowCount
        paginationMode='server'
        ref={(input) => (apiRef = input)}
        {...data}
        onRowSelected={selectRow}
        // selectRows={() => {
        //   console.log('selectRows ????');
        // }}
        onSelectionChange={(newSelection) => {
          // setSelection(newSelection.rows);
          console.log('=== on selction Change: ', newSelection)
        }}
        // selectionModel={['8']}
        // onSelectionModelChange={(e) => {
        //   console.log('selected with default: ', e)
        //   const selectedIDs = new Set(e.selectionModel);
        //   const selectedRowData = rows.filter((r) =>
        //     selectedIDs.has(r.id.toString())
        //   );
        //   console.log(selectedRowData);
        // }}
        components={{
          noRowsOverlay: (params) => {
            if (!apiRef.current) {
              apiRef.current = params.api.current;
            }
            return <div className='selection_table_no_rows'>No rows</div>;
          },
        }}
      />
    </div>
  );
}
