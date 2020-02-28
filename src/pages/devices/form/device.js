import React from 'react'
import { connect } from 'react-redux'
import { Input, Form, Checkbox, message, Button } from 'antd'

const FormItem = Form.Item

const getFormField = (value, errors) =>
  Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) })

const mapPropsToFields = ({ device, errors }) => {
  const { uuid, description, active } = device || {}
  return {
    uuid: getFormField(uuid, errors.uuid),
    description: getFormField(description, errors.description),
    active: getFormField(active, errors.active),
  }
}

@Form.create({ mapPropsToFields })
@connect()
class DeviceForm extends React.Component {

  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
  }

  save() {
    const { form, saveAction } = this.props
    
    form.validateFields((err, values) => {
      console.log('here is');
      if (!err) {
        saveAction(values)
        form.getFieldInstance('uuid').focus()
      } else {
        const firstFieldWithError = Object.keys(err).pop()
        form.getFieldInstance(firstFieldWithError).focus()
        message.error('Please check all form fields.', 2.5)
      }
    })
  }

  render() {
    const { form, disableSaveButton } = this.props;

    return (
      <Form layout="vertical" autoComplete="off">
        <div className="col-lg-12">
          <div className="row">
            <FormItem label="UUID" className="col-md-6">
              {form.getFieldDecorator('uuid', {
                rules: [{ required: true, whitespace: true }],
              })(<Input placeholder="Device UUID" />)}
            </FormItem>

            <div className="col-md-3 form-group ">
              <FormItem label="Status" className="pt-2">
                {form.getFieldDecorator('active', { valuePropName: 'checked' })(
                  <Checkbox>Active</Checkbox>,
                )}
              </FormItem>
            </div>
            <FormItem label="Description" className="col-md-12">
              {form.getFieldDecorator('description')(
                <Input.TextArea placeholder="Device Description..." />,
              )}
            </FormItem>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="form-actions">
            <Button
              className="float-right"
              icon="save"
              disabled={disableSaveButton}
              type="primary"
              onClick={this.save}
            >
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
  saveAction: formData => console.log(formData),
}


export default DeviceForm
