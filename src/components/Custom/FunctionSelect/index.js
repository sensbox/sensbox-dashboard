import React from 'react'
import { Select, Spin } from 'antd'
import Config from 'services/config'

const { Option } = Select

class FunctionSelect extends React.Component {
  state = {
    data: [],
    fetching: false,
  }

  componentDidMount() {
    this.mounted = true
    const { defaultValue } = this.props
    const selectedOption = defaultValue ? { key: defaultValue, label: defaultValue } : undefined
    this.setState({ value: selectedOption })
    this.fetchInfluxFunctions()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  fetchInfluxFunctions = async () => {
    this.setState({ data: [], fetching: true })
    let data = []
    const functions = await Config.getInfluxFunctions()
    data = functions.map(item => ({
      text: item,
      value: item,
    }))

    // prevent set state on unmounted component
    if (this.mounted) this.setState({ data, fetching: false })
  }

  handleChange = value => {
    const { onChange } = this.props
    const { label } = value
    if (onChange) {
      onChange(label)
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
        showSearch
        labelInValue
        value={value}
        style={{ width: 200 }}
        placeholder="Select a function"
        optionFilterProp="children"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={this.handleChange}
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

export default FunctionSelect
