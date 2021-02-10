// eslint-disable-next-line import/prefer-default-export
export { default as LevelsChart } from './levels-report';
export { default as CategoryChart } from './category-report';

const x = {
  data: {
    levels: [
      //   list of level objects
    ],
    categories: [
      // list of categories
    ],
    questions: [
      {
        id: 1,
        level: {
          // level Obj here
        },
        category: {
          // category obj here
        },
        is_correct: true, // or false
      },
    ],
  },
};
