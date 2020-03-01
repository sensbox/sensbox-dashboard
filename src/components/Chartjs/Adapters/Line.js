import React from 'react'
import { Line } from 'react-chartjs-2'

class LineAdapter extends React.PureComponent {
  static defaultProps = {
    series: [],
    axes: [],
    data: [],
    builderMode: false,
  }

  constructor(props) {
    super(props)
    this.getData = this.getData.bind(this)
    this.getOptions = this.getOptions.bind(this)
  }

  getData() {
    const { series, data: seriesData } = this.props

    const datasets = series.map(serie => {
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
        yAxisID: serie.axisId,
      }
    })

    return {
      labels: '',
      datasets,
    }
  }

  getOptions() {
    const { series, axes } = this.props
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
        yAxes: axes.map(axis => ({
          scaleLabel: {
            display: !!axis.label,
            labelString: axis.label,
          },
          position: axis.position,
          ticks: {
            min: axis.min != null ? parseInt(axis.min, 10) : undefined,
            max: axis.max != null ? parseInt(axis.max, 10) : undefined,
          },
          id: axis.id,
        })),
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
    const { builderMode } = this.props
    return <Line data={this.getData()} options={this.getOptions()} redraw={builderMode} />
  }
}

export default LineAdapter
