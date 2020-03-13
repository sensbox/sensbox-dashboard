import React from 'react'
import { Select, Spin, Avatar } from 'antd'
import Cloud from 'services/cloud'
import Api from 'services/api'

const { Option } = Select

const SearchSettings = {
  Organization: {
    searchField: 'name',
  },
  Zone: {
    searchField: 'name',
  },
}

class EntitySelect extends React.Component {
  state = {
    data: [],
    fetching: false,
  }

  constructor(props) {
    super(props)
    this.lastFetchId = 0
  }

  fetchUser = async value => {
    let data = []
    const results = await Cloud.findUsersByText(value)
    data = results.map(({ userId, profilePhoto, username, firstName, lastName }) => ({
      text: `${firstName} ${lastName} (${username})`,
      profilePhoto,
      value: userId,
      className: 'User',
      type: 'User',
    }))
    return data
  }

  fetchEntities = async (entity, value) => {
    let data = []

    const { results } = await Api.find(entity, {
      searchField: SearchSettings[entity].searchField,
      searchText: value,
      includes: ['defaultRole'],
    })
    data = results
      .filter(el => el.defaultRole && el.defaultRole.name)
      .map(({ [SearchSettings[entity].searchField]: text, defaultRole }) => ({
        text,
        value: defaultRole.name,
        className: entity,
        type: 'Role',
      }))

    return data
  }

  fetchData = async (text, entities) => {
    let data = []
    let users = []
    /** break the reference of the passed value */
    const searchOn = [...entities]

    this.setState({ data: [], fetching: true })

    if (text.length < 3) return this.setState({ data, fetching: false })

    // by default search User
    if (!searchOn || searchOn.some(el => el === 'User')) {
      users = await this.fetchUser(text)
      searchOn.splice(
        searchOn.findIndex(el => el === 'User'),
        1,
      )
    }

    const entitiesResults = await Promise.all(
      searchOn.map(async entity => {
        const results = await this.fetchEntities(entity, text)
        return results
      }),
    )

    data = [...users, ...entitiesResults.flat()]
    this.setState({ data, fetching: false })
    return data
  }

  handleChange = value => {
    const { data } = this.state
    const { value: selectedItems } = this.props
    const newValues = value.map(({ key }) => {
      const exists = selectedItems.find(item => item.key === key)
      if (exists) return exists
      const { value: keyEl, text: label, type, className } = data.find(item => item.value === key)
      return { key: keyEl, label, type, className }
    })

    const { onChange } = this.props
    if (onChange) {
      onChange(newValues)
    }
    this.setState({
      data: [],
      fetching: false,
    })
  }

  render() {
    const { fetching, data } = this.state
    const { value, searchOn = ['User'] } = this.props
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        placeholder="Write names to search..."
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={text => this.fetchData(text, searchOn)}
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
            {d.text} {searchOn.length > 1 && <small className="text-muted">{d.class}</small>}
          </Option>
        ))}
      </Select>
    )
  }
}

export default EntitySelect
