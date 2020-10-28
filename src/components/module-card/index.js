import React, { useState } from 'react';
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
import useStyles from './useStyles';

const columns = [
  { id: 'module_child_name', label: '', minWidth: 120 },
  { id: 'my_branch', label: 'Branch', minWidth: 80 },
  { id: 'my_grade', label: 'Grade', minWidth: 80 },
  { id: 'my_section', label: 'Section', minWidth: 80 },
  {
    id: 'custom',
    label: 'Custom',
    minWidth: 130,
    align: 'center',
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

function union(arra1, arra2) {
  if (arra1 == null || arra2 == null) return [];

  const obj = {};
  arra1.forEach((item) => {
    obj[item.id] = item;
  });

  arra2.forEach((item) => {
    obj[item.id] = item;
  });

  const res = [];

  Object.keys(obj).forEach((key) => res.push(obj[key]));

  return res;
}

function findAndApplyCustomScope(subModules, id, customScopeObj, applyUnion) {
  const clonedArray = JSON.parse(JSON.stringify(subModules));
  const index = clonedArray.findIndex((obj) => obj.module_child_id == id);
  const customBranch = clonedArray[index].custom_branch;
  const customGrade = clonedArray[index].custom_grade;
  const customSection = clonedArray[index].custom_section;
  let scopeObj = { ...customScopeObj };
  if (applyUnion) {
    scopeObj = {
      custom_branch: union(customBranch, customScopeObj.custom_branch),
      custom_grade: union(customGrade, customScopeObj.custom_grade),
      custom_section: union(customSection, customScopeObj.custom_section),
    };
  }
  clonedArray[index] = {
    ...clonedArray[index],
    ...scopeObj,
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
      const safeToUnsetValues = unCheckDependency.every((depId) => {
        const subModuleIndex = subModules.findIndex(
          (obj) => obj.module_child_id == depId
        );
        if (subModuleIndex) {
          if (!subModules[subModuleIndex][scope]) {
            return true;
          }

          return false;
        }
        return true;
      });
      if (safeToUnsetValues) {
        const { clonedArray, index } = findAndApplyScope(
          subModules,
          subModuleId,
          scope,
          checked
        );
        changedModuleIndices.push(index);
        moduleObj.module_child = clonedArray;
      } else {
        console.log('not safe to uncheck dependency');
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

  const onChangeCustomScope = (
    customScopeObj,
    subModuleId,
    dependencySubModule,
    unCheckDependency,
    scope
  ) => {
    console.log('custom scope obj ', customScopeObj);
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
          customScopeObj,
          true
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
        <Typography className={classes.cardHeader}>{module.module_parent}</Typography>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className={classes.columnHeader}
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
                    const checkAll = module.module_child.every((subModule) => {
                      if (subModule[column.id]) {
                        return true;
                      }
                      return false;
                    });
                    return (
                      <TableCell className={classes.tableCell}>
                        <Checkbox
                          onChange={(e) => {
                            onCheckAll(e.target.checked, column.id);
                          }}
                          checked={scopesObj[column.id] || checkAll}
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
