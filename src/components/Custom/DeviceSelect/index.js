import React from 'react'
import { Select, Spin } from 'antd'
import Device from 'services/device'

const { Option } = Select

class DeviceSelect extends React.Component {
  state = {
    data: [],
    fetching: false,
  }

  constructor(props) {
    super(props)
    this.lastFetchId = 0
  }

  fetchDevice = async value => {
    this.setState({ data: [], fetching: true })
    let data = []
    if (value.length > 2) {
      const { results } = await Device.search(value)
      data = results.map(({ objectId, uuid }) => ({
        text: `${uuid}`,
        value: objectId,
      }))
    }
    this.setState({ data, fetching: false })
  }

  handleChange = value => {
    const { onChange } = this.props
    const devices = value.map(({ key, label }) => ({ objectId: key, uuid: label }))
    if (onChange) {
      onChange(devices)
    }
    this.setState({
      data: [],
      fetching: false,
    })
  }

  render() {
    const { fetching, data } = this.state
    const { defaultValue } = this.props
    const value = defaultValue
      ? defaultValue.map(({ objectId, uuid }) => ({ key: objectId, label: uuid }))
      : undefined

    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        placeholder="Uuid or description to search..."
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchDevice}
        onChange={this.handleChange}
        style={{ width: '100%' }}
        optionLabelProp="label"
        showArrow={false}
        showSearch
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

export default DeviceSelect
