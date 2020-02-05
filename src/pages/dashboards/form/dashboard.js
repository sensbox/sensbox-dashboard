import React from 'react'
import { connect } from 'react-redux'
import { Input, Form, Modal } from 'antd'

const getFormField = (value, errors) =>
  Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) })

const mapPropsToFields = ({ dashboard, formErrors }) => {
  const { name, description } = dashboard || {}
  return {
    name: getFormField(name, formErrors.name),
    description: getFormField(description, formErrors.description),
  }
}

const mapStateToProps = ({ resource }) => ({
  dashboard: resource.current,
  saving: resource.saving,
  formErrors: resource.formErrors,
  objectNotFound: resource.objectNotFound,
})

@connect(mapStateToProps)
@Form.create({ mapPropsToFields })
class DashboardForm extends React.Component {
  render() {
    const { saving, visible, onCancel, onConfirm, form, dashboard } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visible}
        okButtonProps={{ loading: saving }}
        title={dashboard.objectId ? 'Edit Dashboard' : 'Add Dashboard'}
        okText={dashboard.objectId ? 'Edit' : 'Create'}
        onCancel={onCancel}
        onOk={() => onConfirm(dashboard.objectId)}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Name" extra="Name of the dashboard. e.g, Control Zone A.">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input the name of the dashboard!' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Description" style={{ marginBottom: 0 }}>
            {getFieldDecorator('description')(<Input.TextArea />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default DashboardForm
