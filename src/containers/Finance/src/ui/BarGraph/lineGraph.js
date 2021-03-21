import React from 'react'
import { Line } from 'react-chartjs-2'
import './BarGraph.css'

function LineGraph (props) {
  const { labels, data = [], plottedColors, fill } = props.properties
  console.log(fill)
  const state = {

    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: plottedColors,
      borderWidth: 3
    }
    ],

    fill: fill
  }

  return (
    <div>
      <div style={{ width: '100%', boxSizing: 'border-box !important', position: 'relative', paddingLeft: 20 }}>

        <Line
          data={state}
          options={{
            title: {
              display: false,
              fontSize: 18
            },
            legend: {
              display: false,
              position: 'top'
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  color: 'yellow'
                },
                stacked: true
              }],
              xAxes: [{
                scaleLabel: {
                  display: false,
                  fontSize: 16,
                  color: 'green'
                },
                stacked: true
              }]
            }
          }}
        />
      </div>
    </div>
  )
}

export default LineGraph
