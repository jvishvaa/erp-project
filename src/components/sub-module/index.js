import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';

import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import CustomScopeModal from '../custom-scope-modal';

const SubModule = ({
  subModule,
  columns,
  onCheckPermission,
  branches,
  onChangeCustomScope,
}) => {
  const [modalOpen, setModalState] = useState(false);

  const handleModalStateChange = (e) => {
    if (e.target.checked) {
      setModalState(true);
    } else {
      setModalState(false);
    }
  };

  const handleCloseModal = () => {
    setModalState(false);
  };
  return (
    <TableRow hover role='checkbox' tabIndex={-1} key={subModule.module_child_id}>
      {columns.map((column) => {
        const value = subModule[column.id];
        if (column.id === 'module_child_name') {
          return (
            <TableCell key={column.id} align={column.align}>
              {value}
            </TableCell>
          );
        }
        if (column.id === 'custom') {
          return (
            <TableCell key={column.id} align={column.align}>
              <Switch
                checked={modalOpen}
                onChange={handleModalStateChange}
                name='custom-popup-trigger'
                inputProps={{ 'aria-label': 'custom-popup-trigger' }}
              />
            </TableCell>
          );
        }
        return (
          <TableCell key={column.id} align={column.align}>
            <Checkbox
              onChange={(e) => {
                onCheckPermission(
                  e.target.checked,
                  subModule.module_child_id,
                  column.id,
                  subModule.dependency_sub_module,
                  subModule.uncheck_dependency
                );
              }}
              checked={subModule[column.id]}
              color='primary'
            />
          </TableCell>
        );
      })}
      <CustomScopeModal
        open={modalOpen}
        handleClose={handleCloseModal}
        branches={branches}
        onChange={(scope, value) => {
          onChangeCustomScope(
            value,
            subModule.module_child_id,
            subModule.dependency_sub_module,
            subModule.uncheck_dependency,
            scope
          );
        }}
        customScope={{
          custom_branch: subModule.custom_branch,
          custom_grade: subModule.custom_grade,
          custom_section: subModule.custom_section,
        }}
      />
    </TableRow>
  );
};

export default SubModule;
