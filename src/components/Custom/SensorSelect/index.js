import React from 'react'
import { Select, Spin } from 'antd'
import Sensor from 'services/sensor'

const { Option } = Select

class SensorSelect extends React.Component {
  state = {
    data: [],
    fetching: false,
  }

  componentDidMount() {
    const { defaultValue, devices } = this.props
    const { objectId: key, name: label } = defaultValue || {}
    this.setState({ value: defaultValue ? { key, label } : undefined })
    this.fetchSensors(devices)
  }

  componentDidUpdate(prevProps) {
    const { devices, onChange } = this.props
    if (JSON.stringify(prevProps.devices) !== JSON.stringify(devices)) {
      this.fetchSensors(devices, true)
      // trigger on change event in order to clear previous sensor value
      onChange()
    }
  }

  fetchSensors = async (devices, clearValue = false) => {
    this.setState({ data: [], fetching: true })
    let data = []
    if (devices && devices.length > 0) {
      const { results } = await Sensor.findByDevices(devices)
      data = results.map(({ objectId, name }) => ({
        text: `${name}`,
        value: objectId,
      }))
    }

    this.setState(prevState => {
      return { data, fetching: false, value: clearValue ? undefined : prevState.value }
    })
  }

  handleChange = value => {
    const { onChange } = this.props
    const { key: objectId, label: name } = value
    if (onChange) {
      onChange({ objectId, name })
    }
    this.setState({
      fetching: false,
      value,
    })
  }

  render() {
    const { fetching, data, value } = this.state
    return (
      <Select
        labelInValue
        value={value}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={this.handleChange}
        optionLabelProp="label"
        showSearch
        placeholder="Select a sensor"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {data.map(d => (
          <Option key={d.value} label={d.text}>
            {d.text}
          </Option>
        ))}
      </Select>
    )
  }
}

export default SensorSelect
