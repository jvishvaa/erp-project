
import React, { useState, useContext } from 'react';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SubModule from '../sub-module';
import { scopes } from '../../redux/actions';
import useStyles from './useStyles';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const columns = [
  { id: 'module_child_name', label: '', minWidth: 120 },
  { id: 'my_branch', label: 'Branch', minWidth: 80 },
  { id: 'my_grade', label: 'Grade', minWidth: 80 },
  { id: 'my_section', label: 'Section', minWidth: 80 },
  { id: 'my_subject', label: 'Subject', minWidth: 80 },
  {
    id: 'custom',
    label: 'Custom',
    minWidth: 130,
    align: 'center',
  },
];

// const unCheckScopeDependenciesForModules = {
//   my_branch: [],
//   my_grade: ['my_branch'],
//   my_section: ['my_branch', 'my_grade'],
//   my_subject: ['my_branch', 'my_grade', 'my_section'],
// };
const unCheckScopeDependenciesForModules = {
  my_branch: ['my_grade', 'my_section', 'my_subject'],
  my_grade: ['my_section', 'my_subject'],
  my_section: ['my_subject'],
  my_subject: [],
};

const scopeToDisplayNameMapping = {
  my_branch: 'Branch',
  my_grade: 'Grade',
  my_section: 'Section',
  my_subject: 'Subject',
};

