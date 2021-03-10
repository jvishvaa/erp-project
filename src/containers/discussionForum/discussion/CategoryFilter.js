import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  verticalDiv: {
    transform: 'rotate(-90deg)',
    // height: '200px',
    width: '223px',
    position: 'initial',
    marginLeft: '15px',
    // display: 'flex',
    // flexWrap: 'wrap',
  },
  academicPanel: {
    backgroundColor: '#FFECEC',
    borderRadius: '10px',
  },
  subjectPanel: {
    backgroundColor: '#FFE6E6',
    borderRadius: '10px',
  },
  gradePanel: {
    backgroundColor: '#FFEFEF',
  },
  sectionPanel: {
    backgroundColor: '#FEF5F5',
  },
  selectDiv: {
    height: '140px',
    width: '300px',
    padding: '8px 0',
    backgroundColor: '#FFFFFF',
    border: '1px solid #C9C9C9',
    borderRadius: '10px',
  },
  accordionSummary: {
    backgroundColor: '#FFD9D9',
    borderRadius: '10px 10px 0 0',
  },
  accordionTitle: {
    color: '#014B7E',
    fontSize: '20px',
  },
});

const Accordion = withStyles({
  root: {
    boxShadow: 'none',
    // transform: 'rotate(-90deg)',
    // width: '200px',
    borderRadius: '10px',
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
    marginBottom: -1,
    minHeight: 72,
    borderRadius: '10px 10px 0 0',
    // width: '200px',
    // transform: 'rotate(-90deg)',
    '&$expanded': {
      minHeight: 72,
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
    transform: 'rotate(90deg)',
    backgroundColor: '#FFD9D9',
    borderRadius: '0 0 10px 10px',
    height: '210px',
    width: '215px',
    marginRight: '20px',
    // marginTop: '20px',
  },
}))(MuiAccordionDetails);

export default function CategoryFilterComponent() {
  const classes = useStyles({});
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.verticalDiv}>
      <Accordion
        rounded
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        className={classes.academicPanel}
      >
        <AccordionSummary
          aria-controls='panel1d-content'
          id='panel1d-header'
          className={`${
            expanded === 'panel1' ? classes.accordionSummary : classes.academicPanel
          }`}
        >
          <Typography className={classes.accordionTitle}>Academic Year</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.academicPanel}>
          <div className={classes.selectDiv}>
            <Typography>2018-2019</Typography>
            <Typography>2019-2020</Typography>
            <Typography>2020-2021</Typography>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          aria-controls='panel2d-content'
          id='panel2d-header'
          className={`${
            expanded === 'panel2' ? classes.accordionSummary : classes.subjectPanel
          }`}
        >
          <Typography className={classes.accordionTitle}>Subject</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.subjectPanel}>
          <div className={classes.selectDiv}>subjectPanel</div>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          aria-controls='panel3d-content'
          id='panel3d-header'
          className={`${
            expanded === 'panel3' ? classes.accordionSummary : classes.gradePanel
          }`}
        >
          <Typography className={classes.accordionTitle}>Grade</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.gradePanel}>
          <div className={classes.selectDiv}>gradePanel</div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        rounded
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
      >
        <AccordionSummary
          aria-controls='panel3d-content'
          id='panel3d-header'
          className={`${
            expanded === 'panel4' ? classes.accordionSummary : classes.sectionPanel
          }`}
        >
          <Typography className={classes.accordionTitle}>Section</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.sectionPanel}>
          <div className={classes.selectDiv}>sectionPanel</div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export const CategoryFilter = React.memo(CategoryFilterComponent);
