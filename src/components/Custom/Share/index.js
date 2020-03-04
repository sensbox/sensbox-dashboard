import React from 'react'
import { connect } from 'react-redux'
import { Form, Switch, Button } from 'antd'
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
  resource: resource.current,
  permissions: resource.currentObjectPermissions,
  saving: resource.saving,
  formErrors: resource.formErrors,
  objectNotFound: resource.objectNotFound,
})

@connect(mapStateToProps)
@Form.create({ mapPropsToFields })
class ShareForm extends React.Component {


  render() {
    const { form, okCallback, cancelCallback, saving, resource, className } = this.props;
    const { getFieldDecorator } = form;

    return (
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

        <div className="text-right">
          <div className="form-actions">
            <Button
              className="m-1"
              icon="share-alt"
              loading={saving}
              type="primary"
              onClick={()=>okCallback(resource, className, form)}
            >
              Share
            </Button>
            <Button
              className="m-1"
              onClick={()=>cancelCallback(resource, className, form)}
            >
              Cancel
            </Button>
            
          </div>
        </div>
      </Form>
    )
  }
}

export default ShareForm;