function findAndApplyScope(subModules, id, scope, checked) {
  const clonedArray = JSON.parse(JSON.stringify(subModules));
  const index = clonedArray.findIndex((obj) => obj.module_child_id == id);
  let objToApply = {
    [scope]: checked,
  };

  switch (scope) {
    case 'my_branch':
      objToApply = {
        ...objToApply,
        my_branch: checked,
        my_grade: checked,
        my_section: checked,
        my_subject: checked,
      };
      break;
    case 'my_grade':
      objToApply = {
        ...objToApply,
        my_branch: checked,
        my_grade: checked,
        my_section: checked,
        my_subject: checked,
      };
      break;
    case 'my_section':
      objToApply = {
        ...objToApply,
        my_branch: checked,
        my_grade: checked,
        my_section: checked,
        my_subject: checked,
      };
      break;
    case 'my_subject':
      objToApply = {
        ...objToApply,
        my_branch: checked,
        my_grade: checked,
        my_section: checked,
        my_subject: checked,
      };
      break;
    default:
      break;
  }
  clonedArray[index] = {
    ...clonedArray[index],
    ...objToApply,
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
  const customYear = clonedArray[index].custom_year;
  const customBranch = clonedArray[index].custom_branch;
  const customGrade = clonedArray[index].custom_grade;
  const customSection = clonedArray[index].custom_section;
  const customSubject = clonedArray[index].custom_subject;
  let scopeObj = { ...customScopeObj };
  if (applyUnion) {
    scopeObj = {
      custom_year: union(customYear, customScopeObj.custom_year),
      custom_branch: union(customBranch, customScopeObj.custom_branch),
      custom_grade: union(customGrade, customScopeObj.custom_grade),
      custom_section: union(customSection, customScopeObj.custom_section),
      custom_subject: union(customSubject, customScopeObj.custom_subject),
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
  academicYear,
  modulePermissionsRequestData,
  setModulePermissionsRequestData,
}) {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
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

      changedModuleIndices.push(index); //changed submodules  eg Create class Edit class etc

      moduleObj.module_child = clonedArray;
      if (dependencySubModule && dependencySubModule.length > 0) {
        dependencySubModule.forEach((subModule) => {
          const { clonedArray, index } = findAndApplyScope(
            moduleObj.module_child,
            subModule,
            scope,
            checked
          );
          changedModuleIndices.push(index);
          moduleObj.module_child = clonedArray;
        });
      }
    } else if (unCheckDependency.length === 0) {
      const unCheckScopeDependencies = [];
      const currSubModule = subModules.find((obj) => obj.module_child_id === subModuleId);

      // unCheckScopeDependenciesForModules[scope].forEach((scopeName) => {
      //   if (currSubModule[scopeName] == true) {
      //     // parent scope is checked
      //     unCheckScopeDependencies.push(scopeToDisplayNameMapping[scopeName]);
      //   }
      // });

      if (unCheckScopeDependencies.length > 0) {
        setAlert(
          'error',
          `Uncheck  ${unCheckScopeDependencies.join(', ')} scope of current module first`
        );
      } else {
        const { clonedArray, index } = findAndApplyScope(
          subModules,
          subModuleId,
          scope,
          checked
        );
        changedModuleIndices.push(index);
        moduleObj.module_child = clonedArray;
      }
    } else {
      // check if dependency is not selected
      const unCheckDependencies = [];
      const unCheckScopeDependencies = [];
      const safeToUnsetValues = unCheckDependency.every((depId) => {
        //change every to for each to list all dependency module names
        const subModuleIndex = subModules.findIndex(
          (obj) => obj.module_child_id == depId
        );
        if (subModuleIndex) {
          if (!subModules[subModuleIndex][scope]) {
            return true;
          }
          unCheckDependencies.push(subModules[subModuleIndex].module_child_name);
          return false;
        }
        return true;
      });
      const currSubModule = subModules.find((obj) => obj.module_child_id === subModuleId);
 
      // unCheckScopeDependenciesForModules[scope].forEach((scopeName) => {
      //   if (currSubModule[scopeName] == true) {
      //     // parent scope is checked
      //     unCheckScopeDependencies.push(scopeToDisplayNameMapping[scopeName]);
      //   }
      // });

      if (safeToUnsetValues) {
        const { clonedArray, index } = findAndApplyScope(
          subModules,
          subModuleId,
          scope,
          checked
        );
        changedModuleIndices.push(index);
        moduleObj.module_child = clonedArray;
        if (unCheckScopeDependencies.length > 0) {
          setAlert(
            'error',
            `Uncheck  ${unCheckScopeDependencies.join(
              ', '
            )} scope of current module first`
          );
        }
      } else {
        setAlert('error', `Uncheck  ${unCheckDependencies.join(', ')} modules first`);
      }
    }

    // const modulePermissions = changedModuleIndices.map((index) => {
    //   const changedSubModule = moduleObj.module_child[index];
    //   const reqObj = {
    //     modules_id: changedSubModule.module_child_id,
    //     my_branch: changedSubModule.my_branch,
    //     my_grade: changedSubModule.my_grade,
    //     my_section: changedSubModule.my_section,
    //     my_subject: changedSubModule.my_subject,
    //     custom_grade: changedSubModule.custom_grade.map((grade) => grade.id),
    //     custom_section: changedSubModule.custom_section.map((section) => section.id),
    //     custom_branch: changedSubModule.custom_branch.map((branch) => branch.id),
    //     custom_subject: changedSubModule.custom_subject.map((subject) => subject.id),
    //   };
    //   return reqObj;
    // });
    const modulePermissions = moduleObj.module_child.map((subModule) => {
      const reqObj = {
        modules_id: subModule.module_child_id,
        my_branch: subModule.my_branch,
        my_grade: subModule.my_grade,
        my_section: subModule.my_section,
        my_subject: subModule.my_subject,
        custom_year: subModule.custom_year.map((year) => year.id),
        custom_grade: subModule.custom_grade.map((grade) => grade.id),
        custom_section: subModule.custom_section.map((section) => section.id),
        custom_branch: subModule.custom_branch.map((branch) => branch.id),
        custom_subject: subModule.custom_subject.map((subject) => subject.id),
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
    // const changedModuleIndices = [];

    const { clonedArray, index } = findAndApplyCustomScope(
      subModules,
      subModuleId,
      customScopeObj
    );
    moduleObj.module_child = clonedArray;


    // if (unCheckDependency.length == 0) {
    //   const { clonedArray, index } = findAndApplyCustomScope(
    //     subModules,
    //     subModuleId,
    //     customScopeObj
    //   );
    //   moduleObj.module_child = clonedArray;
    //   changedModuleIndices.push(index);
    //   if (dependencySubModule) {
    //     const { clonedArray, index } = findAndApplyCustomScope(
    //       moduleObj.module_child,
    //       dependencySubModule,
    //       customScopeObj,
    //       true
    //     );
    //     moduleObj.module_child = clonedArray;
    //     changedModuleIndices.push(index);
    //   }
    // } else {
    //   const unCheckDependencies = [];
    //   const safeToUnsetValues = unCheckDependency.every((depId) => {
    //     const subModuleIndex = subModules.findIndex(
    //       (obj) => obj.module_child_id == depId
    //     );
    //     if (subModuleIndex) {
    //       if (
    //         subModules[subModuleIndex][scope] &&
    //         subModules[subModuleIndex][scope].length == 0
    //       ) {
    //         return true;
    //       }
    //       unCheckDependencies.push(subModules[subModuleIndex].module_child_name);
    //       return false;
    //     }
    //     return true;
    //   });
    //   if (safeToUnsetValues) {
    //     const { clonedArray, index } = findAndApplyCustomScope(
    //       subModules,
    //       subModuleId,
    //       customScopeObj
    //     );
    //     moduleObj.module_child = clonedArray;
    //     changedModuleIndices.push(index);
    //   } else {
    //     console.log('not safe to uncheck');
    //     setAlert('error', `Uncheck  ${unCheckDependencies.join(', ')} modules first`);
    //   }
    // }

    // const modulePermissions = changedModuleIndices.map((index) => {
    //   const changedSubModule = moduleObj.module_child[index];
    //   const reqObj = {
    //     modules_id: changedSubModule.module_child_id,
    //     my_branch: changedSubModule.my_branch,
    //     my_grade: changedSubModule.my_grade,
    //     my_section: changedSubModule.my_section,
    //     custom_grade: changedSubModule.custom_grade.map((grade) => grade.id),
    //     custom_section: changedSubModule.custom_section.map((section) => section.id),
    //     custom_branch: changedSubModule.custom_branch.map((branch) => branch.id),
    //     custom_subject: changedSubModule.custom_subject.map((subject) => subject.id),
    //   };
    //   return reqObj;
    // });

    // constructModulePermissionsRequestData(modulePermissions);
    alterCreateRolePermissions(moduleObj);
  };

  const onCheckAll = (checked, scope) => {
    const moduleObj = JSON.parse(JSON.stringify(module));
    const modulePermissions = [];
    let objToApply = {
      [scope]: checked,
    };
    const subModules = module.module_child.map((obj) => {
      let reqObj = {
        modules_id: obj.module_child_id,
        my_branch: obj.my_branch,
        my_grade: obj.my_grade,
        my_section: obj.my_section,
        my_subject: obj.my_subject,
        custom_year: obj.custom_year.map((year) => year.id),
        custom_grade: obj.custom_grade.map((grade) => grade.id),
        custom_section: obj.custom_section.map((section) => section.id),
        custom_branch: obj.custom_branch.map((branch) => branch.id),
        custom_subject: obj.custom_subject.map((subject) => subject.id),
      };

      switch (scope) {
        case 'my_branch':
          objToApply = {
            ...objToApply,
            my_branch: checked,
            my_grade: checked,
            my_section: checked,
            my_subject: checked,
          };
          break;
        case 'my_grade':
          objToApply = {
            ...objToApply,
            my_branch: checked,
            my_grade: checked,
            my_section: checked,
            my_subject: checked,
          };
          break;
        case 'my_section':
          objToApply = {
            ...objToApply,
            my_branch: checked,
            my_grade: checked,
            my_section: checked,
            my_subject: checked,
          };
          break;
        case 'my_subject':
          objToApply = {
            ...objToApply,
            my_branch: checked,
            my_grade: checked,
            my_section: checked,
            my_subject: checked,
          };
          break;
        default:
          break;
      }
      reqObj = { ...reqObj, ...objToApply };
      modulePermissions.push(reqObj); // creating req obj for module permissions
      return { ...obj, ...objToApply };
    });
    moduleObj.module_child = subModules;
    constructModulePermissionsRequestData(modulePermissions);
    alterCreateRolePermissions(moduleObj);
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.cardHeader}>{module.module_parent}</Typography>

        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => {
                  if (column.id === 'module_child_name') {
                    const checkAll = module.module_child.every((subModule) => {
                      if (subModule.my_branch) {
                        return true;
                      }
                      return false;
                    });
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        className={classes.columnHeader}
                      >
                        {/* <FormControlLabel
                          control={ */}
                        <Checkbox
                          onChange={(e) => {
                            onCheckAll(e.target.checked, 'my_branch');
                          }}
                          color='primary'
                          checked={checkAll}
                        />
                        {/* }
                          title='Select All'
                        /> */}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      className={classes.columnHeader}
                    >
                      {column.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover role='checkbox' tabIndex={-1} id='select-all'>
                {columns.map((column, index) => {
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
                            // if (e.target.checked) {
                            //   onCheckAll(e.target.checked, column.id);
                            // } else {
                            //   if(allCheckedScopes.length > 0) {
                            //     unCheckScopeDependenciesForModules[column.id].forEach((scope) => {
                            //       if(allCheckedScopes.includes(scope)) {

                            //       }
                            //     })
                            //   }
                            // }
                          }}
                          checked={checkAll}
                          color='primary'
                        />
                      </TableCell>
                    );
                  }
                  if (index === 0) {
                    return <TableCell>Select All</TableCell>;
                  }
                  return <TableCell />;
                })}
              </TableRow>
              {module.module_child.map((subModule) => {
                return (
                  <SubModule
                    subModule={subModule}
                    columns={columns}
                    academicYear={academicYear}
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
