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
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import { fetchGrades, fetchSections } from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
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
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
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
      <Typography variant='h6'>{children}</Typography>
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomScopeModal = ({ open, handleClose, branches, onChange, customScope }) => {
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const classes = useStyles();

  const onCustomScopeChange = (scope, value) => {
    onChange(scope, value);
  };

  const handleChangeBranch = (values) => {
    const customScopeObj = {
      custom_branch: [values],
      custom_grade: [],
      custom_section: [],
    };
    onCustomScopeChange('custom_branch', customScopeObj);
    fetchGrades(values).then((data) => {
      setGrades(data);
    });
  };

  const handleChangeGrade = (values) => {
    const customScopeObj = {
      custom_branch: customScope.custom_branch,
      custom_grade: values,
      custom_section: [],
    };
    onCustomScopeChange('custom_grade', customScopeObj);
    fetchSections(customScope.custom_branch, values).then((data) => {
      setSections(data);
    });
  };
  const handleChangeSection = (values) => {
    const customScopeObj = {
      custom_branch: customScope.custom_branch,
      custom_grade: customScope.custom_grade,
      custom_section: values,
    };
    onCustomScopeChange('custom_section', customScopeObj);

    // setSelectedSections(values);
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
      </DialogTitle>
      <DialogContent dividers>
        <Grid container alignItems='center' direction='column'>
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id='demo-mutiple-chip-label'>Select branch</InputLabel>
              <Select
                labelId='demo-mutiple-chip-label'
                id='demo-mutiple-chip'
                value={customScope.custom_branch ? customScope.custom_branch[0] : ''}
                style={{ width: 400 }}
                input={<Input variant='outlined' />}
                onChange={(e) => {
                  handleChangeBranch(e.target.value);
                }}
                renderValue={(selected) => <>{selected.branch_name}</>}
                MenuProps={MenuProps}
              >
                {branches &&
                  branches.map((branch) => (
                    <MenuItem value={branch}>{branch.branch_name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id='demo-mutiple-chip-label'>Select Grades</InputLabel>
              <Select
                labelId='demo-mutiple-chip-label'
                id='demo-mutiple-chip'
                multiple
                value={customScope.custom_grade}
                style={{ width: 400 }}
                onChange={(e) => {
                  handleChangeGrade(e.target.value);
                }}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value.grade_id}
                        label={value.grade__grade_name}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {grades &&
                  grades.map((grade) => (
                    <MenuItem value={grade}>{grade.grade__grade_name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id='demo-mutiple-chip-label'>Select Sections</InputLabel>
              <Select
                labelId='demo-mutiple-chip-label'
                id='demo-mutiple-chip'
                multiple
                value={customScope.custom_section}
                style={{ width: 400 }}
                onChange={(e) => {
                  handleChangeSection(e.target.value);
                }}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={`${value.grade_id}-${value.section_id}`}
                        label={value.section__section_name}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {sections &&
                  sections.map((section) => (
                    <MenuItem value={section}>{section.section__section_name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomScopeModal;
