import React from 'react';
import {
  Typography,
  makeStyles,
  Button,
  withStyles,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiAccordion from '@material-ui/core/Accordion';
import FilterFilledIcon from '../icon/FilterFilledIcon';
import ClearIcon from '../icon/ClearIcon';
import RightArrow from '../icon/RightArrow';
import LeftArrow from '../icon/LeftArrow';
import AcademicYear from '../icon/AcademicYear';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';

import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

const useStyles = makeStyles((theme)=>({
  root: {
    backgroundColor: '#F9F9F9',
    padding: '15px 60px 15px 15px',
  },
  categoryFilterContainer: {
    marginBottom: '10px',
  },
  filterIcon: {
    fill: '#FFFFFF',
  },
  wrapper: {
    display: 'flex',
    height: '223px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '22px',
  },
  accordion: {
    display: 'flex',
  },
  academicYear: {
    fontSize: '120px',
    height: '166px',
  },
  item: {
    display: 'none',
  },
  item1: {
    display: 'flex',
    height: '223px',
    width: '80px',
    padding: '15px 25px',
    backgroundColor: '#FEF5F5',
    borderRadius: '10px 10px 10px 10px',
    alignItems: 'center',
    cursor: 'pointer',
  },
  item2: {
    display: 'flex',
    height: '223px',
    width: '80px',
    padding: '15px 25px',
    backgroundColor: '#FFE5E5',
    borderRadius: '10px 10px 10px 10px',
    alignItems: 'center',
    cursor: 'pointer',
  },
  item3: {
    display: 'flex',
    height: '223px',
    width: '80px',
    padding: '15px 25px',
    backgroundColor: '#FFEFEF',
    borderRadius: '10px 10px 10px 10px',
    alignItems: 'center',
    cursor: 'pointer',
  },
  item4: {
    display: 'flex',
    height: '223px',
    width: '80px',
    padding: '20px',
    backgroundColor: '#FEF5F5',
    borderRadius: '10px 10px 10px 10px',
    alignItems: 'center',
    cursor: 'pointer',
  },
  title: {
    display: 'inline-block',
    width: '183px',
    color: theme.palette.secondary.main,
    fontSize: '20px',
    fontWeight: 300,
    fontFamily: 'Raleway',
    transform: 'rotate(-90deg)',
    lineHeight: '24px',
    marginTop: 'auto',
    marginBottom: '10px',
  },
  contentTitle: {
    color: theme.palette.secondary.main,
    fontSize: '20px',
    fontWeight: 400,
    fontFamily: 'Raleway',
  },
  content: {
    display: 'none',
    transition: 'all 0.5s cubic-bezier(0,1,0,1)',
  },
  contentShow: {
    display: 'inline-block',
    height: '223px',
    width: '500px',
    padding: '20px',
    marginRight: '-15px',
    marginLeft: '-15px',
    backgroundColor: '#FFD9D9',
    borderRadius: '10px',
    transition: 'all 0.5s cubic-bezier(1,0,1,0)',
    zIndex: 1,
  },
  contentDiv: {
    marginTop: '17px',
    height: '140px',
    width: '100%',
    padding: '5px 0',
    border: '1px solid #C9C9C9',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  listItems1: {
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  listItem: {
    height: '36px',
  },
  listItemText: {
    backgroundColor: '#EEEEEE',
  },
  buttonGrid: {
    display: 'flex',
  },
  leftArrow: {
    color: '#8C8C8C',
    marginTop: 'auto',
    fontSize: '16px',
  },
  rightArrow: {
    marginTop: 'auto',
    marginBottom: '5px',
    color:theme.palette.secondary.main
  },
}));

const StyledClearButton = withStyles({
  root: {
    backgroundColor: '#E2E2E2 !important',
    color: '#8C8C8C',
    height: '42px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
})(Button);

const StyledFilterButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    padding: '12px 40px',
    marginLeft: '20px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
}))(Button);

const StyledButton = withStyles((theme) => ({
  root: {
    marginTop: 'auto',
    color: theme.palette.secondary.main,
    fontSize: '18px',
    padding: '5px 12px',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
  },
}))(Button);

const StyledIconButton = withStyles({
  root: {
    padding: '2px',
  },
})(IconButton);

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    //borderRadius: '10px',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: '#FEF5F5',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const Filters = (props) => {
  const classes = useStyles({});
  const [academicYear, setAcademicYear] = React.useState([]);
  const [branch, setBranch] = React.useState([]);
  const [grade, setGrade] = React.useState([]);
  const [sections, setSections] = React.useState([]);

  const [academicId, setAcademicId] = React.useState(0);
  const [branchId, setBranchId] = React.useState(0);
  const [gradeId, setGradeId] = React.useState(0);
  const [sectionId, setSectionId] = React.useState(0);

  const [selectedAcademic, setselectedAcademic] = React.useState({
    id: 0,
    year: '',
  });
  const [selectedBranch, setSelectedBranch] = React.useState({
    id: 0,
    branchs: '',
  });
  const [selectedGrade, setSelectedGrade] = React.useState({
    id: 0,
    grades: '',
  });
  const [selectedSection, setSelectedSection] = React.useState({
    id: 0,
    section: '',
  });

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [moduleId, setModuleId] = React.useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  //const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [expanded, setExpanded] = React.useState('panel1');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(panel);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleListItemClick = (event, ids, academicYear) => {
    //setSelectedIndex(id);
    setAcademicId(ids);
    setselectedAcademic({
      id: ids,
      year: academicYear,
    });
  };

  const handleBranchList = (event, ids, branchName) => {
    setBranchId(ids);
    setSelectedBranch({
      id: ids,
      branchs: branchName,
    });
  };

  const handleGradeList = (event, ids, gradeName) => {
    setGradeId(ids);
    setSelectedGrade({
      id: ids,
      grades: gradeName,
    });
  };

  const handleSectionList = (event, ids, sectionName) => {
    setSectionId(ids);
    setSelectedSection({
      id: ids,
      section: sectionName,
    });
  };

  const clearFilter = () => {
    //setAcademicYear([]);
    setBranch([]);
    setGrade([]);
    setSections([]);
    setAcademicId(0);
    setBranchId(0);
    setGradeId(0);
    setSectionId(0);
    setSelectedIndex(0);

    setselectedAcademic({ id: 0, year: '' });
    setSelectedBranch({ id: 0, branchs: '' });
    setSelectedGrade({ id: 0, grades: '' });
    setSelectedSection({ id: 0, section: '' });
  };

  const handleFilters = () => {

    let url = props.url;
    if (branchId !== 0) {
      url = `${url}?branch_id=${branchId}`;
      if (gradeId !== 0) {
        url = `${url}&grade_id=${gradeId}`;
        if (sectionId !== 0) {
          url = `${url}&sections=${sectionId}`;
        }
      }
      props.handleFilterData(
        selectedAcademic,
        selectedBranch,
        selectedGrade,
        selectedSection
      );
    }
  };

  React.useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Discussion Forum' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Forum') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  // academicYear API call
  React.useEffect(() => {
    if(moduleId){
      axiosInstance.get(endpoints.masterManagement.academicYear)
      .then((res) => {
        setAcademicYear(res.data.result.results);
      })
      .catch((error) => console.log(error));
    }
  }, [moduleId]);

  // Branch API call
  React.useEffect(() => {
    if (academicId !== 0) {
      axiosInstance
        .get(`${endpoints.discussionForum.branch}?module_id=${moduleId}&session_year=${academicId}`)
        .then((res) => {
          console.log(res.data.data.results);
          setBranch(res.data.data.results);
        })
        .catch((error) => console.log(error));
    }
  }, [academicId]);

  // Grade API call
  React.useEffect(() => {
    if (branchId !== 0) {
      axiosInstance
        .get(`${endpoints.discussionForum.grade}?module_id=${moduleId}&session_year=${academicId}&branch_id=${branchId}`)
        .then((res) => {
          setGrade(res.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [branchId]);

  // Section API call
  React.useEffect(() => {
    if (gradeId !== 0) {
      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?module_id=${moduleId}&session_year=${academicId}&branch_id=${branchId}&grade_id=${gradeId}`
        )
        .then((res) => {
          console.log(res.data);
          setSections(res.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [gradeId]);

  return (
      <>
          {isMobile ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                  <Typography color = "secondary">Academic Year</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ backgroundColor: '#FFD9D9'}}>
                  <div className={classes.contentDiv}>
                    <List component="nav" aria-label="secondary mailbox folder" className={classes.listItems}>
                      {academicYear.map((el,id) => (
                        <ListItem
                          key={id}
                          button
                          selected={academicId === el?.id}
                          onClick={(event) => handleListItemClick(event, el?.id, el?.session_year)}
                          className={classes.listItem}
                        >
                          <ListItemText primary={`${el?.session_year}`} />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                  <Typography color = "secondary">Branch</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ backgroundColor: '#FFD9D9'}}>
                  <div className={classes.contentDiv}>
                    <List component="nav" aria-label="secondary mailbox folder" className={classes.listItems}>
                      {branch.length > 0 && branch.map((el,id) => (
                        <ListItem
                          key={id}
                          button
                          selected={branchId === el?.branch.id}
                          onClick={(event) => handleBranchList(event, el?.branch.id, el?.branch.branch_name)}
                          className={classes.listItem}
                        >
                          <ListItemText primary={`${el?.branch.branch_name}`} />
                        </ListItem>
                      ))}
                      {branch.length === 0 && (
                        <ListItem
                          button
                          selected={selectedIndex === 0}
                          className={classes.listItem}
                        >
                          <ListItemText primary="Please select Academic Year"/>
                        </ListItem>
                      )}
                    </List>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                  <Typography color = "secondary">Grade</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ backgroundColor: '#FFD9D9'}}>
                  <div className={classes.contentDiv}>
                    <List component="nav" aria-label="secondary mailbox folder" className={classes.listItems}>
                      {grade.length > 0 && grade.map((el,id) => (
                        <ListItem
                          key={id}
                          button
                          selected={gradeId === el?.grade_id}
                          onClick={(event) => handleGradeList(event, el?.grade_id, el?.grade__grade_name)}
                          className={classes.listItem}
                        >
                          <ListItemText primary={`${el?.grade__grade_name}`} />
                        </ListItem>
                      ))}
                      {grade.length === 0 && (
                        <ListItem
                          button
                          selected={selectedIndex === 0}
                          className={classes.listItem}
                        >
                          <ListItemText primary="Please select Branch"/>
                        </ListItem>
                      )}
                    </List>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <Typography color = "secondary">Section</Typography>
              </AccordionSummary>
              <AccordionDetails style={{ backgroundColor: '#FFD9D9'}}>
                <div className={classes.contentDiv}>
                  <List component="nav" aria-label="secondary mailbox folder" className={classes.listItems}>
                    {sections.length > 0 && sections.map((el,id) => (
                      <ListItem
                        key={id}
                        button
                        selected={sectionId === el?.id}
                        onClick={(event) => handleSectionList(event, el?.id, el?.section__section_name)}
                        className={classes.listItem}
                      >
                        <ListItemText primary={`${el?.section__section_name}`} />
                      </ListItem>
                    ))}
                    {sections.length === 0 && (
                      <ListItem
                        button
                        selected={selectedIndex === 0}
                        className={classes.listItem}
                      >
                        <ListItemText primary="Please select Grade"/>
                      </ListItem>
                    )}
                  </List>
                </div>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      ) : (
          <Grid container spacing={2} className={classes.categoryFilterContainer}>
              <Grid item sm={8} xs={12}>
                  <div className={classes.wrapper}>
                      <div className={classes.accordion}>
                          <div
                              className={`${
                              expanded === 'panel1'
                                ? classes.item
                                : expanded === 'panel2'
                                ? classes.item2
                                : expanded === 'panel3'
                                ? classes.item3
                                : classes.item1
                            }`}
                              onClick={handleChange('panel1')}
                          >
                              <AcademicYear text="Academic Year" />
                          </div>
                          <div className={`${expanded === 'panel1' ? classes.contentShow : classes.content}`}>
                              <Grid container>
                                  <Grid item xs={12}>
                                      <Typography className={classes.contentTitle}>Academic Year</Typography>
                                    </Grid>
                                  <Grid item xs={8}>
                                      <div className={classes.contentDiv}>
                                          <List component="nav" aria-label="secondary mailbox folder" className={classes.listItems}>
                                              {academicYear.map((el,id) => (
                                                  <ListItem
                                                      key={id}
                                                      button
                                                      selected={academicId === el?.id}
                                                      onClick={(event) => handleListItemClick(event, el?.id, el?.session_year)}
                                                      className={classes.listItem}
                                                    >
                                                      <ListItemText primary={`${el?.session_year}`} />
                                                  </ListItem>
                                                ))}
                                          </List>
                                      </div>
                                  </Grid>
                                  <Grid item xs={4} className={classes.buttonGrid}>
                                      <StyledButton variant="text">Expand</StyledButton>
                                      <span className={classes.rightArrow}>
                                          <StyledIconButton onClick={handleChange('panel1')}>
                                              <LeftArrow />
                                          </StyledIconButton>
                                          <StyledIconButton onClick={handleChange('panel2')}>
                                              <RightArrow />
                                          </StyledIconButton>
                                      </span>
                                  </Grid>
                              </Grid>
                          </div>
                          <div
                            className={`${
                              expanded === 'panel2'
                              ? classes.item
                              : expanded === 'panel1'
                              ? classes.item2
                              : expanded === 'panel3'
                              ? classes.item2
                              : classes.item3
                            }`}
                              onClick={handleChange('panel2')}
                          >
                              <AcademicYear text="Branch" />
                            </div>
                          <div className={`${expanded !== 'panel2' ? classes.content : classes.contentShow}`}>    
                              <Grid container>
                                  <Grid item xs={12}>
                                      <Typography className={classes.contentTitle}>Branch</Typography>
                                  </Grid>
                                  <Grid item xs={8}>
                                      <div className={classes.contentDiv}>
                                          <List component="nav" aria-label="secondary mailbox folder" className={classes.listItems}>
                                              {branch.length > 0 && branch.map((el,id) => (
                                                  <ListItem
                                                      key={id}
                                                      button
                                                      selected={branchId === el?.branch.id}
                                                      onClick={(event) => handleBranchList(event, el?.branch.id, el?.branch.branch_name)}
                                                      className={classes.listItem}
                                                    >
                                                      <ListItemText primary={`${el?.branch.branch_name}`} />
                                                </ListItem>
                                              ))}
                                            {branch.length === 0 && (
                                              <ListItem
                                                button
                                                selected={selectedIndex === 0}
                                                className={classes.listItem}
                                              >
                                                  <ListItemText primary="Please select Academic Year"/>
                                              </ListItem>
                                            )}
                                          </List>
                                        </div>
                                      </Grid>
                                  <Grid item xs={4} className={classes.buttonGrid}>
                                      <StyledButton variant="text">Expand</StyledButton>
                                      <span className={classes.rightArrow}>
                                          <StyledIconButton onClick={handleChange('panel1')}>
                                              <LeftArrow />
                                          </StyledIconButton>
                                          <StyledIconButton onClick={handleChange('panel3')}>
                                              <RightArrow />
                                        </StyledIconButton>
                                      </span>
                                    </Grid>
                                  </Grid>
                                </div>

                          <div
                              className={`${
                                expanded === 'panel3'
                                  ? classes.item
                                  : expanded === 'panel1'
                                  ? classes.item3
                                  : expanded === 'panel2'
                                  ? classes.item2
                                  : classes.item2
                              }`}
                              onClick={handleChange('panel3')}
                          >
                              <AcademicYear text="Grade" />
                          </div>
                          <div className={`${expanded !== 'panel3' ? classes.content : classes.contentShow}`}>
                              <Grid container>
                                  <Grid item xs={12}>
                                      <Typography className={classes.contentTitle}>Grade</Typography>
                                  </Grid>
                                  <Grid item xs={8}>
                                      <div className={classes.contentDiv}>
                                          <List component="nav" aria-label="secondary mailbox folder" className={classes.listItems}>
                                              {grade.length > 0 && grade.map((el,id) => (
                                                  <ListItem
                                                      key={id}
                                                      button
                                                      selected={gradeId === el?.grade_id}
                                                      onClick={(event) => handleGradeList(event, el?.grade_id, el?.grade__grade_name)}
                                                      className={classes.listItem}
                                                    >
                                                      <ListItemText primary={`${el?.grade__grade_name}`} />
                                                  </ListItem>
                                              ))}
                                              {grade.length === 0 && (
                                                <ListItem
                                                  button
                                                  selected={selectedIndex === 0}
                                                  className={classes.listItem}
                                                >
                                                  <ListItemText primary="Please select Branch"/>
                                                </ListItem>
                                              )}
                                          </List>
                                        </div>
                                  </Grid>
                                  <Grid item xs={4} className={classes.buttonGrid}>
                                      <StyledButton variant="text">Expand</StyledButton>
                                      <span className={classes.rightArrow}>
                                          <StyledIconButton onClick={handleChange('panel2')}>
                                              <LeftArrow />
                                          </StyledIconButton>
                                          <StyledIconButton onClick={handleChange('panel4')}>
                                              <RightArrow />
                                         </StyledIconButton>
                                      </span>
                                  </Grid>
                              </Grid>
                          </div>
                          {/* new filter add here */}
                          <div
                              className={`${
                                expanded === 'panel4'
                                  ? classes.item
                                  : expanded === 'panel1'
                                  ? classes.item1
                                  : expanded === 'panel2'
                                  ? classes.item3
                                  : classes.item2
                              }`}
                              onClick={handleChange('panel4')}
                          >
                              <AcademicYear text="Section" />
                          </div>
                          <div className={`${expanded !== 'panel4' ? classes.content : classes.contentShow}`}>
                              <Grid container>
                                  <Grid item xs={12}>
                                      <Typography className={classes.contentTitle}>Section</Typography>
                                  </Grid>
                                  <Grid item xs={8}>
                                      <div className={classes.contentDiv}>
                                          <List component="nav" aria-label="secondary mailbox folder" className={classes.listItems}>
                                              {sections.length > 0 && sections.map((el,id) => (
                                                  <ListItem
                                                      key={id}
                                                      button
                                                      selected={sectionId === el?.id}
                                                      onClick={(event) => handleSectionList(event, el?.id, el?.section__section_name)}
                                                      className={classes.listItem}>
                                                      <ListItemText primary={`${el?.section__section_name}`} />
                                                </ListItem>
                                              ))}
                                              {sections.length === 0 && (
                                                <ListItem
                                                  button
                                                  selected={selectedIndex === 0}
                                                  className={classes.listItem}
                                                >
                                                  <ListItemText primary="Please select Grade"/>
                                                </ListItem>
                                              )}
                                          </List>
                                        </div>
                                      </Grid>
                                    <Grid item xs={4} className={classes.buttonGrid}>
                                      <StyledButton variant="text">Expand</StyledButton>
                                        <span className={classes.rightArrow}>
                                          <StyledIconButton onClick={handleChange('panel3')}>
                                              <LeftArrow />
                                          </StyledIconButton>
                                          <StyledIconButton onClick={handleChange('panel4')}>
                                              <RightArrow />
                                          </StyledIconButton>
                                        </span>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
              </Grid>
            <Grid item sm={4} xs={12} style={{display: 'flex'}}>
            <StyledClearButton
              variant='contained'
              startIcon={<ClearIcon />}
              onClick={clearFilter}
            >
              Clear all
            </StyledClearButton>
            <StyledFilterButton
              variant='contained'
              color='secondary'
              startIcon={<FilterFilledIcon className={classes.filterIcon} />}
              className={classes.filterButton}
              onClick={handleFilters}
            >
              filter
            </StyledFilterButton>
          </Grid>
        </Grid>
      )}
    </>
)};

export default Filters;
