import React from 'react'
import { connect } from 'react-redux'
import { Table, Button, Form, Input, InputNumber, Tooltip } from 'antd'

// import api from 'services/api'
const EditableContext = React.createContext()

class EditableCell extends React.Component {
  getInput = () => {
    const { inputType } = this.props

    if (inputType === 'number') {
      return <InputNumber />
    }
    return <Input />
  }

  renderCell = ({ form, errors }) => {
    const { getFieldDecorator } = form

    console.log(errors)

    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
  }
}

@connect()
@Form.create()
class ExtraParamsForm extends React.Component {
  state = {
    data: [],
    editingKey: '',
    rowCount: 0,
    errors: {},
  }

  constructor(props) {
    super(props)

    const { device } = this.props
    const { parameters: data = [] } = device

    this.state = { data, editingKey: '', rowCount: data.length, errors: {} }

    this.columns = [
      {
        title: 'Name',
        dataIndex: 'key',
        inputType: 'text',
        sorter: true,
        editable: true,
      },
      {
        title: 'Value',
        dataIndex: 'value',
        inputType: 'text',
        sorter: false,
        editable: true,
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        width: '15%',
        render: (text, record) => {
          const { editingKey } = this.state
          const editable = this.isEditing(record)
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {({ form }) => (
                  <Tooltip title="Save Parameter">
                    <Button
                      shape="circle"
                      icon="save"
                      // type="primary"
                      className="mr-1"
                      onClick={() => this.save(form, record.key)}
                    />
                  </Tooltip>
                )}
              </EditableContext.Consumer>
              <Tooltip title="Cancel">
                <Button
                  shape="circle"
                  type="danger"
                  icon="close-circle"
                  onClick={() => this.cancel(record)}
                />
              </Tooltip>
            </span>
          ) : (
            <span>
              <Tooltip title="Edit Parameter">
                <Button
                  shape="circle"
                  icon="edit"
                  className="mr-1"
                  disabled={editingKey !== ''}
                  onClick={() => this.edit(record.key)}
                />
              </Tooltip>
              <Tooltip title="Remove Parameter">
                <Button
                  shape="circle"
                  type="danger"
                  icon="delete"
                  disabled={editingKey !== ''}
                  onClick={() => this.remove(record)}
                />
              </Tooltip>
            </span>
          )
        },
      },
    ]
  }

  isEditing = record => {
    const { editingKey } = this.state
    return record.key === editingKey
  }

  cancel = () => {
    const { data } = this.state
    this.setState({ editingKey: '', data: data.filter(el => el.isNew !== true), errors: {} })
  }

  addRow = () => {
    const { device } = this.props
    let { rowCount } = this.state

    const { parameters = [] } = device
    const newData = {
      key: 'New Parameter',
      value: `value`,
      isNew: true,
    }
    this.setState({
      data: [...parameters, newData],
      rowCount: (rowCount += 1),
      editingKey: 'New Parameter',
    })
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return
      }

      const { data } = this.state
      const newData = [...data]

      const index = newData.findIndex(item => key === item.key)

      if (index > -1) {
        this.setState({ errors: { key: ['La clave debe ser unica'] } })
      } else {
        newData.push(row)
        this.setState({ data: newData, editingKey: '', errors: {} })
      }
    })
  }

  edit(key) {
    this.setState({ editingKey: key })
  }

  render() {
    const { data, errors } = this.state
    const { form } = this.props

    const components = {
      body: {
        cell: EditableCell,
      },
    }

    const cols = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      }
    })

    return (
      <div className="col-lg-12">
        <div className="ant-row">
          <Button className="float-right mb-1" icon="plus" onClick={this.addRow}>
            Add
          </Button>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <EditableContext.Provider value={{ form, errors }}>
              <Table
                onRow={() => {
                  return {
                    onKeyUp: event => {
                      if (event.keyCode === 27) this.cancel()
                    },
                  }
                }}
                rowKey="key"
                size="small"
                className="utils__scrollTable"
                scroll={{ x: '100%' }}
                components={components}
                bordered
                dataSource={data}
                columns={cols}
                rowClassName="editable-row"
                pagination={false}
              />
            </EditableContext.Provider>
          </div>
        </div>
      </div>
    )
  }
}

export default ExtraParamsForm
