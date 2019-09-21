import React from 'react'
import { connect } from 'react-redux'
import { Input, Form, Modal, InputNumber } from 'antd'

const getFormField = (value, errors) => Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) });

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
  } = sensor || {};
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
  objectNotFound: sensor.objectNotFound
})

@connect(mapStateToProps)
@Form.create({ mapPropsToFields })
class SensorForm extends React.Component {
  render() {
    const { visible, onCancel, onConfirm, form, sensor } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={sensor.objectId ? 'Edit Sensor' : 'Add Sensor'}
        okText={sensor.objectId ? 'Edit' : 'Create'}
        onCancel={onCancel}
        onOk={() => onConfirm(sensor.objectId)}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Name" extra="Name of the sensor. e.g, Anem. It's used for match with data reported from device via REST, MQTT or whatever.">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input the name of the sensor!' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Input Type" style={{ marginBottom: 5 }} extra="Qualified type of the sensor. e.g, Anemometer, ...">
            {getFieldDecorator('inputType')(<Input type="text" style={{ width: 120 }} maxLength={25} />)}
          </Form.Item>
          <Form.Item label="Input Range" style={{ marginBottom: 5 }} extra="Configure input parameters such as min/max values and unit type: e.g, from 5 to 200 Km/h">
            <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>From</span>
            <Form.Item style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}>
              {getFieldDecorator('inputMin')(<InputNumber min={-9999} max={9999} />)}
            </Form.Item>
            <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>To</span>
            <Form.Item style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}>
              {getFieldDecorator('inputMax')(<InputNumber min={-9999} max={9999} />)} 
            </Form.Item>
            <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>Unit</span>
            <Form.Item style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}>
              {getFieldDecorator('inputUnit')(<Input type="text" maxLength={25} />)}
            </Form.Item>
          </Form.Item>
          <Form.Item label="Output Type" style={{ marginBottom: 5 }} extra="Output type of the sensor. e.g, Voltage.">
            {getFieldDecorator('outputType')(<Input type="text" style={{ width: 120 }} maxLength={25} />)}
          </Form.Item>
          <Form.Item label="Output Range" style={{ marginBottom: 5 }} extra="Configure output parameters such as min/max values and unit type: e.g, from 0 to 10 Volts (optional configuration)">
            <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>From</span>
            <Form.Item style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}>
              {getFieldDecorator('outputMin')(<InputNumber min={-9999} max={9999} />)}
            </Form.Item>
            <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>To</span>
            <Form.Item style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}>
              {getFieldDecorator('outputMax')(<InputNumber min={-9999} max={9999} />)} 
            </Form.Item>
            <span style={{ display: 'inline-block', width: '40px', textAlign: 'left' }}>Unit</span>
            <Form.Item style={{ display: 'inline-block', width: 'calc(25% - 12px)', marginBottom: 0 }}>
              {getFieldDecorator('outputUnit')(<Input type="text" maxLength={25} />)}
            </Form.Item>
          </Form.Item>
          <Form.Item label="Observations" style={{ marginBottom: 0 }}>
            {getFieldDecorator('observations')(<Input.TextArea />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default SensorForm;