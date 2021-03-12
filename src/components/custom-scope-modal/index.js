import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import {
  fetchBranchesForCreateUser as getBranches,
  fetchGrades as getGrades,
  fetchSections as getSections,
  fetchSubjects as getSubjects,
} from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  subTitle: {
    fontSize: '1rem',
    textAlign: 'center',
    position: 'relative',
    '&:before': {
      position: 'absolute',
      top: '51%',
      overflow: 'hidden',
      width: '50%',
      height: '1px',
      content: '""',
      backgroundColor: '#ccc',
      marginLeft: '-51%',
    },
    '&:after': {
      position: 'absolute',
      top: '51%',
      overflow: 'hidden',
      width: '50%',
      height: '1px',
      content: '""',
      backgroundColor: '#ccc',
      marginLeft: '1%',
    },
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  actionButtonContainer: {
    justifyContent: 'center',
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    color: theme.palette.secondary.main,
  },
  title: {
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6' className={classes.title}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
          <CloseIcon color='primary' />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(5),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const CustomScopeModal = ({
  open,
  handleClose,
  // branches,
  academicYear,
  onChange,
  customScope,
  subModule,
}) => {
  // const [academicYear, setAcademicYear] = useState('');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const classes = useStyles();

  const onCustomScopeChange = (scope, value) => {
    console.log('custon scope before passing ', scope, value);
    onChange(scope, value);
  };

  const onResetInputs = () => {
    const customScopeObj = {
      custom_year: [],
      custom_branch: [],
      custom_grade: [],
      custom_section: [],
      custom_subject: [],
    };
    onCustomScopeChange('', customScopeObj);
  };

  const fetchBranches = (acadId) => {
    setBranches([]);
    setGrades([]);
    setSections([]);
    setSubjects([]);
    if (acadId > 0) {
      getBranches(acadId).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
          // branch_code: obj.branch_code,
        }));
        setBranches(transformedData);
      });
    }
  };

  const fetchGrades = (acadId, branches) => {
    setGrades([]);
    setSections([]);
    setSubjects([]);
    getGrades(acadId, branches).then((data) => {
      const transformedData = data
        ? data.map((grade) => ({
            item_id: grade.id,
            id: grade.grade_id,
            grade_name: grade.grade__grade_name,
          }))
        : [];
      setGrades(transformedData);
    });
  };

  const fetchSections = (acadId, grades, setFilteredResults) => {
    setSections([]);
    setSubjects([]);
    const customScopeObj = {
      custom_year: customScope.custom_year,
      custom_branch: customScope.custom_branch,
      custom_grade: [...grades],
      custom_section: customScope.custom_section,
      custom_subject: customScope.custom_subject,
    };
    getSections(acadId, customScope.custom_branch, grades).then((data) => {
      const transformedData = data
        ? data.map((section) => ({
            item_id: section.id,
            id: section.section_id,
            section_name: `${section.section__section_name}`,
          }))
        : [];

      setSections(transformedData);

      // if (setFilteredResults) {
      //   const filteredSelectedSections = customScopeObj.custom_section.filter(
      //     (section) => transformedData.findIndex((sec) => sec.id === section.id) > -1
      //   );
      //   customScopeObj.custom_section = filteredSelectedSections;
      //   if (filteredSelectedSections && filteredSelectedSections.length > 0) {
      //     fetchSubjects(
      //       customScope.custom_year[0]?.id,
      //       customScope.custom_branch,
      //       grades,
      //       customScopeObj,
      //       setFilteredResults
      //     );
      //   } else {
      //     customScopeObj.custom_subject = [];
      //     onCustomScopeChange('custom_section', customScopeObj);
      //   }
      // }
    });
  };

  const fetchSubjects = (
    acadId,
    branches,
    grades,
    customScopeObj,
    setFilteredResults
  ) => {
    setSubjects([]);
    const customScopeObject = JSON.parse(JSON.stringify(customScopeObj));
    if (branches && branches.length > 0 && grades && grades.length > 0) {
      getSubjects(acadId, branches, grades, customScopeObj.custom_section).then(
        (data) => {
          const transformedData = data
            ? data.map((subject) => ({
                id: subject.subject__id,
                subject_name: `${subject.subject__subject_name}`,
              }))
            : [];
          setSubjects(transformedData);
          // if (setFilteredResults) {
          //   const filteredSelectedSubjects = customScopeObject.custom_subject.filter(
          //     (subject) => transformedData.findIndex((sub) => sub.id == subject.id) > -1
          //   );
          //   customScopeObject.custom_subject = filteredSelectedSubjects;
          //   onCustomScopeChange('custom_subject', customScopeObject);
          // }
        }
      );
    } else {
      customScopeObject.custom_subject = [];
      onCustomScopeChange('custom_subject', customScopeObject);
    }
  };

  const handleChangeYear = (value) => {
    const customScopeObj = {
      custom_year: [...value],
      custom_branch: [],
      custom_grade: [],
      custom_section: [],
      custom_subject: [],
    };
    onCustomScopeChange('custom_year', customScopeObj);
    if (value && value.length > 0) {
      fetchBranches(value[0]?.id);
    } else {
      customScopeObj.custom_branch = [];
      customScopeObj.custom_grade = [];
      customScopeObj.custom_section = [];
      customScopeObj.custom_subject = [];
      onCustomScopeChange('custom_branch', customScopeObj);
    }
  };

  const handleChangeBranch = (values) => {
    const customScopeObj = {
      custom_year: customScope.custom_year,
      custom_branch: values,
      custom_grade: customScope.custom_grade,
      custom_section: customScope.custom_section,
      custom_subject: customScope.custom_subject,
    };
    onCustomScopeChange('custom_branch', customScopeObj);
    if (values && values.length > 0) {
      fetchGrades(customScope.custom_year[0]?.id, values);
    } else {
      customScopeObj.custom_grade = [];
      customScopeObj.custom_section = [];
      customScopeObj.custom_subject = [];
      onCustomScopeChange('custom_grade', customScopeObj);
    }
  };

  const handleChangeGrade = (values) => {
    const customScopeObj = {
      custom_year: customScope.custom_year,
      custom_branch: customScope.custom_branch,
      custom_grade: values,
      custom_section: customScope.custom_section,
      custom_subject: customScope.custom_subject,
    };
    onCustomScopeChange('custom_grade', customScopeObj);
    if (customScope.custom_branch.length > 0 && values && values.length > 0) {
      fetchSections(customScope.custom_year[0]?.id, values, true);
    } else {
      customScopeObj.custom_section = [];
      customScopeObj.custom_subject = [];
      onCustomScopeChange('custom_section', customScopeObj);
    }
  };

  const handleChangeSection = (values) => {
    const customScopeObj = {
      custom_year: customScope.custom_year,
      custom_branch: customScope.custom_branch,
      custom_grade: customScope.custom_grade,
      custom_section: values,
      custom_subject: customScope.custom_subject,
    };
    fetchSubjects(
      customScope.custom_year[0]?.id,
      customScope.custom_branch,
      customScope.custom_grade,
      customScopeObj,
      true
    );
    onCustomScopeChange('custom_section', customScopeObj);
  };

  const handleChangeSubject = (values) => {
    const customScopeObj = {
      custom_year: customScope.custom_year,
      custom_branch: customScope.custom_branch,
      custom_grade: customScope.custom_grade,
      custom_section: customScope.custom_section,
      custom_subject: values,
    };
    onCustomScopeChange('custom_section', customScopeObj);
  };

  useEffect(() => {
    if (open) {
      if (customScope.custom_year && customScope.custom_year.length > 0) {
        fetchBranches(customScope.custom_year[0]?.id);
        if (customScope.custom_branch && customScope.custom_branch.length > 0) {
          fetchGrades(customScope.custom_year[0]?.id, customScope.custom_branch);
          if (customScope.custom_grade && customScope.custom_grade.length > 0) {
            fetchSections(
              customScope.custom_year[0]?.id,
              customScope.custom_grade,
              false
            ); // not neccessary to filter out selcted data based on response list
          }
        }
      }
    }
  }, [open]);

  // useEffect(() => {
  //   if(customScope.custom_branch?.length > 0 && customScope.custom_grade.length > 0 && customScope.custom_section?.length > 0) {
  //     fetchSubjects()
  //   }

  // }, [customScope.custom_branch, customScope.custom_grade, customScope.custom_section])

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='customized-dialog-title'
      open={open}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle id='customized-dialog-title' onClose={handleClose}>
        Custom Scope
        <p className={classes.subTitle}>{subModule}</p>
      </DialogTitle>
      <Grid container sm={12} justify='flex-end' mx={5}>
        <Grid item>
          <Box px={5}>
            <Button className='disabled-btn' onClick={onResetInputs}>
              CLEAR ALL
            </Button>
          </Box>
        </Grid>
      </Grid>
      <DialogContent>
        <Grid container alignItems='center' direction='column'>
          <Grid item sm={12}>
            <FormControl className={classes.formControl} disabled>
              <Autocomplete
                options={academicYear || []}
                style={{ width: 400 }}
                value={customScope.custom_year[0] || ''}
                getOptionLabel={(option) => option?.session_year || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Academic Year'
                  />
                )}
                onChange={(e, value) => {
                  handleChangeYear([value]);
                }}
                getOptionSelected={(option, value) => value && option.id == value.id}
              />
            </FormControl>
          </Grid>
          <Grid item sm={12}>
            <FormControl className={classes.formControl} disabled>
              <Autocomplete
                multiple
                limitTags={2}
                options={branches || []}
                style={{ width: 400 }}
                value={customScope.custom_branch || ''}
                getOptionLabel={(option) => option.branch_name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branches'
                    placeholder='Branches'
                  />
                )}
                onChange={(e, value) => {
                  const filteredValues = value.filter((value) => value);

                  handleChangeBranch(filteredValues);
                }}
                getOptionSelected={(option, value) => value && option.id == value.id}
              />
            </FormControl>
          </Grid>
          {/* <Grid item sm={12}>
            <FormControl className={classes.formControl} disabled>
              <Autocomplete
                multiple
                options={branches}
                style={{ width: 400 }}
                value={customScope.custom_branch[0]}
                getOptionLabel={(option) => option.branch_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branches'
                    placeholder='Branches'
                  />
                )}
                onChange={(e, value) => {
                  const transformedValue = value
                    ? [{ id: value.id, branch_name: value.branch_name }]
                    : [];

                  handleChangeBranch(transformedValue);
                }}
                getOptionSelected={(option, value) => value && option.id == value.id}
              />
            </FormControl>
          </Grid> */}
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <Autocomplete
                multiple
                limitTags={2}
                id='multiple-limit-tags'
                options={grades || []}
                style={{ width: 400 }}
                value={customScope.custom_grade || ''}
                getOptionLabel={(option) => option.grade_name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grades'
                    placeholder='grades'
                  />
                )}
                onChange={(e, value) => {
                  const filteredValues = value.filter((value) => value);
                  handleChangeGrade(filteredValues);
                }}
                getOptionSelected={(option, value) => option.item_id == value.item_id}
              />
            </FormControl>
          </Grid>
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <Autocomplete
                multiple
                limitTags={2}
                id='multiple-limit-tags'
                options={sections || []}
                style={{ width: 400 }}
                value={customScope.custom_section || ''}
                getOptionLabel={(option) => option.section_name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Sections'
                    placeholder='Sections'
                  />
                )}
                onChange={(e, value) => {
                  const filteredValues = value.filter((value) => value);

                  handleChangeSection(filteredValues);
                }}
                getOptionSelected={(option, value) => option.item_id == value.item_id}
              />
            </FormControl>
          </Grid>
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <Autocomplete
                multiple
                limitTags={2}
                id='multiple-limit-tags'
                options={subjects || []}
                style={{ width: 400 }}
                value={customScope.custom_subject || ''}
                getOptionLabel={(option) => option.subject_name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Subjects'
                    placeholder='Subjects'
                  />
                )}
                onChange={(e, value) => {
                  const filteredValues = value.filter((value) => value);

                  handleChangeSubject(filteredValues);
                }}
                getOptionSelected={(option, value) => option.id == value.id}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actionButtonContainer}>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomScopeModal;
