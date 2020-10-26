import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import SubModule from '../sub-module';
import { scopes } from '../../redux/actions';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const columns = [
  { id: 'module_child_name', label: '', minWidth: 120 },
  { id: 'my_branch', label: 'My Branch', minWidth: 80 },
  { id: 'my_grade', label: 'My Grade', minWidth: 80 },
  { id: 'my_section', label: 'My Section', minWidth: 80 },
  {
    id: 'custom',
    label: 'Custom',
    minWidth: 100,
    align: 'right',
  },
];

function findAndApplyScope(subModules, id, scope, checked) {
  const clonedArray = JSON.parse(JSON.stringify(subModules));
  const index = clonedArray.findIndex((obj) => obj.module_child_id == id);
  clonedArray[index] = {
    ...clonedArray[index],
    [scope]: checked,
  };
  return { clonedArray, index };
}

function findAndApplyCustomScope(subModules, id, customScopeObj) {
  const clonedArray = JSON.parse(JSON.stringify(subModules));
  const index = clonedArray.findIndex((obj) => obj.module_child_id == id);
  clonedArray[index] = {
    ...clonedArray[index],
    ...customScopeObj,
  };
  return { clonedArray, index };
}

export default function ModuleCard({
  module,
  alterCreateRolePermissions,
  branches,
  modulePermissionsRequestData,
  setModulePermissionsRequestData,
}) {
  const [scopesObj, setScopes] = useState(scopes);
  const classes = useStyles();

  const constructModulePermissionsRequestData = (reqObjArr) => {
    const data = JSON.parse(JSON.stringify(modulePermissionsRequestData));
    reqObjArr.forEach((reqObj) => {
      const index = data.findIndex((obj) => obj.modules_id == reqObj.modules_id);
      if (index !== -1) {
        data[index] = reqObj;
      } else {
        data.push(reqObj);
      }
    });
    setModulePermissionsRequestData(data);
  };

  const onCheckPermission = (
    checked,
    subModuleId,
    scope,
    dependencySubModule,
    unCheckDependency
  ) => {
    const moduleObj = JSON.parse(JSON.stringify(module));
    const subModules = module.module_child;
    const changedModuleIndices = [];
    if (checked) {
      const { clonedArray, index } = findAndApplyScope(
        subModules,
        subModuleId,
        scope,
        checked
      );

      changedModuleIndices.push(index);

      moduleObj.module_child = clonedArray;
      if (dependencySubModule) {
        const { clonedArray, index } = findAndApplyScope(
          moduleObj.module_child,
          dependencySubModule,
          scope,
          checked
        );
        changedModuleIndices.push(index);
        moduleObj.module_child = clonedArray;
      }
    } else if (unCheckDependency.length === 0) {
      const { clonedArray, index } = findAndApplyScope(
        subModules,
        subModuleId,
        scope,
        checked
      );
      changedModuleIndices.push(index);
      moduleObj.module_child = clonedArray;
    } else {
      // check if dependency is not selected
      unCheckDependency.forEach((depId) => {
        const subModuleIndex = subModules.findIndex(
          (obj) => obj.module_child_id == depId
        );
        if (subModuleIndex) {
          if (!subModules[subModuleIndex][scope]) {
            const { clonedArray, index } = findAndApplyScope(
              subModules,
              subModuleId,
              scope,
              checked
            );
            changedModuleIndices.push(index);
            moduleObj.module_child = clonedArray;
          } else {
            console.log('not safe to uncheck');
          }
        }
      });
    }

    const modulePermissions = changedModuleIndices.map((index) => {
      const changedSubModule = moduleObj.module_child[index];
      const reqObj = {
        modules_id: changedSubModule.module_child_id,
        my_branch: changedSubModule.my_branch,
        my_grade: changedSubModule.my_grade,
        my_section: changedSubModule.my_section,
        custom_grade: changedSubModule.custom_grade.map((grade) => grade.id),
        custom_section: changedSubModule.custom_section.map((section) => section.id),
        custom_branch: changedSubModule.custom_branch.map((branch) => branch.id),
      };
      return reqObj;
    });

    constructModulePermissionsRequestData(modulePermissions);
    alterCreateRolePermissions(moduleObj);
  };

  const onChangeCustomScope = (
    customScopeObj,
    subModuleId,
    dependencySubModule,
    unCheckDependency,
    scope
  ) => {
    const moduleObj = JSON.parse(JSON.stringify(module));
    const subModules = module.module_child;
    const changedModuleIndices = [];

    if (unCheckDependency.length == 0) {
      const { clonedArray, index } = findAndApplyCustomScope(
        subModules,
        subModuleId,
        customScopeObj
      );
      moduleObj.module_child = clonedArray;
      changedModuleIndices.push(index);
      if (dependencySubModule) {
        const { clonedArray, index } = findAndApplyCustomScope(
          moduleObj.module_child,
          dependencySubModule,
          customScopeObj
        );
        moduleObj.module_child = clonedArray;
        changedModuleIndices.push(index);
      }
    } else {
      const safeToUnsetValues = unCheckDependency.every((depId) => {
        const subModuleIndex = subModules.findIndex(
          (obj) => obj.module_child_id == depId
        );
        if (subModuleIndex) {
          if (
            subModules[subModuleIndex][scope] &&
            subModules[subModuleIndex][scope].length == 0
          ) {
            return true;
          }

          return false;
        }
        return true;
      });
      if (safeToUnsetValues) {
        const { clonedArray, index } = findAndApplyCustomScope(
          subModules,
          subModuleId,
          customScopeObj
        );
        moduleObj.module_child = clonedArray;
        changedModuleIndices.push(index);
      } else {
        console.log('not safe to uncheck');
      }
    }

    const modulePermissions = changedModuleIndices.map((index) => {
      const changedSubModule = moduleObj.module_child[index];
      const reqObj = {
        modules_id: changedSubModule.module_child_id,
        my_branch: changedSubModule.my_branch,
        my_grade: changedSubModule.my_grade,
        my_section: changedSubModule.my_section,
        custom_grade: changedSubModule.custom_grade.map((grade) => grade.id),
        custom_section: changedSubModule.custom_section.map((section) => section.id),
        custom_branch: changedSubModule.custom_branch.map((branch) => branch.id),
      };
      return reqObj;
    });

    constructModulePermissionsRequestData(modulePermissions);
    alterCreateRolePermissions(moduleObj);
  };

  const onCheckAll = (checked, scope) => {
    const moduleObj = JSON.parse(JSON.stringify(module));
    const modulePermissions = [];
    const subModules = module.module_child.map((obj) => {
      let reqObj = {
        modules_id: obj.module_child_id,
        my_branch: obj.my_branch,
        my_grade: obj.my_grade,
        my_section: obj.my_section,
        custom_grade: obj.custom_grade.map((grade) => grade.id),
        custom_section: obj.custom_section.map((section) => section.id),
        custom_branch: obj.custom_branch.map((branch) => branch.id),
      };
      reqObj = { ...reqObj, [scope]: checked };
      modulePermissions.push(reqObj);
      return { ...obj, [scope]: checked };
    });
    moduleObj.module_child = subModules;
    constructModulePermissionsRequestData(modulePermissions);
    alterCreateRolePermissions(moduleObj);
    setScopes((prevScope) => ({ ...prevScope, [scope]: checked }));
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant='h5' component='h2'>
          {module.module_parent}
        </Typography>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover role='checkbox' tabIndex={-1} id='select-all'>
                {columns.map((column) => {
                  if (column.id !== 'module_child_name' && column.id !== 'custom') {
                    return (
                      <TableCell>
                        <Checkbox
                          onChange={(e) => {
                            onCheckAll(e.target.checked, column.id);
                          }}
                          checked={scopesObj[column.id]}
                          color='primary'
                        />
                      </TableCell>
                    );
                  }
                  return <TableCell />;
                })}
              </TableRow>
              {module.module_child.map((subModule) => {
                return (
                  <SubModule
                    subModule={subModule}
                    columns={columns}
                    onCheckPermission={onCheckPermission}
                    onChangeCustomScope={onChangeCustomScope}
                    branches={branches}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions />
    </Card>
  );
}
