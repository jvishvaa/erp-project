
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import './BarGraph.css'

function PieChart (props) {
  const { labels, data } = props.properties

  const state = {
    labels: labels,

    datasets: [{
      data: data,
      backgroundColor: [
        '#e74c3c',
        '#e67e22',
        '#27ae60'

      ]
    }
    ]
  }
  return (
    <div>

      <Doughnut
        data={state}
        height='100%'
      />

    </div>
  )
}
export default PieChart
