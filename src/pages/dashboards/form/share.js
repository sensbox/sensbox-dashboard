import React from 'react'
import { connect } from 'react-redux'
import { Form, Modal, Switch } from 'antd'
import UserSelect from 'components/Custom/UserSelect'

const getFormField = (value, errors) =>
  Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) })

const mapPropsToFields = ({ currentUser, permissions, formErrors }) => {
  const publicReadAccess = permissions.public ? permissions.public.read : false
  const users = permissions.users
    ? permissions.users
        .filter(u => u.userId !== currentUser.id && u.read)
        .map(u => ({
          key: u.userId,
          label: `${u.account.firstName} ${u.account.lastName} (${u.account.username})`,
        }))
    : []

  return {
    public: getFormField(publicReadAccess, formErrors.public),
    users: getFormField(users, formErrors.users),
  }
}

const mapStateToProps = ({ resource, user }) => ({
  currentUser: user,
  dashboard: resource.current,
  permissions: resource.currentObjectPermissions,
  saving: resource.saving,
  formErrors: resource.formErrors,
  objectNotFound: resource.objectNotFound,
})

@connect(mapStateToProps)
@Form.create({ mapPropsToFields })
class ShareForm extends React.Component {
  render() {
    const { saving, visible, onCancel, onConfirm, form, dashboard } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visible}
        okButtonProps={{ loading: saving }}
        title={`Share Dashboard ${dashboard.name}`}
        okText="Share"
        onCancel={onCancel}
        onOk={() => onConfirm(dashboard.objectId)}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Public" extra="Set the dashboard as Public. Anyone could access it.">
            {getFieldDecorator('public', {
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          <Form.Item
            label="Share with"
            extra="List of users that you want to share your dashboard. The users cannot modify the dashboard only visualize it."
          >
            {getFieldDecorator('users')(<UserSelect />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default ShareForm
