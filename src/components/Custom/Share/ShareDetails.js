import React from 'react'
import { Input, Form, Radio, Icon, Tooltip } from 'antd'
import style from './style.module.scss'

class ShareDetails extends React.Component {
  onChange = (input, row) => {
    const { value, onChange } = this.props
    row.permission = input.target.value
    const newValue = value.map(reg => (reg.id === row.id ? row : reg))

    if (onChange) onChange([...newValue])

    return newValue
  }

  render = () => {
    const { value } = this.props

    return value.map((row, index) => (
      <Form.Item
        label={index === 0 ? 'Share Options' : ''}
        required={false}
        key={row.id || index}
        className={`${style.myRow}`}
      >
        {
          <Input
            placeholder="share options"
            size="small"
            disabled
            style={{ width: '76%', marginRight: 8 }}
            value={`${row.name}`}
          />
        }
        {
          <Radio.Group
            size="small"
            defaultValue="view"
            onChange={el => this.onChange(el, row)}
            buttonStyle="solid"
            value={row.permission}
          >
            <Tooltip title="View">
              <Radio.Button value="view">
                <Icon type="eye" />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Radio.Button value="edit">
                <Icon type="edit" />
              </Radio.Button>
            </Tooltip>
          </Radio.Group>
        }
      </Form.Item>
    ))
  }
}

export default ShareDetails
