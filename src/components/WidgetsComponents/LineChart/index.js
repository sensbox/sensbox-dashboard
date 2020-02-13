import React from 'react'
import { Line } from 'react-chartjs-2'
import cloudApi from '../../../services/cloud'

class LineChart extends React.PureComponent {
  static defaultProps = {
    series: [
      {
        name: 'Sensor',
        color: '#1f77b4',
      },
    ],
  }

  state = {
    lastPayload: [],
    seriesData: [],
  }

  constructor(props) {
    super(props)
    this.generateDatasets = this.generateDatasets.bind(this)
    this.processOptions = this.processOptions.bind(this)
    this.fetchDataFromCloud()
  }

  componentDidUpdate(prevProps) {
    const { series: prevSeries } = prevProps
    const { series } = this.props
    // test if series changed
    if (JSON.stringify(prevSeries) !== JSON.stringify(series)) {
      this.fetchDataFromCloud()
    }
  }

  async fetchDataFromCloud() {
    const { series } = this.props
    const { lastPayload } = this.state
    const payload = series
      .map(serie => {
        if (serie.devices && serie.sensor && serie.aggregation) {
          return {
            id: serie.id,
            devices: serie.devices.map(device => device.uuid),
            sensor: serie.sensor.name,
            aggregation: serie.aggregation,
          }
        }
        return false
      })
      .filter(serie => serie)

    if (payload.length) {
      if (JSON.stringify(payload) !== JSON.stringify(lastPayload)) {
        const seriesData = await cloudApi.metricsStoreFetchSeries(payload)
        this.setState({ seriesData, lastPayload: payload })
      }
    }
  }

  generateDatasets() {
    // eslint-disable-next-line no-debugger
    // debugger
    const { series } = this.props
    const { seriesData } = this.state

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

  processOptions() {
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
    const { height } = this.props
    // console.log('height', height)

    return (
      <div style={{ height: `${height - 70}px` }}>
        <Line
          data={{
            labels: '',
            datasets: this.generateDatasets(),
          }}
          options={this.processOptions()}
        />
      </div>
    )
  }
}

export default LineChart
