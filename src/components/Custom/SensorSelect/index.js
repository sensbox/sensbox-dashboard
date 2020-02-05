import React from 'react'
import { Select, Spin } from 'antd'
import Sensor from '../../../services/sensor'

const { Option } = Select

class SensorSelect extends React.Component {
  state = {
    data: [],
    fetching: false,
  }

  componentDidMount() {
    const { defaultValue, device } = this.props
    const { objectId: key, name: label } = defaultValue || {}
    this.setState({ value: defaultValue ? { key, label } : undefined })
    this.fetchSensors(device)
  }

  componentDidUpdate(prevProps) {
    const { device, onChange } = this.props
    if (prevProps.device !== device) {
      this.fetchSensors(device, true)
      // trigger on change event in order to clear previous sensor value
      onChange()
    }
  }

  fetchSensors = async (deviceId, clearValue = false) => {
    this.setState({ data: [], fetching: true })
    let data = []
    if (deviceId) {
      const { results } = await Sensor.findByDevice(deviceId)
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
