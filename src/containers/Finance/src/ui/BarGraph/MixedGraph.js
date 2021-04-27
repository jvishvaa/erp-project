import React from 'react'
import { Line } from 'react-chartjs-2'
import './BarGraph.css'

function MixedGraph (props) {
  const { Facebooklabels, data1 = [], data2 = [], plottedColors, fbClicks, fbImpressions } = props.properties
  const state = {
    type: 'line',
    datasets: [{

      data: data1,
      borderColor: fbClicks ? '#7DD8FB' : '#3B5998',

      backgroundColor: plottedColors,
      fill: false

    },
    {
      data: data2,
      type: 'line',
      borderColor: fbImpressions ? '#3B5998' : '#FBBC05',

      backgroundColor: plottedColors,
      fill: false

    }

    ],
    labels: Facebooklabels,
    fill: false,
    backgroundColor: plottedColors,
    borderColor: '#3B5998'

  }

  return (
    <div>
      <div style={{ width: '100%', boxSizing: 'border-box !important', position: 'relative', paddingLeft: 20 }}>
        <Line

          data={state}
          options={{
            responsive: true,
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

export default MixedGraph
