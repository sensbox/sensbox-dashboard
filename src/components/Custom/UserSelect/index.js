import React from 'react'
import { Select, Spin, Avatar } from 'antd'
import Cloud from '../../../services/cloud'

const { Option } = Select

class UserSelect extends React.Component {
  state = {
    data: [],
    fetching: false,
  }

  constructor(props) {
    super(props)
    this.lastFetchId = 0
  }

  fetchUser = async value => {
    this.setState({ data: [], fetching: true })
    let data = []
    if (value.length > 2) {
      const results = await Cloud.findUsersByText(value)
      data = results.map(({ userId, profilePhoto, username, firstName, lastName }) => ({
        text: `${firstName} ${lastName} (${username})`,
        profilePhoto,
        value: userId,
      }))
    }
    this.setState({ data, fetching: false })
  }

  handleChange = value => {
    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
    this.setState({
      data: [],
      fetching: false,
    })
  }

  render() {
    const { fetching, data } = this.state
    const { value } = this.props
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        placeholder="Write names to search..."
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
        optionLabelProp="label"
      >
        {data.map(d => (
          <Option key={d.value} label={d.text}>
            <Avatar
              shape="square"
              size="small"
              icon="user"
              src={d.profilePhoto}
              style={{ marginRight: 6 }}
            />
            {d.text}
          </Option>
        ))}
      </Select>
    )
  }
}

export default UserSelect
