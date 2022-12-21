import { createQuestionPaperActions } from '../actions';

const INITIAL_STATE = {
  questions: [],
  selectedAcademic: '',
  selectedBranch: '',
  erpCategory : '',
  selectedGrade: '',
  selectedSubject: [],
  selectedLevel: '',
  questionPaperName: '',
  isFetched: false, 
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case createQuestionPaperActions.ADD_NEW_QUESTION:
      return { ...state, questions: [...state.questions, action.data] };

    case createQuestionPaperActions.ADD_QUESTION_TO_SECTION:
      const questionsList = JSON.parse(JSON.stringify(state.questions));
      const index = questionsList.findIndex((q) => q.id === action.questionId);
      const { sections } = questionsList[index];
      const sectionIndex = sections?.findIndex((sec) => sec.name === action.section);
      sections[sectionIndex].questions.push(action.data);
      questionsList[index].sections = sections;
      return { ...state, questions: questionsList };

      case createQuestionPaperActions.ADD_MARKS_TO_SECTION:{
        const questionsList = JSON.parse(JSON.stringify(state.questions));
        const index = questionsList.findIndex((q) => q.id === action.questionId);
        const { sections } = questionsList[index];
        const sectionIndex = sections?.findIndex((sec) => sec.name === action.section);
        sections[sectionIndex].test_marks = action.data;
        questionsList[index].sections = sections;
        return { ...state, questions: questionsList };
      }
      
      case createQuestionPaperActions.ADD_OPTIONAL_QUESTION:{
        const questionsList = JSON.parse(JSON.stringify(state.questions));
        const index = questionsList.findIndex((q) => q.id === action.questionId);
        const { sections } = questionsList[index];
        const sectionIndex = sections?.findIndex((sec) => sec.name === action.section);
        sections[sectionIndex].mandatory_questions = action.data;
        questionsList[index].sections = sections;
        return { ...state, questions: questionsList };
      }
      


      case createQuestionPaperActions.ADD_INSTRUCTION_TO_SECTION:{
      const questions = JSON.parse(JSON.stringify(state.questions));
      const index = questions.findIndex((q) => q.id === action.questionId);
      const { sections } = questions[index];
      const sectionindex = sections?.findIndex((sec) => sec.name === action.section);
      sections[sectionindex].instruction = action.data;
      questions[index].sections = sections;
      return { ...state, questions: questions };
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
        for (let i = index; i < questionsList.length; i++) {
          const { sections: modifySecName } = questionsList[i];
          modifySecName[0].name = `${String.fromCharCode(65 + i - 1)}`;
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
        const newSec = [...obj.sections];
        const filterArray = newSec[0].questions.filter(
          (item) => item.id !== action.questionId
        );
        newSec[0].questions = [...filterArray];
        obj.sections = newSec;
      });

      // const newQuestionList = [...state.questions]
      // const newSecArr = [...newQuestionList.sections]
      // const newFinal = [...newSecArr]
      // const filteredFinal = newFinal[0].questions.filter((item) => item.id !== action.questionId)
      // newFinal[0].questions = filteredFinal

      return { ...state, questions: newQuestionsList };
    }

    case createQuestionPaperActions.RESET_STATE: {
      return { ...INITIAL_STATE, questionPaperName: '' };
    }

    case createQuestionPaperActions.SET_IS_FETCH: {
      return { ...INITIAL_STATE, isFetched: action.isFetched };
    }

    default:
      return state;
  }
}
