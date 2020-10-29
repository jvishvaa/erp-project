import React, { useState } from 'react';
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
import { fetchGrades, fetchSections } from '../../redux/actions';

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
  branches,
  onChange,
  customScope,
  subModule,
}) => {
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const classes = useStyles();

  const onCustomScopeChange = (scope, value) => {
    onChange(scope, value);
  };

  const handleChangeBranch = (values) => {
    const customScopeObj = {
      custom_branch: [...values],
      custom_grade: [],
      custom_section: [],
    };
    onCustomScopeChange('custom_branch', customScopeObj);
    setGrades([]);
    setSections([]);

    fetchGrades(values).then((data) => {
      const transformedData = data
        ? data.map((grade) => ({
            id: grade.grade_id,
            grade_name: grade.grade__grade_name,
          }))
        : [];
      setGrades(transformedData);
    });
  };

  const handleChangeGrade = (values) => {
    const customScopeObj = {
      custom_branch: customScope.custom_branch,
      custom_grade: values,
      custom_section: [],
    };
    onCustomScopeChange('custom_grade', customScopeObj);
    setSections([]);

    fetchSections(customScope.custom_branch, values).then((data) => {
      const transformedData = data
        ? data.map((section) => ({
            id: section.section_id,
            section_name: `${section.grade__grade_name}__${section.section__section_name}`,
          }))
        : [];
      setSections(transformedData);
    });
  };
  const handleChangeSection = (values) => {
    const customScopeObj = {
      custom_branch: customScope.custom_branch,
      custom_grade: customScope.custom_grade,
      custom_section: values,
    };
    onCustomScopeChange('custom_section', customScopeObj);
  };

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
      <DialogContent>
        <Grid container alignItems='center' direction='column'>
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <Autocomplete
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
          </Grid>
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <Autocomplete
                multiple
                limitTags={2}
                id='multiple-limit-tags'
                options={grades}
                style={{ width: 400 }}
                value={customScope.custom_grade}
                getOptionLabel={(option) => option.grade_name}
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
                getOptionSelected={(option, value) => option.id == value.id}
              />
            </FormControl>
          </Grid>
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <Autocomplete
                multiple
                limitTags={2}
                id='multiple-limit-tags'
                options={sections}
                style={{ width: 400 }}
                value={customScope.custom_section}
                getOptionLabel={(option) => option.section_name}
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
                getOptionSelected={(option, value) => option.id == value.id}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actionButtonContainer}>
        <Button autoFocus onClick={handleClose}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomScopeModal;
