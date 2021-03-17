import React from 'react';
import { useQuizQuesContext } from '../../../mp-quiz-providers';
import PreQuestionAnim from './pre-question-anim';
import QuestionContent from './question-content';
import Meme from './meme';
import Leaderboard from './leader-board';

import InternalPageStatus from '../internal-page-status';

import '../../styles/question_view.css';
import '../../styles/anim.css';

function QuestionHandler() {
  const {
    fetchQuizQp,
    // quizQp,
    timeToRenderObj,
    timeToRenderControls: { timeToRender, onAttemptionCurrentQuesAttemption },
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
        return <InternalPageStatus loader label='Loading...' />;
      }
    }
  }
  return (
    <>
      <p>{timeToRender}</p>
      {getContent()}
    </>
  );
}
export default QuestionHandler;
