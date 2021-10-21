/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Grid,
  withStyles,
  Divider,
  Dialog,
  DialogContent,
  Button,
  Typography,
  IconButton,
  TextField,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import styles from './SubmitRating.style';
// import useFetch from '../../../../../hoc/useFetch';
// import urls from '../../../../../url';

const SubmitRating = ({
  open, classes, moduleId, onDialogClose, history
}) => {
  // const [ratingData, setRatingData] = useState({});
  // let openVar = open;
  const [courseType] = useState(localStorage.getItem('coursesType'));
  // const moduleId = sessionStorage.getItem('moduleId');
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));

  const [ratingOpen, setRatingOpen] = useState(false);
  const [ratingGrammar, setRatingGrammar] = useState();
  const [ratingClarity, setRatingClarity] = useState();
  const [ratingStructure, setRatingStructure] = useState();
  const [ratingEngagement, setRatingEngagement] = useState();
  const [ratingVocabulary, setRatingVocabulary] = useState();
  const [ratingCoherence, setRatingCoherence] = useState();
  const [ratingOverall, setRatingOverall] = useState();

  const [selectionGrammar, setSelectionGrammar] = useState(0);
  const [selectionClarity, setSelectionClarity] = useState(0);
  const [selectionStructure, setSelectionStructure] = useState(0);
  const [selectionEngagement, setSelectionEngagement] = useState(0);
  const [selectionVocabulary, setSelectionVocabulary] = useState(0);
  const [selectionCoherence, setSelectionCoherence] = useState(0);
  const [selectionOverall, setSelectionOverall] = useState(0);
  const [textFeedback, setTextFeedback] = useState('');
  // const {
  //   // data: addedCategoryResponse,
  //   // isLoading: addedCategoryLoading,
  //   doFetch: submitStarRating,
  // } = useFetch();
  // const handleCloseRating = () => {
  //   setRatingOpen(false);
  // };

  const hoverOverGrammar = (event) => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('star-id')) {
      val = event.target.getAttribute('star-id');
    }
    setSelectionGrammar(val);
  };

  const hoverOverClarity = (event) => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('star-id')) {
      val = event.target.getAttribute('star-id');
    }
    setSelectionClarity(val);
  };

  const hoverOverStructure = (event) => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('star-id')) {
      val = event.target.getAttribute('star-id');
    }
    setSelectionStructure(val);
  };

  const hoverOverEngagement = (event) => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('star-id')) {
      val = event.target.getAttribute('star-id');
    }
    setSelectionEngagement(val);
  };

  const hoverOverVocabulary = (event) => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('star-id')) {
      val = event.target.getAttribute('star-id');
    }
    setSelectionVocabulary(val);
  };

  const hoverOverCoherence = (event) => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('star-id')) {
      val = event.target.getAttribute('star-id');
    }
    setSelectionCoherence(val);
  };

  const hoverOverOverall = (event) => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('star-id')) {
      val = event.target.getAttribute('star-id');
    }
    setSelectionOverall(val);
  };
  const submit = () => {
    setRatingOpen(false);
    // setOpendialogue(false);
    // console.log(ratingOpen);
    const data = {
      course: moduleId,
      feed_back: textFeedback || '',
      module_rating: {
        content_rating: ratingGrammar || 0,
        presentation_rating: ratingClarity || 0,
        relevance_rating: ratingStructure || 0,
        structure_rating: ratingEngagement || 0,
        clarity_rating: ratingVocabulary || 0,
        engagement_rating: ratingCoherence || 0,
        overall_rating: ratingOverall || 0,
      },
    };
    data[`is_${courseType}`] = true;
    // submitStarRating({
    //   url: `${urls.starRatingSubmitApi}`,
    //   method: 'POST',
    //   body: data,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${auth.personal_info.token}`,
    //   },
    // });
    // async function loading(url) {
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${auth.personal_info.token}`,
    //       module: localStorage.getItem('Induction_Training')
    //     },
    //   });
    //   const res = await response.json();
    //   return res;
    // }
    // loading(urls.starRatingSubmitApi)
    //   .then((res) => {
    //     // console.log('success', res);
    //     // if (auth.personal_info.role === 'Teacher') {
    //       history.push('/chapters');
    //     // } else {
    //     //   history.push('/modules');
    //     // }
    //   })
    //   .catch(
    //     (error) => {
    //       // alert.error(`Error:${error}`);
    //       // console.log(error);
    //     },
    //   );
  };
  const feedbackText = (feedbackOverallText) => {
    setTextFeedback(feedbackOverallText);
  };

  const skip = () => {
    // console.log('-------------skip-------------');
    setRatingOpen(false);
    // setOpendialogue(false);
    // openVar = false;
    setRatingOpen(0);
    setRatingGrammar(0);
    setRatingClarity(0);
    setRatingStructure(0);
    setRatingEngagement(0);
    setRatingVocabulary(0);
    setRatingCoherence(0);
    setRatingOverall(0);
  };
  function Star({ marked, starId }) {
    return (
      <span star-id={starId} style={{ color: '#ff9933', cursor: 'pointer', fontSize: 30 }} role="button">
        {marked ? '\u2605' : '\u2606'}
      </span>
    );
  }
  Star.propTypes = {
    marked: PropTypes.bool.isRequired,
    starId: PropTypes.number.isRequired,
  };
  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };
  DialogTitle.propTypes = {
    children: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  // function StarRating(props) {
  //   const [rating, setRating] = useState(typeof props.rating === 'number' ? props.rating : 0);
  //   // const [name, setName] = useState();
  //   const [selection, setSelection] = React.useState(0);
  //   const hoverOver = (event) => {
  //     let val = 0;
  //     if (event && event.target && event.target.getAttribute('star-id')) {
  //       val = event.target.getAttribute('star-id');
  //     }
  //     setSelection(val);
  //   };
  //   const doRate = (rate, name) => {
  //     setRating(rate);
  //     setSelection(rate);
  //     setRatingData((data) => {
  //       const newData = { ...data };
  //       newData[name] = rate;
  //       return newData;
  //     });
  //     // console.log(ratingData);
  //   };
  //   return (
  //     // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  //     // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  //     <div
  //       onMouseOut={() => hoverOver(null)}
  //       onClick={(event) => doRate(event.target.getAttribute('star-id') || rating, props.name)}
  //       onMouseOver={hoverOver}
  //     >
  //       {Array.from({ length: 5 }, (v, i) => (
  //         <Star
  //           starId={i + 1}
  //           key={`star_${i + 1} `}
  //           marked={selection ? selection >= i + 1 : rating >= i + 1}
  //         />
  //       ))}
  //     </div>
  //   );
  // }
  return (
    <>
      <Dialog
        maxWidth='md'
        open={open}
        aria-labelledby="rating-dialog-title"
        aria-describedby="rating-dialog-description"
        className={classes.mcqmodal}
      >
        <DialogTitle id="rating-dialog-title" onClose={() => { onDialogClose(); skip(); }}>
          Submit your feedback
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              Content
              {/* <StarRating rating={4} /> */}
              <div
                onMouseOut={() => hoverOverGrammar(null)}
                onClick={(event) => setRatingGrammar(event.target.getAttribute('star-id') || ratingGrammar)}
                onMouseOver={hoverOverGrammar}
              >
                {Array.from({ length: 5 }, (v, i) => (
                  <Star
                    starId={i + 1}
                    key={`star_${i + 1} `}
                    marked={selectionGrammar ? selectionGrammar >= i + 1 : ratingGrammar >= i + 1}
                  />
                ))}
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              Presentation
              <div
                onMouseOut={() => hoverOverClarity(null)}
                onClick={(event) => setRatingClarity(event.target.getAttribute('star-id') || ratingClarity)}
                onMouseOver={hoverOverClarity}
              >
                {Array.from({ length: 5 }, (v, i) => (
                  <Star
                    starId={i + 1}
                    key={`star_${i + 1} `}
                    marked={selectionClarity
                      ? selectionClarity >= i + 1 : ratingClarity >= i + 1}
                  />
                ))}
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              Relevance
              <div
                onMouseOut={() => hoverOverStructure(null)}
                onClick={(event) => setRatingStructure(event.target.getAttribute('star-id') || ratingStructure)}
                onMouseOver={hoverOverStructure}
              >
                {Array.from({ length: 5 }, (v, i) => (
                  <Star
                    starId={i + 1}
                    key={`star_${i + 1} `}
                    marked={selectionStructure
                      ? selectionStructure >= i + 1 : ratingStructure >= i + 1}
                  />
                ))}
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              Structure
              <div
                onMouseOut={() => hoverOverEngagement(null)}
                onClick={(event) => setRatingEngagement(event.target.getAttribute('star-id') || ratingEngagement)}
                onMouseOver={hoverOverEngagement}
              >
                {Array.from({ length: 5 }, (v, i) => (
                  <Star
                    starId={i + 1}
                    key={`star_${i + 1} `}
                    marked={selectionEngagement
                      ? selectionEngagement >= i + 1 : ratingEngagement >= i + 1}
                  />
                ))}
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              Clarity
              <div
                onMouseOut={() => hoverOverVocabulary(null)}
                onClick={(event) => setRatingVocabulary(event.target.getAttribute('star-id') || ratingVocabulary)}
                onMouseOver={hoverOverVocabulary}
              >
                {Array.from({ length: 5 }, (v, i) => (
                  <Star
                    starId={i + 1}
                    key={`star_${i + 1} `}
                    marked={selectionVocabulary
                      ? selectionVocabulary >= i + 1 : ratingVocabulary >= i + 1}
                  />
                ))}
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              Engagement
              <div
                onMouseOut={() => hoverOverCoherence(null)}
                onClick={(event) => setRatingCoherence(event.target.getAttribute('star-id') || ratingCoherence)}
                onMouseOver={hoverOverCoherence}
              >
                {Array.from({ length: 5 }, (v, i) => (
                  <Star
                    starId={i + 1}
                    key={`star_${i + 1} `}
                    marked={selectionCoherence
                      ? selectionCoherence >= i + 1 : ratingCoherence >= i + 1}
                  />
                ))}
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              Overall
              <div
                onMouseOut={() => hoverOverOverall(null)}
                onClick={(event) => setRatingOverall(event.target.getAttribute('star-id') || ratingOverall)}
                onMouseOver={hoverOverOverall}
              >
                {Array.from({ length: 5 }, (v, i) => (
                  <Star
                    starId={i + 1}
                    key={`star_${i + 1} `}
                    marked={selectionOverall
                      ? selectionOverall >= i + 1 : ratingOverall >= i + 1}
                  />
                ))}
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                id="rating-overall"
                label="Feedback"
                required
                variant="outlined"
                margin="dense"
                fullWidth
                multiline
                rows={3}
                onChange={(e) => feedbackText(e.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12} />
            
            <Grid item md={4} xs={12} />
            <Grid item md={4} xs={12} >
            <Button
                onClick={() => { submit(); onDialogClose(); }}
              >
                Submit
              </Button>
            </Grid>
           
            <Grid item md={4} xs={12}>
              
              <Button
                onClick={() => onDialogClose(false) }
              >
                Skip
              </Button>
            </Grid>
            
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};
SubmitRating.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(SubmitRating);
