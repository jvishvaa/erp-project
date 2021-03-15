import React from 'react'
import { Bar } from 'react-chartjs-2'
import './BarGraph.css'

function BarGraph (props) {
  const { labels, data = [], titleXaxis, titleYaxis, mainTitle, isMultiple, totalList = [], completedList = [], showLegend = false } = props.properties
  const state = {
    multiLine: {
      labels: labels,
      datasets: [{
        label: 'Completed Students',
        backgroundColor: '#b2dfdb',
        data: completedList
      }, {
        label: 'Total Students',
        backgroundColor: '#ff6384',
        data: totalList
      }]
    },
    single: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#e74c3c',
          '#e67e22',
          '#27ae60',
          '#9b59b6',
          '#3498db',
          '#7f8c8d'
        ]
      }
      ]
    }
  }

  return (
    <div>
      <div style={{ width: '100%', boxSizing: 'border-box !important', position: 'relative', paddingLeft: 20 }}>
        <div className='students__title__YAxis'>{titleYaxis}</div>
        <Bar
          data={isMultiple ? state.multiLine : state.single}
          options={{
            title: {
              display: !!mainTitle,
              text: mainTitle,
              fontSize: 18
            },
            legend: {
              display: showLegend,
              position: 'top'
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function (value) { if (value % 1 === 0) { return value } }
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: !!mainTitle,
                  labelString: titleXaxis,
                  fontSize: 16
                }
              }]
            }
          }}
        />
      </div>
    </div>
  )
}

export default BarGraph
