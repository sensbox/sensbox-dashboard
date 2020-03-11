import React from 'react'
import { connect } from 'react-redux'
import { Form, Switch, Button } from 'antd'
import UserSelect from 'components/Custom/UserSelect'
import ShareDetails from './ShareDetails'

const getFormField = (value, errors) =>
  Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) })

const mapPropsToFields = ({ currentUser, permissions, errors }) => {
  const publicReadAccess = permissions.public ? permissions.public.read : false

  const users = permissions.users
    ? permissions.users
        .filter(u => u.userId !== currentUser.id)
        .map(u => ({
          key: u.userId,
          label: `${u.account.firstName} ${u.account.lastName} (${u.account.username})`,
        }))
    : []

  const permissionsDetails = permissions.users
    .filter(u => u.userId !== currentUser.id)
    .map(el => ({
      id: el.userId,
      name: el.account.username,
      permission: el.write ? 'edit' : 'view',
    }))

  return {
    public: getFormField(publicReadAccess, errors.public),
    users: getFormField(users, errors.users),
    permissions_details: getFormField(permissionsDetails, errors.permissions_details),
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user,
})

@connect(mapStateToProps)
@Form.create({ mapPropsToFields })
class ShareForm extends React.Component {
  setPermissionsDetailsData = (elems, form) => {
    const origValues = form.getFieldsValue().permissions_details

    const newValues = elems.map(el => {
      const exists = origValues.find(reg => reg.id === el.key)
      if (exists) return exists
      const newReg = {
        id: el.key,
        name: el.label,
        permission: 'view',
        type: 'organization',
      }
      return newReg
    })

    form.setFieldsValue({ permissions_details: newValues })
  }

  render() {
    const { form, okCallback, cancelCallback, saving, resource, className } = this.props
    const { getFieldDecorator } = form

    return (
      <Form layout="vertical">
        <Form.Item label="Public" extra="Set the dashboard as Public. Anyone could access it.">
          {getFieldDecorator('public', {
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item
          label="Share with"
          extra="List of organizations, zones, users that you want to share your dashboard."
        >
          {getFieldDecorator('users', {
            onChange: elems => this.setPermissionsDetailsData(elems, form),
          })(<UserSelect />)}
        </Form.Item>

        {getFieldDecorator('permissions_details', {
          initialValue: [],
        })(<ShareDetails />)}

        <div className="text-right">
          <div className="form-actions m-0">
            <Button
              className="m-1"
              icon="share-alt"
              loading={saving}
              type="primary"
              onClick={() => okCallback(resource, className, form)}
            >
              Share
            </Button>
            <Button className="m-1" onClick={() => cancelCallback(resource, className, form)}>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

export default ShareForm
