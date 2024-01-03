import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import './styles/index.css';
import EachActivityCard from './EachActivityCard';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 11,
    display: 'flex',
    padding: '2% 0%',
    marginBottom: '15px',
    justifyContent: 'center',
    '&.MuiPaper-rounded': {
      borderRadius: '0px',
    },
  },
  printButton: {
    position: 'absolute',
    right: '5%',
    bottom: '4%',
    marginTop: '1%',
    background: theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
    '&:hover': {
      background: '#1b4ccb',
    },
  },
}));

const PhysicalEducationReportCard = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { peReportCardData } = props;
  return peReportCardData?.data?.length > 0 ? (
    peReportCardData?.data?.map((item) => item?.criteria_title).flat()?.length > 0 ? (
      peReportCardData?.data?.map((eachActivity) => {
        return (
          <>
            {eachActivity?.criteria_title.length > 0 && (
              <EachActivityCard
                activityReportData={eachActivity}
                branchLogo={peReportCardData?.user_data[0]?.branch_logo}
                username={peReportCardData?.user_data[0]?.name}
                ref={ref}
              />
            )}
          </>
        );
      })
    ) : (
      <Paper component={'div'} elevation={2} className={classes.root}>
        <div className='row'>
          <div className='col-12 text-center'>
            <span className='th-22 th-fw-600 th-grey'>
              &#9432; Kindly reach out to the school management to obtain the report card.
            </span>
          </div>
        </div>
      </Paper>
    )
  ) : (
    <Paper component={'div'} elevation={2} className={classes.root}>
      <div className='row'>
        <div className='col-12 text-center'>
          <span className='th-22 th-fw-600 th-grey'>
            &#9432; Kindly reach out to the school management to obtain the report card.
          </span>
        </div>
      </div>
    </Paper>
  );
});

export default PhysicalEducationReportCard;
