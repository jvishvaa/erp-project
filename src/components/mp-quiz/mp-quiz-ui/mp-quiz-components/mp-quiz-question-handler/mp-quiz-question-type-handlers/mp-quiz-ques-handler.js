import React from 'react';
// import LinkTag from '@material-ui/core/Link';
import { useQuizQuesContext } from '../../../../mp-quiz-providers';
import PreQuestionAnim from '../mp-quiz-ques-attemption-flow-comp/pre-question-anim';
import QuestionContent from '../question-content';
import Meme from '../mp-quiz-ques-attemption-flow-comp/meme';
import Leaderboard from '../mp-quiz-ques-attemption-flow-comp/leader-board-bwn-questions';

import InternalPageStatus from '../../internal-page-status';

import '../../../styles/question_view.css';
import '../../../styles/anim.css';

function QuestionHandler() {
  const {
    fetchQuizQp,
    quizQp: { fetch, fetching, fetchFailed, message },
    timeToRenderObj,
    timeToRenderControls: { timeToRender },
  } = useQuizQuesContext();

  React.useEffect(() => {
    const dataProp = {
      queryParamObj: { question_paper: 80, lobby_identifier: 907, online_class_id: 907 },
    };
    fetchQuizQp(dataProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    labels: { renderPreQuesAnim, renderQues, renderMeme, renderLB },
  } = timeToRenderObj || {};

  function getContent() {
    switch (timeToRender) {
      case renderPreQuesAnim: {
        return <PreQuestionAnim />;
      }
      case renderQues: {
        return <QuestionContent />;
      }
      case renderMeme: {
        return <Meme />;
      }
      case renderLB: {
        return <Leaderboard />;
      }
      default: {
        const labelOnFetchFailure = (
          <p>
            Error occured in fetching data&nbsp;
            {/* <LinkTag component='button' onClick={fetch}> // please handle (to refetch with out query param)
              <b>Click here to reload_</b>
            </LinkTag> */}
          </p>
        );
        return (
          <InternalPageStatus
            loader={!fetchFailed}
            label={
              // eslint-disable-next-line no-nested-ternary
              fetchFailed ? labelOnFetchFailure : fetching ? 'Fetching...' : 'Loading...'
            }
          />
        );
      }
    }
  }
  return getContent();
}
export default QuestionHandler;
