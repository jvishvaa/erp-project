import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';

import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import AddCircle from '@material-ui/icons/AddCircleOutline';
import CustomScopeModal from '../custom-scope-modal';
import useStyles from './useStyles';

const SubModule = ({
  subModule,
  columns,
  onCheckPermission,
  branches,
  onChangeCustomScope,
}) => {
  const [modalOpen, setModalState] = useState(false);
  const classes = useStyles();

  const handleOpenModal = () => {
    setModalState(true);
  };

  const handleCloseModal = () => {
    setModalState(false);
  };

  const customScopeApplied =
    subModule.custom_branch.length > 0 ||
    subModule.custom_grade.length > 0 ||
    subModule.custom_section.length > 0 ||
    subModule.custom_subject.length > 0;
  return (
    <TableRow hover role='checkbox' tabIndex={-1} key={subModule.module_child_id}>
      {columns.map((column) => {
        const value = subModule[column.id];
        if (column.id === 'module_child_name') {
          return (
            <TableCell className={classes.tableCell} key={column.id} align={column.align}>
              {value}
            </TableCell>
          );
        }
        if (column.id === 'custom') {
          return (
            <TableCell
              className={classes.tableCell}
              key={column.id}
              align={column.align}
              colSpan={5}
            >
              <Switch
                size='small'
                checked={customScopeApplied}
                name='custom-popup-trigger'
                inputProps={{ 'aria-label': 'custom-popup-trigger' }}
                color='primary'
                title={
                  customScopeApplied ? 'Custom scope applied' : 'No custom scope applied'
                }
              />
              <IconButton onClick={handleOpenModal} title='Add/Edit custom scope'>
                {customScopeApplied ? (
                  <EditIcon color='primary' />
                ) : (
                  <AddCircle color='primary' />
                )}
              </IconButton>
            </TableCell>
          );
        }
        return (
          <TableCell className={classes.tableCell} key={column.id} align={column.align}>
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
          custom_subject: subModule.custom_subject,
        }}
        subModule={subModule.module_child_name}
      />
    </TableRow>
  );
};

export default SubModule;
