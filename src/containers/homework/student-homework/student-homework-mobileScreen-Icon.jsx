import React from 'react';
import { makeStyles, SvgIcon } from '@material-ui/core';
import studentHomeworkEvaluted from '../../../assets/images/Group-8288.svg';
import hwFileUnopened from '../../../assets/images/hw-file-unopened.svg';
import hwFileOpened from '../../../assets/images/File-opened-small.svg';
import Expired from '../../../assets/images/Expired-small.svg';
import hwSubmitted from '../../../assets/images/File-submitted-small.svg';
import './student-homework.css';


const useStyles = makeStyles((theme)=>({
  iconText: {
    color: theme.palette.secondary.main,
    fontSize: "14px"
  }
}))
const MobileIconScreen = (props) => {
  const classes = useStyles()
  return (
    <>
      {!props.isOpen && (
        <div className={`mobile-icon`}>
          <div className='mobile-icon-container'>
            <div className='icon-file-unopened'>
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '28px', marginRight: '5px' }}
                    src={hwFileUnopened}
                    alt='evaluated'
                  />
                )}
              />
              <p className={classes.iconText}>Unopened</p>
            </div>
            <div className='icon-file-opned'>
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '28px', marginRight: '5px' }}
                    src={hwFileOpened}
                    alt='evaluated'
                  />
                )}
              />
              <p className={classes.iconText}>Opened</p>
            </div>
            <div className='icon-submitted'>
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '28px', marginRight: '5px' }}
                    src={hwSubmitted}
                    alt='evaluated'
                  />
                )}
              />
              <p className={classes.iconText}>Submitted</p>
            </div>
            <div className='icon-evaluated'>
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '28px', marginRight: '5px' }}
                    src={studentHomeworkEvaluted}
                    alt='evaluated'
                  />
                )}
              />
              <p className={classes.iconText}>Evaluated</p>
            </div>
            <div className='icon-expired'>
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '28px', marginRight: '5px' }}
                    src={Expired}
                    alt='evaluated'
                  />
                )}
              />
              <p className={classes.iconText}>Expired</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileIconScreen;
