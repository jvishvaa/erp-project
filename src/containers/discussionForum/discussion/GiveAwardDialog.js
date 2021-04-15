import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import { Divider, Grid } from '@material-ui/core';
import GoldAwards from '../../../assets/images/Gold.svg';
import SilverAwards from '../../../assets/images/Silver.svg';
import BronzeAwards from '../../../assets/images/Bronze.svg';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const useStyles = makeStyles({
  award: {
    backgroundColor: blue[100],
  },
});

function GiveAwardDialog(props) {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { onClose, selectedValue, postId, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const giveAwardHandler = (awardId) => {
    const params = {
      award_id: awardId,
      post_id: postId,
    };
    axiosInstance
      .post(endpoints.discussionForum.GiveAwardAPI, params)
      .then((res) => {
        setAlert('success', res.data.message);
        if (res.data && res.data.status_code === 200) {
          onClose(selectedValue);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby='simple-dialog-title' open={open}>
      <DialogTitle id='simple-dialog-title'>
        Select the award you want to give to the post
      </DialogTitle>
      <Divider />
      <div
        style={{
          padding: '10px 40px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span onClick={() => giveAwardHandler(1)} tabIndex={0}>
            <img src={GoldAwards} alt="Gold Awards" />
          </span>
        <span onClick={() => giveAwardHandler(2)} tabIndex={0}>
            <img src={SilverAwards} alt="Silver Awards" />
          </span>
        <span onClick={() => giveAwardHandler(3)} tabIndex={0}>
            <img src={BronzeAwards} alt="Bronze Awards" />
          </span>
      </div>
    </Dialog>
  );
}

GiveAwardDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default GiveAwardDialog;
