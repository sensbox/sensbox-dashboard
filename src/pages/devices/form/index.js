import React from 'react'
import { connect } from 'react-redux'
import { Tooltip, Table, Button, message, Descriptions, Modal, Tabs, Icon } from 'antd'
import DeviceForm from './device'
import SensorForm from './sensor'

const { confirm } = Modal
const { TabPane } = Tabs;


@connect()
class DeviceIndex extends React.Component {
  state = {
    modalVisible: false,
  }

  handleCancel = () => {
    const { dispatch } = this.props
    this.setState({ modalVisible: false }, () => dispatch({ type: 'sensor/CLEAR' }))
  }

  handleConfirm = objectId => {
    const { dispatch, device } = this.props
    const { form } = this.formRef.props
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          data: {
            device: api.createPointer('Device', device.objectId),
            ...values,
          },
          successCallback: () => {
            form.resetFields()
            this.setState({ modalVisible: false })
            // form.getFieldInstance('name').focus();
          },
          notify: true,
        }
        dispatch({
          type: !objectId ? 'sensor/CREATE' : 'sensor/UPDATE',
          payload: !objectId ? payload : Object.assign({}, payload, { objectId }),
        })
      } else {
        const firstFieldWithError = Object.keys(err).pop()
        form.getFieldInstance(firstFieldWithError).focus()
        message.error('Please check all form fields.', 2.5)
      }
    })
  }

  addSensor = () => this.setState({ modalVisible: true })

  editSensor = sensor => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/GET_CURRENT',
      payload: {
        objectId: sensor.objectId,
        callback: () => this.setState({ modalVisible: true }),
      },
    })
  }

  removeSensor = sensor => {
    const { dispatch, device } = this.props
    confirm({
      title: 'Are you sure delete this sensor?',
      content: 'All associated data such as dashboard graphs that contains it will be deleted too',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'sensor/REMOVE',
          payload: {
            objectId: sensor.objectId,
            device,
          },
        })
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  render() {
    const {device } = this.props

    const { modalVisible } = this.state

    const sensorsColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Technical Specifications',
        key: 'techSpecs',
        sorter: false,
        render: row => {
          const {
            inputType = '-',
            inputMin = '-',
            inputMax = '-',
            inputUnit = '-',
            outputType = '-',
            outputMin = '-',
            outputMax = '-',
            outputUnit = '-',
          } = row
          return (
            <Descriptions
              size="small"
              bordered
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="Input">
                Type: {`${inputType}`}
                <br />
                From: {`${inputMin}`}
                <br />
                To: {`${inputMax}`}
                <br />
                Unit: {`${inputUnit}`}
              </Descriptions.Item>
              <Descriptions.Item label="Output" span={2}>
                Type: {`${outputType}`}
                <br />
                From: {`${outputMin}`}
                <br />
                To: {`${outputMax}`}
                <br />
                Unit: {`${outputUnit}`}
              </Descriptions.Item>
            </Descriptions>
          )
        },
      },
      {
        key: 'action',
        render: row => (
          <>
            <Tooltip title="Edit Sensor">
              <Button
                shape="circle"
                icon="edit"
                className="mr-1"
                onClick={() => this.editSensor(row)}
              />
            </Tooltip>
            <Tooltip title="Remove Sensor">
              <Button
                shape="circle"
                type="danger"
                icon="delete"
                onClick={() => this.removeSensor(row)}
              />
            </Tooltip>
          </>
        ),
      },
    ]

    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span className="h5"> <Icon type="alert" /> Device Info. </span>} key="1">
            <DeviceForm />
          </TabPane>
          {device && device.objectId && (
            <TabPane tab={<span className="h5"> <Icon type="sliders" /> Sensors </span>} key="2">
              <div className="col-lg-12">
                <div className="ant-row">
                  <Button className="float-right mb-1" icon="plus" onClick={this.addSensor}>
                    Add
                  </Button>
                </div>
                <SensorForm
                  wrappedComponentRef={this.saveFormRef}
                  visible={modalVisible}
                  onCancel={this.handleCancel}
                  onConfirm={this.handleConfirm}
                />
                <div className="row">
                  <div className="col-lg-12">
                    <Table
                      rowKey="objectId"
                      className="utils__scrollTable"
                      scroll={{ x: '100%' }}
                      columns={sensorsColumns}
                      dataSource={device.sensors}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>
    )
  }
}
export default DeviceIndex
