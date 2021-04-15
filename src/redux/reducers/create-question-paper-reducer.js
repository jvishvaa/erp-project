import { createQuestionPaperActions } from '../actions';

const mockQuestions = [
  {
    id: 1,
    sections: [
      {
        name: 'SEC A',
        questions: [{ name: 'Question Type A', created: '30.12.2020' }],
      },
      {
        name: 'SEC B',
        questions: [{ name: 'Question Type A', created: '30.12.2020' }],
      },
    ],
  },
  {
    id: 1,
    sections: [
      {
        name: 'SEC A',
        questions: [{ name: 'Question Type A', created: '30.12.2020' }],
      },
      {
        name: 'SEC B',
        questions: [{ name: 'Question Type A', created: '30.12.2020' }],
      },
    ],
  },
];

const INITIAL_STATE = {
  questions: [],
  selectedGrade: '',
  selectedSubject: [],
  selectedLevel: '',
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case createQuestionPaperActions.ADD_NEW_QUESTION:
      return { ...state, questions: [...state.questions, action.data] };

    case createQuestionPaperActions.ADD_QUESTION_TO_SECTION: {
      const questionsList = JSON.parse(JSON.stringify(state.questions));
      const index = questionsList.findIndex((q) => q.id === action.questionId);
      const { sections } = questionsList[index];
      const sectionIndex = sections.findIndex((sec) => sec.name === action.section);
      sections[sectionIndex].questions.push(action.data);
      questionsList[index].sections = sections;
      return { ...state, questions: questionsList };
    }

    case createQuestionPaperActions.SET_FILTER: {
      return { ...state, [action.filter]: action.data };
    }

    case createQuestionPaperActions.DELETE_SECTION: {
      const questionsList = JSON.parse(JSON.stringify(state.questions));
      const index = questionsList.findIndex((q) => q.id === action.questionId);
      const { sections } = questionsList[index];
      if (sections.length === 1) {
        //delet entire question
        for(let i = index;i<questionsList.length;i++) {
          const {sections:modifySecName} = questionsList[i];
          modifySecName[0].name = `${String.fromCharCode(65 + i-1)}`;
        }
        questionsList.splice(index, 1);
      } else {
        const sectionIndex = sections.findIndex((sec) => sec.id === action.sectionId);
        sections.splice(sectionIndex, 1);
        questionsList[index].sections = sections;
      }
      return { ...state, questions: questionsList };
    }

    case createQuestionPaperActions.DELETE_QUESTION_UNDER_SECTION: {
      const newQuestionsList = JSON.parse(JSON.stringify(state.questions));
      // const filterArray = array.filter((item) => item.id !== idToRemove);
      newQuestionsList.forEach((obj) => {
        const newSec = [...obj.sections]
        const filterArray = newSec[0].questions.filter((item) => item.id !== action.questionId);
        newSec[0].questions = [...filterArray]
        obj.sections = newSec 
      })

      // const newQuestionList = [...state.questions]
      // const newSecArr = [...newQuestionList.sections]
      // const newFinal = [...newSecArr]
      // const filteredFinal = newFinal[0].questions.filter((item) => item.id !== action.questionId)
      // newFinal[0].questions = filteredFinal

      return { ...state, questions: newQuestionsList};
    }

    case createQuestionPaperActions.RESET_STATE: {
      return {...INITIAL_STATE, questionPaperName:''};
    }
    default:
      return state;
  }
}
