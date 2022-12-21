import { DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd'
import moment from 'moment';
import React from 'react'

const QuestionCard = ({ques,index,handleDeleteQuestion,testMark, questionPaperWise}) => {
const marks = testMark.filter((item) => item?.question_id === ques?.id)
    const getquestionLevel = (type) => {
        switch (type) {
          case 1:
            return 'Easy';
          case 2:
            return 'Average';
          case 3:
            return 'Difficult';
          default :
            return '--'
        }
      };
    
      const questionType = (type) => {
        switch (type) {
          case 1:
            return 'MCQ Single Choice';
          case 2:
            return 'MCQ Multiple Choice';
          case 3:
            return 'Match the Following';
          case 4:
            return 'Video Question';
          case 5:
            return 'PPT Question';
          case 6:
            return 'Matrix Questions';
          case 7:
            return 'Comprehension';
          case 8:
            return 'True False';
          case 9:
            return 'Fill In The Blanks';
          case 10:
            return 'Descriptive';
          default:
            return '--';
        }
      };
      function extractContent(s) {
        const span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
      }
  return (
  <div className='row col-md-12 mx-4 my-3'>
    Q{index + 1}.
    <div className='col-md-11 ml-2' style={{ border: '4px solid #e8e8e9',borderRadius:'6px' }}>
      <div className='row mx-1 align-items-center mt-2' style={{background:'#f0f4fb', height:'35px'}}>
        <div className='ml-2'>
        Question: {extractContent(ques?.question_answer[0]?.question).length > 100 ? extractContent(ques?.question_answer[0]?.question).substring(0,100) + '...' : extractContent(ques?.question_answer[0]?.question)}
        </div>
        </div>
      <hr />
      <div className='row mt-3 mb-2'>
    <div className='col-md-1 d-flex align-items-center justify-content-center' style={{fontSize : '13px',background:'#00be91' ,color:'white', borderRadius:'6px',height:'20px'}}>
    {getquestionLevel(parseInt(ques?.question_level))}
    </div>
    <div className='col-md-2 d-flex align-items-center justify-content-center ml-2' style={{fontSize : '13px' , background:'#01b8d8' , color:'white',borderRadius:'6px',height:'20px'}}>
    {questionType(ques?.question_type)}
    </div>
    {marks && !questionPaperWise &&  <div className='col-md-2 d-flex align-items-center' style={{fontSize : '13px',height:'20px'}}>
    Marks : {marks[0]?.question_mark[0]}
    </div>}
    {!marks && questionPaperWise && <div className='col-md-2 d-flex align-items-center' style={{fontSize : '13px',height:'20px'}}></div>}
    <div className='col-md-3'></div>
    <div className='d-flex col-md-3 ml-5 justify-content-end'>
        {/* <div className='col-md-9 d-flex align-items-center' style={{fontSize : '13px', height:'20px'}}> */}
        Created On: {moment(ques?.created_at).format('L')}
        {/* </div> */}
        {/* <div className='col-md-3'>
    <Button className='th-button-active' style={{borderRadius : '6px'}}>
        View
    </Button>
    </div> */}
    </div>
    <div>
    <DeleteFilled className='ml-3' onClick={() => handleDeleteQuestion(ques,index)} style={{color:'blue',fontSize:'large'}} />
    </div>
    {/* <div className='col-md-2'>
    
    </div> */}
      </div>
    </div>
  </div>
  )
}

export default QuestionCard