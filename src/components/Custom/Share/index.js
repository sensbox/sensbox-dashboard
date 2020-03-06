import React from 'react'
import { connect } from 'react-redux'
import { Form, Switch, Input, Button, Icon } from 'antd'
import UserSelect from 'components/Custom/UserSelect'

let rowsCount = 0

const getFormField = (value, errors) =>
  Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) })

const mapPropsToFields = ({ currentUser, permissions, formErrors }) => {
  const publicReadAccess = permissions.public ? permissions.public.read : false
  const users = permissions.users
    ? permissions.users
        .filter(u => u.userId !== currentUser.id)
        .map(u => ({
          key: u.userId,
          label: `${u.account.firstName} ${u.account.lastName} (${u.account.username})`,
        }))
    : []

  return {
    public: getFormField(publicReadAccess, formErrors.public),
    users: getFormField(users, formErrors.users),
    keys: getFormField(users.map((el, idx) => idx)),
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
  componentDidMount() {
    const { form } = this.props
    const { users } = form.getFieldsValue()
    form.setFieldsValue({ users_2: users.map(u => u.label) })
  }
  

  removeRow = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  addRow = () => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')

    rowsCount += 1

    const nextKeys = keys.concat(rowsCount)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  render() {
    const { form, okCallback, cancelCallback, saving, resource, className } = this.props
    const { getFieldDecorator, getFieldValue } = form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 6 },
      },
    }

    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')

    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? 'Share Options' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`users_2[${index}]`, {
          rules: [
            {
              required: false,
            },
          ],
        })(<Input placeholder="passenger name" style={{ width: '85%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.removeRow(k)}
          />
        ) : null}
        <Icon className="dynamic-delete-button" type="plus-circle" onClick={() => this.addRow()} />
      </Form.Item>
    ))

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
            onChange: values => {form.setFieldsValue({ users_2: values.map(u => u.label) }),
          })(<UserSelect />)}
        </Form.Item>

        {formItems}

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
