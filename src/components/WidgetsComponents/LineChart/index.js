import React from 'react'
import cloudApi from 'services/cloud'
import LineAdapter from 'components/Chartjs/Adapters/Line'

class LineChart extends React.Component {
  // static defaultProps = {
  //   series: [
  //     {
  //       name: 'Sensor',
  //       color: '#1f77b4',
  //     },
  //   ],
  // }

  state = {
    lastPayload: [],
    seriesData: [],
  }

  componentDidMount() {
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

  render() {
    const { height, series } = this.props
    const { seriesData } = this.state

    return (
      <div style={{ height: `${height - 70}px` }}>
        <LineAdapter series={series} data={seriesData} />
      </div>
    )
  }
}

export default LineChart
