import React from 'react'
import { connect } from 'react-redux'
import { Table, Button, Form, Input, InputNumber, Tooltip, Popconfirm, Icon } from 'antd'

// import api from 'services/api'
const EditableContext = React.createContext()

const mapStateToProps = ({ resource }) => ({
  current: resource.current,
})

@connect(mapStateToProps)
@Form.create()
class ExtraParamsForm extends React.Component {
  state = {
    newRecord: null,
    editingKey: '',
  }

  constructor(props) {
    super(props)

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
                <Popconfirm
                  title="Are you sure to delete this parameter？"
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  onConfirm={() => this.remove(record.key)}
                >
                  <Button shape="circle" type="danger" icon="delete" disabled={editingKey !== ''} />
                </Popconfirm>
              </Tooltip>
            </span>
          )
        },
      },
    ]

    this.state = { newRecord: null, editingKey: '' }
  }

  dispatchExtraParams = newData => {
    const { current, dispatch } = this.props

    const newParameters = {}
    newData.reduce((prev, { key, value }) => {
      prev[key] = value
      return prev
    }, newParameters)

    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Device',
        objectId: current.objectId,
        data: { parameters: newParameters },
        notify: true,
      },
    })

    this.setState({ newRecord: null })
  }

  parseData = data => {
    return Object.entries(data).map(arr => {
      const key = arr[0]
      const value = arr[1]
      const obj = { key, value }

      return obj
    })
  }

  isEditing = record => {
    const { editingKey } = this.state
    return record.key === editingKey
  }

  cancel = () => {
    this.setState({ editingKey: '', newRecord: null })
  }

  addRow = () => {
    const newRecord = {
      key: 'New Parameter',
      value: `value`,
      isNew: true,
    }

    //  form.getFieldInstance('key').focus()

    this.setState({
      newRecord,
      editingKey: 'New Parameter',
    })
  }

  save = (form, originalKey) => {
    const { device } = this.props
    const { parameters: data = {} } = device
    const newData = this.parseData(data)

    form.validateFields((error, row) => {
      if (error) {
        return
      }

      const exists = newData.findIndex(item => row.key === item.key && row.key !== originalKey) > -1

      const idx = newData.findIndex(item => (originalKey === item.key) === row.key)

      // const isNew = isEditing === -1

      if (exists) {
        form.setFields({
          key: {
            value: row.key,
            errors: [new Error('Parameters must have diferents names.')],
          },
        })
        form.getFieldInstance('key').focus()
        return
      }

      if (idx > -1) newData[idx] = row
      else newData.push(row)

      this.setState({ editingKey: '' })

      this.dispatchExtraParams(newData)
    })
  }

  edit = key => {
    this.setState({ editingKey: key })
  }

  remove = key => {
    const { device } = this.props
    const { parameters: data = {} } = device

    let newData = this.parseData(data)

    newData = newData.filter(el => el.key !== key)

    this.dispatchExtraParams(newData)
  }

  render() {
    const { newRecord } = this.state
    const { form, device } = this.props
    const { parameters: data = {} } = device

    const parsedData = this.parseData(data)

    if (newRecord) parsedData.push(newRecord)

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
            <EditableContext.Provider value={{ form }}>
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
                dataSource={parsedData}
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

class EditableCell extends React.Component {
  getInput = () => {
    const { inputType } = this.props

    if (inputType === 'number') {
      return <InputNumber />
    }
    return <Input />
  }

  renderCell = ({ form }) => {
    const { getFieldDecorator } = form

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
