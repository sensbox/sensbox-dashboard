import React from 'react'
import { Input, Form, Radio, Icon, Tooltip } from 'antd'
import style from './style.module.scss'

class ShareDetails extends React.Component {
  onChange = (input, row) => {
    const { value, onChange } = this.props
    row.permission = input.target.value

    let newValues

    if (row.type === 'Role') {
      const roles = value.roles.map(reg => (reg.id === row.id ? row : reg))
      newValues = { users: value.users, roles }
    } else if (row.type === 'User') {
      const users = value.users.map(reg => (reg.id === row.id ? row : reg))
      newValues = { roles: value.roles, users }
    }

    if (onChange) onChange(newValues)

    return newValues
  }

  render = () => {
    const { value, rowsDetailsCount } = this.props
    const { users = [], roles = [] } = value

    const elems = [
      ...users.map(el => ({ ...el, type: 'User' })),
      ...roles.map(el => ({ ...el, type: 'Role' })),
    ]

    return (
      elems.length > 0 && (
        <div style={{ maxHeight: rowsDetailsCount * 40, overflowY: 'scroll' }}>
          <span className="ant-col ant-form-item-label">Share Options</span>
          {elems.map((row, index) => (
            <Form.Item required={false} key={row.id || index} className={`${style.myRow}`}>
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
          ))}
        </div>
      )
    )
  }
}

export default ShareDetails
