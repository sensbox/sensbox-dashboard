import React from 'react'
import { Input, Button, Form, Checkbox, message, Select } from 'antd'
import { Link } from "react-router-dom";
import api from '../../../services/api';

const FormItem = Form.Item;
const { Option } = Select;
const getFormField = (value, errors) => Form.createFormField({ value, errors: errors ? errors.map(e => new Error(e)) : null });

const mapPropsToFields = ({ account, errors }) => {
  const { firstName, middleName, lastName, organization, active, email, username } = account || {};
  return {
    firstName: getFormField(firstName, errors.firstName),
    lastName: getFormField(lastName, errors.lastName),
    middleName: getFormField(middleName, errors.middleName),
    email: getFormField(email, errors.email),
    username: getFormField(username, errors.username),
    organization: getFormField(organization && organization.objectId, errors.organization),
    active: getFormField(active, errors.active),
  }
}

@Form.create({ mapPropsToFields })
class AccountForm extends React.Component {
  state = {
    confirmDirty: false,
    organizations: [],
  }

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.computeUsername = this.computeUsername.bind(this);
    this.loadOrganizations();
  }

  handleConfirmBlur = e => {
    const { confirmDirty } = this.state;
    const { value } = e.target;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter are inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  async loadOrganizations() {
    const { results } = await api.find("Organization", { limit: 100 })
    this.setState({ organizations: results.map( r => ({ value: r.objectId, text: r.name })) });
  }

  
  save() {
    const { form, saveAction } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // set a pointer to Organization.
        values.organization = api.createPointer("Organization", values.organization);
        delete values.confirm;
        saveAction(values);
        form.getFieldInstance('firstName').focus();
      } else {
        const firstFieldWithError = Object.keys(err).pop();
        form.getFieldInstance(firstFieldWithError).focus();
        message.error('Please check all form fields.', 2.5)
      }
    });
  }

  computeUsername() {
    const { form, account } = this.props;
    let username;
    if (account.objectId) {
      // eslint-disable-next-line prefer-destructuring
      username = account.user.username;
    } else if (
      form.getFieldError("firstName") === undefined &&
      form.getFieldError("lastName") === undefined
    ) {
        const firstName = form.getFieldValue("firstName");
        const lastName = form.getFieldValue("lastName");
        username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    } else {
      username='';
    }
    form.setFieldsValue({ username });
  }

  render() {
    const {
      account,
      form,
      backLink,
      disableSaveButton,
    } = this.props
    
    const { organizations } = this.state;

    return (
      <Form layout="vertical" autoComplete="off">
        <div className="col-lg-12">
          <h4 className="text-black mb-3">
            <strong>Personal Information</strong>
          </h4>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="First Name">
                  {form.getFieldDecorator('firstName',{
                    rules: [
                      { 
                        pattern: /^[a-zA-Z]+$/,
                        required: true,
                        message: "The First Name is required and can only contain letters. No another character like dots or spaces."
                      }
                    ],
                  })(<Input placeholder="First name" onBlur={this.computeUsername} />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Middle Name">
                  {form.getFieldDecorator('middleName',{
                    rules: [
                      { required: false, whitespace: true }
                    ],
                  })(<Input placeholder="Middle name" />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Last Name">
                  {form.getFieldDecorator('lastName',{
                    rules: [
                      { 
                        pattern: /^[a-zA-Z]+$/,
                        required: true,
                        message: "The Last Name is required and can only contain letters. No another character like dots or spaces."
                      }
                    ],
                  })(<Input placeholder="Last name" onBlur={this.computeUsername} />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Organization">
                  {form.getFieldDecorator('organization',{
                    rules: [
                      { required: true }
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="Select an organization"
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      { organizations.map(d => <Option key={d.value}>{d.text}</Option>) }
                    </Select>
                  )}
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <h4 className="text-black mb-3">
            <strong>User Information</strong>
          </h4>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Username">
                  {form.getFieldDecorator('username')(
                    <Input disabled />
                  )}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Email">
                  {form.getFieldDecorator('email',{
                    rules: [
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                      {
                        required: true,
                        message: 'Please input your E-mail!',
                      },
                    ],
                  })(<Input disabled={account.objectId !== undefined} placeholder="E-mail" />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <Form.Item label="Password" hasFeedback>
                  {form.getFieldDecorator('password', {
                    rules: [
                      {
                        required: account.objectId === undefined,
                        message: 'Please input your password!',
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <Form.Item label="Confirm Password" hasFeedback>
                  {form.getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: account.objectId === undefined || form.getFieldValue("password"),
                        message: 'Please confirm your password!',
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
              </div>
            </div>           
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem>
                  {form.getFieldDecorator('active', { valuePropName: 'checked' })(<Checkbox>Active</Checkbox>)}
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

AccountForm.defaultProps = {
  account: {},
  errors: {},
  saveAction: (formData) => console.log(formData)
};

export default AccountForm;
