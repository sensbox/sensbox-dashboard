import React from 'react'
import { Input, Button, Form, Switch, message } from 'antd'
import { Link } from "react-router-dom";

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
class DeviceForm extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

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
    } = this.props
    
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
                <FormItem label="Active">
                  {form.getFieldDecorator('active', { valuePropName: 'checked' })(<Switch />)}
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <h4 className="text-black mt-2 mb-3">
            <strong>Metrics</strong>
          </h4>
          <div className="row">
            <div className="col-lg-12" />
          </div>
        </div>
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
  centro: {},
  errors: {},
  saveAction: (formData) => console.log(formData)
};

export default DeviceForm;
