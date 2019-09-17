import React from 'react'
import { Input, Button, Form, Switch, message } from 'antd'
import { Link } from "react-router-dom";

const FormItem = Form.Item;

const getFormField = (value, errors) => Form.createFormField({ value, errors: errors ? errors.map(e => new Error(e)) : null });

const mapPropsToFields = ({ zone, errors }) => {
  const { name, description, active } = zone || {};
  return {
    name: getFormField(name, errors.name),
    description: getFormField(description, errors.description),
    active: getFormField(active, errors.active),
  }
}

@Form.create({ mapPropsToFields })
class ZoneForm extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  save() {
    const { form, saveAction } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        saveAction(values);
        form.getFieldInstance('name').focus();
      } else {
        const firstFieldWithError = Object.keys(err).pop();
        form.getFieldInstance(firstFieldWithError).focus();
        message.error('Please check all form fields.', 2.5)
      }
    });
  }

  render() {
    const {
      backLink,
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
                <FormItem label="Name">
                  {form.getFieldDecorator('name',{
                    rules: [
                      { required: true, whitespace: true }
                    ],
                  })(<Input placeholder="Zone name" />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group">
                <FormItem label="Description">
                  {form.getFieldDecorator('description')(<Input.TextArea placeholder="Zone Description..." />)}
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
          <div className="form-actions">
            <Link to={backLink}>
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

ZoneForm.defaultProps = {
  zone: {},
  errors: {},
  saveAction: (formData) => console.log(formData)
};

export default ZoneForm;
