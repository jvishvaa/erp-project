/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './custom-selection-table.css';
import {makeStyles} from '@material-ui/core';

const useStyles=makeStyles((theme)=>({
  customSelectionTableWrapper : theme.customSelectionWrapper
}))
export default function CustomSelectionTable({ pageSize, ...props }) {
  const classes = useStyles()
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
    //apiRef.current && apiRef.current.setRowModels(completeData);
  }, [completeData, selectedUsers]);
  const selectRow = (e) => {
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
      if(tempSelection.length === totalRows){
        setSelectAll(true);
      }
    }
  };

  const selectRowLevel = (e) => {
    if (name !== 'assign_level') {
      setSelectAll(false);
    }
    if (
      selectedUsers.length &&
      !e.isSelected &&
      selectedUsers[pageno - 1].selected.includes(e.data.userid)
    ) {
      let tempSelection = [];
      tempSelection = selectedUsers;
      tempSelection[pageno - 1].selected.splice(
        tempSelection[pageno - 1].selected.indexOf(e.data.userid),
        1
      );
      setSelectedUsers(tempSelection);
    }
    if (selectedUsers.length && e.isSelected) {
      let tempSelection = [];
      tempSelection = selectedUsers;
      tempSelection[pageno - 1].selected.push(e.data.userid);
      setSelectedUsers(tempSelection);
      if(tempSelection.length === totalRows){
        setSelectAll(true);
      }
    }
  };

  const selectmodule = (e) => {
    if(name === 'assign_level'){
      selectRowLevel(e)
    } else {
      selectRow(e)
    }
  }
  const pageChange = (e) => {
    changePage(e.page + 1);
  };
  const data = {
    rows: [...rows],
    columns: [...header],
  };

  let apiRef = React.useRef(null);

  return (
    <div
      className={` ${classes.customTableSelectionWrapper} ${
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
        // onPageChange={(e) => changePage(e, e.page)}
        onPageChange={pageChange}
        hideFooterSelectedRowCount
        hideFooterRowCount
        paginationMode='server'
        ref={(input) => (apiRef = input)}
        {...data}
        onRowSelected={selectmodule}
        // selectRows={() => {
        //   console.log('selectRows ????');
        // }}
        onSelectionChange={(newSelection) => {
          // setSelection(newSelection.rows);
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