import React from 'react'
import { connect } from 'react-redux'
import { Form, Switch, Button } from 'antd'
import EntitySelect from 'components/Custom/EntitySelect'
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
          type: 'User',
          ClassName: 'User',
        }))
    : []
  const roles = permissions.roles
    ? permissions.roles.map(rol => ({
        key: rol.name,
        label: `${rol.object.attributes.name}`,
        type: 'Role',
        className: rol.className,
      }))
    : []

  const usersDetails = permissions.users
    .filter(u => u.userId !== currentUser.id)
    .map(el => ({
      id: el.userId,
      name: el.account.username,
      permission: el.write ? 'edit' : 'view',
    }))

  const rolesDetails = permissions.roles.map(rol => ({
    id: rol.name,
    name: `${rol.object.attributes.name}`,
    permission: rol.write ? 'edit' : 'view',
  }))

  return {
    public: getFormField(publicReadAccess, errors.public),
    users: getFormField([...users, ...roles], errors.users),
    permissions_details: getFormField(
      { users: usersDetails, roles: rolesDetails },
      errors.permissions_details,
    ),
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

    const newUsers = elems
      .filter(({ type }) => type === 'User')
      .map(({ key: id, label: name, className }) => {
        const exists = origValues.users.find(reg => reg.id === id)
        if (exists) return exists
        const newReg = { id, name, permission: 'view', className }
        return newReg
      })

    const newRoles = elems
      .filter(({ type }) => type === 'Role')
      .map(({ key: id, label: name, className }) => {
        const exists = origValues.roles.find(reg => reg.id === id)
        if (exists) return exists
        const newReg = { id, name, permission: 'view', className }
        return newReg
      })

    form.setFieldsValue({ permissions_details: { users: newUsers, roles: newRoles } })
  }

  render() {
    const { form, okCallback, cancelCallback, saving, resource, className, searchOn } = this.props
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
          })(<EntitySelect searchOn={searchOn} />)}
        </Form.Item>

        {getFieldDecorator('permissions_details', {
          initialValue: [],
          onChange: elems => console.log(elems),
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
