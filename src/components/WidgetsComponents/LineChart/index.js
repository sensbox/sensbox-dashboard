import React from 'react'
import { Line } from 'react-chartjs-2'

const generateRandomData = () => {
  const data = []
  const today = new Date()
  for (let i = 0; i < 100; i += 1) {
    const y = Math.floor(Math.random() * (100 - 50 + 1) + 50)
    data.push({
      x: today.getTime() - i * 60000000,
      y,
    })
  }
  return data
}

class LineChart extends React.Component {
  static defaultProps = {
    data: generateRandomData(),
  }

  render() {
    const { height, data } = this.props
    // console.log('height', height)

    return (
      <div style={{ height: `${height - 70}px` }}>
        <Line
          data={{
            labels: '',
            datasets: [
              {
                label: 'sensor',
                data,
                backgroundColor: '#eaeaea69',
                borderColor: '#1f77b4',
                borderWidth: 2,
                spanGaps: true,
                pointRadius: 0.5,
                pointHoverRadius: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: 'bottom',
            },
            animation: {
              duration: 0, // general animation time
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    min: 0,
                    max: 100,
                  },
                },
              ],
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'day',
                  },
                },
              ],
            },
          }}
        />
      </div>
    )
  }
}

export default LineChart
