import React from 'react'
import { Line } from 'react-chartjs-2'

class LineAdapter extends React.PureComponent {
  static defaultProps = {
    series: [],
    data: [],
  }

  constructor(props) {
    super(props)
    this.getDatasets = this.getDatasets.bind(this)
    this.getOptions = this.getOptions.bind(this)
  }

  getDatasets() {
    const { series, data: seriesData } = this.props

    return series.map(serie => {
      const hasSensor = serie.sensor
      let data = []

      if (hasSensor) {
        // find in response same index as serie
        const serieData = seriesData.find(s => s.id === serie.id)
        if (serieData && serieData.rows && serieData.rows.length) {
          // eslint-disable-next-line prefer-destructuring
          data = serieData.rows.map(r => ({ x: r.time, y: r.value }))
        }
      }

      return {
        label: serie.name,
        key: serie.id,
        data,
        backgroundColor: '#eaeaea69',
        borderColor: serie.color,
        borderWidth: 2,
        spanGaps: true,
        pointRadius: 0.5,
        pointHoverRadius: 2,
      }
    })
  }

  getOptions() {
    const { series } = this.props
    const display = series.length > 1
    return {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display,
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
    }
  }

  render() {
    return (
      <Line
        data={{
          labels: '',
          datasets: this.getDatasets(),
        }}
        options={this.getOptions()}
      />
    )
  }
}

export default LineAdapter
