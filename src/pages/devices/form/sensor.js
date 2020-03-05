import React from 'react'
import { connect } from 'react-redux'
import {
  Tooltip,
  Table,
  Button,
  message,
  Descriptions,
  Input,
  Form,
  Modal,
  InputNumber,
} from 'antd'

import api from 'services/api'

const { confirm } = Modal

const getFormField = (value, errors) =>
  Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) })

const mapPropsToFields = ({ sensor, formErrors }) => {
  const {
    name,
    inputType,
    inputMin,
    inputMax,
    inputUnit,
    outputType,
    outputMin,
    outputMax,
    outputUnit,
    description,
  } = sensor || {}
  return {
    name: getFormField(name, formErrors.name),
    inputType: getFormField(inputType, formErrors.inputType),
    inputMin: getFormField(inputMin, formErrors.inputMin),
    inputMax: getFormField(inputMax, formErrors.inputMax),
    inputUnit: getFormField(inputUnit, formErrors.inputUnit),
    outputType: getFormField(outputType, formErrors.outputType),
    outputMin: getFormField(outputMin, formErrors.outputMin),
    outputMax: getFormField(outputMax, formErrors.outputMax),
    outputUnit: getFormField(outputUnit, formErrors.outputUnit),
    description: getFormField(description, formErrors.description),
  }
}

const mapStateToProps = ({ sensor }) => ({
  sensor: sensor.current,
  saving: sensor.saving,
  formErrors: sensor.formErrors,
  objectNotFound: sensor.objectNotFound,
})

@connect(mapStateToProps)
@Form.create({ mapPropsToFields })
class SensorForm extends React.Component {
  state = {
    modalVisible: false,
  }

  handleCancel = () => {
    const { dispatch } = this.props
    this.setState({ modalVisible: false }, () => dispatch({ type: 'sensor/CLEAR' }))
  }

  handleConfirm = objectId => {
    const { dispatch, device, form } = this.props
    // const { form } = this.props;
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

  render() {
    const { saving, form, sensor, device } = this.props
    const { getFieldDecorator } = form

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
      <div className="col-lg-12">
        <div className="ant-row">
          <Button className="float-right mb-1" icon="plus" onClick={this.addSensor}>
            Add
          </Button>
        </div>
        <Modal
          visible={modalVisible}
          okButtonProps={{ loading: saving }}
          title={sensor.objectId ? 'Edit Sensor' : 'Add Sensor'}
          okText={sensor.objectId ? 'Edit' : 'Create'}
          onCancel={this.handleCancel}
          onOk={() => this.handleConfirm(sensor.objectId)}
          centered
        >
          <Form layout="vertical">
            <Form.Item
              label="Name"
              extra="Name of the sensor. e.g, Anem. It's used for match with data reported from device via REST, MQTT or whatever."
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the name of the sensor!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="Input Type"
              style={{ marginBottom: 5 }}
              extra="Qualified type of the sensor. e.g, Anemometer, ..."
            >
              {getFieldDecorator('inputType')(
                <Input type="text" style={{ width: 120 }} maxLength={25} />,
              )}
            </Form.Item>
            <Form.Item
              label="Input Range"
              style={{ marginBottom: 5 }}
              extra="Configure input parameters such as min/max values and unit type: e.g, from 5 to 200 Km/h"
            >
              <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>
                From
              </span>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}
              >
                {getFieldDecorator('inputMin')(<InputNumber min={-9999} max={9999} />)}
              </Form.Item>
              <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>To</span>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}
              >
                {getFieldDecorator('inputMax')(<InputNumber min={-9999} max={9999} />)}
              </Form.Item>
              <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>
                Unit
              </span>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}
              >
                {getFieldDecorator('inputUnit')(<Input type="text" maxLength={25} />)}
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="Output Type"
              style={{ marginBottom: 5 }}
              extra="Output type of the sensor. e.g, Voltage."
            >
              {getFieldDecorator('outputType')(
                <Input type="text" style={{ width: 120 }} maxLength={25} />,
              )}
            </Form.Item>
            <Form.Item
              label="Output Range"
              style={{ marginBottom: 5 }}
              extra="Configure output parameters such as min/max values and unit type: e.g, from 0 to 10 Volts (optional configuration)"
            >
              <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>
                From
              </span>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}
              >
                {getFieldDecorator('outputMin')(<InputNumber min={-9999} max={9999} />)}
              </Form.Item>
              <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>To</span>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}
              >
                {getFieldDecorator('outputMax')(<InputNumber min={-9999} max={9999} />)}
              </Form.Item>
              <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>
                Unit
              </span>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}
              >
                {getFieldDecorator('outputUnit')(<Input type="text" maxLength={25} />)}
              </Form.Item>
            </Form.Item>
            <Form.Item label="Observations" style={{ marginBottom: 0 }}>
              {getFieldDecorator('observations')(<Input.TextArea />)}
            </Form.Item>
          </Form>
        </Modal>
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
    )
  }
}

export default SensorForm
