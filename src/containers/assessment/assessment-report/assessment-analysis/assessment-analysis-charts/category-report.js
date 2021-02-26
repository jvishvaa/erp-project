import React, { useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { AssessmentAnalysisContext } from '../assessment-analysis-context';

const CategoryChart = () => {
  const { assessmentQuestionAnalysis = {} } = useContext(AssessmentAnalysisContext);
  const { data: { categories = [], questions = [] } = {} } =
    assessmentQuestionAnalysis || {};

  const categoriesObj = {};
  categories.forEach((item) => {
    categoriesObj[String(item.id)] = item.category_name;
  });
  const categoryQuestions = {};
  questions.forEach((question) => {
    const questionCatId = question.question_categories;
    const categoryLabel = categoriesObj[String(questionCatId)];
    const catQuesArray = categoryQuestions[categoryLabel] || [];
    catQuesArray.push(question);
    categoryQuestions[categoryLabel] = catQuesArray;
  });

  const configObj = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'column',
      height: 368,
      animation: {
        duration: 10,
      },
    },
    title: {
      text:
        '<h5 style="margin:0;">Category <small style="font-weight: normal;">Analysis</small></h5>',
      align: 'left',
      style: { color: '#014B7E' },
      useHTML: true,
    },
    xAxis: {
      // categories: ['Knowledge', 'Understanding', 'Application', 'Analysis'],
      categories: Object.values(categoriesObj),
      labels: {
        style: {
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#014b7e',
          margin: '10px 0px 0px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.04,
        borderWidth: 0,
        borderRadius: '4%',
      },
      series: {
        dataLabels: {
          color: '#FFFFFF',
          y: 20,
          style: {
            fontWeight: 'bold',
          },
          states: {
            hover: {
              enabled: true,
            },
          },
          marker: {
            symbol: 'square',
          },
        },
        point: {
          events: {
            mouseOver() {
              // eslint-disable-next-line react/no-this-in-sfc
              this.series.data.forEach((p) => {
                p.update(
                  {
                    dataLabels: {
                      enabled: false,
                    },
                  },
                  false,
                  false
                );
              });

              // eslint-disable-next-line react/no-this-in-sfc
              this.update({ dataLabels: { enabled: true } });
            },
          },
        },
      },
    },
    legend: {
      align: 'left',
      style: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#014b7e',
        margin: '10px 0px 0px 20px',
        display: 'flex',
        justifyContent: 'space-between',
      },
    },

    series: [
      {
        name: 'Total Questions',
        color: '#5996FC',
        // data: [10, 20, 30, 1],
        data: Object.values(categoriesObj).map((category) => {
          const { [category]: questionsArray = null } = categoryQuestions || {};
          if (questionsArray === null) return null;
          // questionsArray = questionsArray.filter(
          //   (question) => question.is_correct == true
          // );
          return questionsArray.length;
        }),
      },
      {
        name: 'Correct',
        color: '#F94E40',
        // data: [4, 18, 15, 10],
        data: Object.values(categoriesObj).map((category) => {
          let { [category]: questionsArray = null } = categoryQuestions || {};

          if (questionsArray === null) return null;
          questionsArray = questionsArray.filter(
            (question) => question.is_correct === true
          );
          return questionsArray.length;
        }),
      },
      {
        name: 'Wrong',
        color: '#EEA908',
        // data: [6, 12, 15, 30],
        data: Object.values(categoriesObj).map((category) => {
          let { [category]: questionsArray = null } = categoryQuestions || {};
          if (questionsArray === null) return null;

          questionsArray = questionsArray.filter(
            (question) => question.is_correct === false
          );
          return questionsArray.length;
        }),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={configObj} />;
};
export default CategoryChart;
