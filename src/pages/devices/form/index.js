import React from 'react'
import { connect } from 'react-redux'

import { Tooltip, Table, Input, Button, Form, Checkbox, message, Descriptions } from 'antd'
import { Link } from "react-router-dom";
import SensorForm from './sensor';
import api from '../../../services/api';

const FormItem = Form.Item;
// const { Option } = Select;
// const { TextArea } = Input;

const getFormField = (value, errors) => Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) });

const mapPropsToFields = ({ device, errors }) => {
  const { uuid, description, active } = device || {};
  return {
    uuid: getFormField(uuid, errors.uuid),
    description: getFormField(description, errors.description),
    active: getFormField(active, errors.active),
  }
}

@Form.create({ mapPropsToFields })
@connect()
class DeviceForm extends React.Component {

  state = {
    modalVisible: false,
  }

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    this.setState({ modalVisible: false }, () => dispatch({ type: 'sensor/CLEAR' }));
  };

  handleConfirm = (objectId) => {
    const { dispatch, device } = this.props;
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          data: { 
            device: api.createPointer("Device", device.objectId),
            ...values,
          },
          successCallback: () => {
            form.resetFields();
            this.setState({ modalVisible: false });
            // form.getFieldInstance('name').focus();
          },
          notify: true
        }
        dispatch({
          type: !objectId ? 'sensor/CREATE' : 'sensor/UPDATE',
          payload: !objectId ? payload : Object.assign({}, payload, { objectId})
        });
      } else {
        const firstFieldWithError = Object.keys(err).pop();
        form.getFieldInstance(firstFieldWithError).focus();
        message.error('Please check all form fields.', 2.5)
      }
    });
  };

  addSensor = () => this.setState({ modalVisible: true });

  editSensor = (sensor) => {
    const { dispatch } = this.props;
    console.log(sensor);
    dispatch({
      type: 'sensor/GET_CURRENT',
      payload: {
        objectId: sensor.objectId,
        callback: () => this.setState({ modalVisible: true }),
      }
    });
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  save() {
    const { form, saveAction } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        saveAction(values);
        form.getFieldInstance('uuid').focus();
      } else {
        const firstFieldWithError = Object.keys(err).pop();
        form.getFieldInstance(firstFieldWithError).focus();
        message.error('Please check all form fields.', 2.5)
      }
    });
  }


  render() {
    const {
      form,
      disableSaveButton,
      device,
    } = this.props
    
    const { modalVisible } = this.state;

    const sensorsColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
      }, {
        title: 'Technical Specifications',
        key: 'techSpecs',
        sorter: false,
        render: (row) => (
          <Descriptions
            size="small"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label={row.inputType}>
              From: {`${row.inputMin}`}
              <br />
              To: {`${row.inputMax}`}
              <br />
              Unit: {`${row.inputUnit}`}
            </Descriptions.Item>
            <Descriptions.Item label={row.outputType} span={2}>
              From: {`${row.outputMin}`}
              <br />
              To: {`${row.outputMax}`}
              <br />
              Unit: {`${row.outputUnit}`}
            </Descriptions.Item>
          </Descriptions>
        )
      }, {
        key: 'action',
        render: (row) => (
          <>
            <Tooltip title="Edit Sensor">
              <Button shape="circle" type="primary" icon="edit" className="mr-1" onClick={() => this.editSensor(row)} />
            </Tooltip>
            <Tooltip title="Remove Sensor">
              <Button shape="circle" type="danger" icon="delete" onClick={() => this.onRemove(row)} />
            </Tooltip>
          </>
        ),
      },
    ];

    return (
      <Form layout="vertical" autoComplete="off">
        <div className="col-lg-12">
          <h4 className="text-black mb-3">
            <strong>Information</strong>
          </h4>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="UUID">
                  {form.getFieldDecorator('uuid',{
                    rules: [
                      { required: true, whitespace: true }
                    ],
                  })(<Input placeholder="Device UUID" />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group">
                <FormItem label="Description">
                  {form.getFieldDecorator('description')(<Input.TextArea placeholder="Device Description..." />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem>
                  {form.getFieldDecorator('active', { valuePropName: 'checked' })(<Checkbox>Active</Checkbox>)}
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        { device && device.objectId && (
        <div className="col-lg-12">
          <h4 className="text-black mt-2 mb-3">
            <strong>Sensors</strong>
            <Button className="ml-3" icon="plus" onClick={this.addSensor}>Add</Button>
            <SensorForm
              wrappedComponentRef={this.saveFormRef}
              visible={modalVisible}
              onCancel={this.handleCancel}
              onConfirm={this.handleConfirm}
            />
          </h4>
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
        )}
        <div className="col-lg-12">
          <div className="form-actions">
            <Link to="/devices">
              <Button className="mr-2" icon="arrow-left" type="default">Return Back</Button>
            </Link>
            <Button className="float-right" icon="save" disabled={disableSaveButton} type="primary" onClick={this.save}>
              Save
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

DeviceForm.defaultProps = {
  device: {},
  errors: {},
  saveAction: (formData) => console.log(formData)
};

export default DeviceForm;