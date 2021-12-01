import React , { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import axiosInstance from '../../../config/axios';
import axios from "axios";
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './feedback-lesson.scss';


export default function FeedbackLesson(props) {
    const [open, setOpen] = React.useState(false);
    const [selectedValueFeed, setSelectedValueFeed] = React.useState('');
  const { setAlert } = useContext(AlertNotificationContext);

    const user  = JSON.parse(localStorage.getItem('userDetails')) || {};
    const getDomainName = () => {
        let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
        const { host } = new URL(axiosInstance.defaults.baseURL); 
        // const { host } = window.location.origin; 
        const hostSplitArray = host.split('.');
        const subDomainLevels = hostSplitArray.length - 2;
        let domain = '';
        let subDomain = '';
        let subSubDomain = '';
        if (hostSplitArray.length > 2) {
          domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
        }
        if (subDomainLevels === 2) {
          subSubDomain = hostSplitArray[0];
          subDomain = hostSplitArray[1];
        } else if (subDomainLevels === 1) {
          subDomain = hostSplitArray[0];
        }
        return subDomain;
      };

    const handleChange = (event) => {
        setSelectedValueFeed(event.target.value);
       console.log(user.user_id , "user");
       console.log(props.periodDataForView , "period");
       console.log(getDomainName() , "period");
       const data = {
        feedback_by_user: user.user_id,
        domain_name: getDomainName(),
        feedback: event.target.value,
        lesson: props.periodDataForView.id
       }

       axios
       .post(`${endpoints.lessonPlan.lessonFeedback}`,data ,
       {
        headers: { 'x-api-key': 'vikash@12345#1231' },
       })
       .then((result) => {
       console.log(result);
       setAlert('success','Feedback Saved Successfully')
        props.handleCloseFeed()
      })
      .catch((error) => {
       console.log(error.response.status);
       if(error.response.status === 404){
           setAlert('error','Feedback Already Given!')
       }
       props.handleCloseFeed()

      });
    };





    return (
        <div>

            <Dialog
                open={props.openFeed}
                onClose={props.handleCloseFeed}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className='dialog-container-feedback'
            >
                <DialogTitle id="alert-dialog-title">{"How would you rate the overall conceptualization of the lesson plan?"}</DialogTitle>
                <DialogContent >
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '11%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#128525;</p>
                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '2px' }} >Outstanding</p>
                            <Radio
                                checked={selectedValueFeed === '10'}
                                onChange={handleChange}
                                value="10"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#128522;</p>

                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '4px' }} >Excellent</p>

                            <Radio
                                checked={selectedValueFeed === '9'}
                                onChange={handleChange}
                                value="9"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#128518;</p>

                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '4px' }} >Very Good</p>

                            <Radio
                                checked={selectedValueFeed === '8'}
                                onChange={handleChange}
                                value="8"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#128516;</p>

                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '4px' }} >Good</p>

                            <Radio
                                checked={selectedValueFeed === '7'}
                                onChange={handleChange}
                                value="7"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#128515;</p>

                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '4px' }} >Above Average</p>

                            <Radio
                                checked={selectedValueFeed === '6'}
                                onChange={handleChange}
                                value="6"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#128512;</p>


                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '4px' }} >Average</p>

                            <Radio
                                checked={selectedValueFeed === '5'}
                                onChange={handleChange}
                                value="5"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#128578;</p>

                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '4px' }} >Below Average</p>

                            <Radio
                                checked={selectedValueFeed === '4'}
                                onChange={handleChange}
                                value="4"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#128577;</p>

                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '4px' }} >Weak</p>

                            <Radio
                                checked={selectedValueFeed === '3'}
                                onChange={handleChange}
                                value="3"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%', justifyContent: 'space-between' }} >
                            <p style={{ fontSize: "50px" }}>&#9785;&#65039;</p>

                            <p style={{ fontWeight: '600', fontSize: '13px', padding: '4px' }} >Very Weak</p>

                            <Radio
                                checked={selectedValueFeed === '2'}
                                onChange={handleChange}
                                value="2"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
