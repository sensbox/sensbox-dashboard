import React from 'react'
import { Input, Button, Form, Checkbox, message, Tabs, Icon } from 'antd'
import { Link } from 'react-router-dom'

const FormItem = Form.Item

const { TabPane } = Tabs

const getFormField = (value, errors) =>
  Form.createFormField({ value, errors: errors ? errors.map(e => new Error(e)) : null })

const mapPropsToFields = ({ zone, errors }) => {
  const { name, description, active } = zone || {}
  return {
    name: getFormField(name, errors.name),
    description: getFormField(description, errors.description),
    active: getFormField(active, errors.active),
  }
}

@Form.create({ mapPropsToFields })
class ZoneForm extends React.Component {
  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
  }

  save() {
    const { form, saveAction } = this.props

    form.validateFields((err, values) => {
      if (!err) {
        saveAction(values)
        form.getFieldInstance('name').focus()
      } else {
        const firstFieldWithError = Object.keys(err).pop()
        form.getFieldInstance(firstFieldWithError).focus()
        message.error('Please check all form fields.', 2.5)
      }
    })
  }

  render() {
    const fontSize = '1.3rem'

    const {
      backLink,
      form,
      zone,
      disableSaveButton,
      activeTab = 'details',
      onTabChange,
    } = this.props

    return (
      <Tabs size="small" defaultActiveKey="details" activeKey={activeTab} onChange={onTabChange}>
        <TabPane
          tab={
            <span className="h6">
              <Icon type="apartment" style={{ fontSize }} /> Zone Info.
            </span>
          }
          key="details"
        >
          <Form layout="vertical" autoComplete="off">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <FormItem label="Name">
                      {form.getFieldDecorator('name', {
                        rules: [{ required: true, whitespace: true }],
                      })(<Input placeholder="Zone name" />)}
                    </FormItem>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <FormItem label="Description">
                      {form.getFieldDecorator('description')(
                        <Input.TextArea placeholder="Zone Description..." />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <FormItem>
                      {form.getFieldDecorator('active', { valuePropName: 'checked' })(
                        <Checkbox>Active</Checkbox>,
                      )}
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-actions">
                <Link to={backLink}>
                  <Button className="mr-2" icon="arrow-left" type="default">
                    Return Back
                  </Button>
                </Link>
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
        </TabPane>
        <TabPane
          disabled={!zone.objectId}
          tab={
            <span className="h6">
              <Icon type="shake" style={{ fontSize }} /> Devices
            </span>
          }
          key="related_devices"
        >
          Related Devices
        </TabPane>
      </Tabs>
    )
  }
}

ZoneForm.defaultProps = {
  zone: {},
  errors: {},
  saveAction: formData => console.log(formData),
}

export default ZoneForm
