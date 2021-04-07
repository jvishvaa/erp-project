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
      // console.log(state.questions,"===");
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
        console.log('handle add',questionsList);
        for(let i = index;i<questionsList.length;i++) {
          const {sections:modifySecName} = questionsList[i];
          modifySecName[0].name = `${String.fromCharCode(65 + i-1)}`;
        }
        questionsList.splice(index, 1);
      } else {
        const sectionIndex = sections.findIndex((sec) => sec.id === action.sectionId);
        console.log('section name!!! ', sections[sectionIndex]);
        sections.splice(sectionIndex, 1);
        questionsList[index].sections = sections;
      }
      return { ...state, questions: questionsList };
    }

    case createQuestionPaperActions.RESET_STATE: {
      return {...INITIAL_STATE, questionPaperName:''};
    }
    default:
      return state;
  }
}
