import React, { Component } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { fetching },
    } = this.props
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.logo}>
                <img src="resources/images/logo-sensbox.png" alt="Sensbox" />
              </div>
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>log in</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [
                          { required: true, message: 'Por favor ingrese su dirección de e-mail' },
                        ],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Password">
                      {form.getFieldDecorator('password', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Por favor ingrese su contraseña' }],
                      })(<Input size="default" type="password" />)}
                    </Form.Item>
                    <Form.Item>
                      {form.getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(<Checkbox>Recordar</Checkbox>)}
                      <Link
                        to="/user/forgot"
                        className="utils__link--blue utils__link--underlined pull-right"
                      >
                        Olvidó su contraseña?
                      </Link>
                    </Form.Item>
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        htmlType="submit"
                        loading={fetching}
                      >
                        Ingresar
                      </Button>
                      <span className="ml-3 register-link">
                        <a
                          href="javascript: void(0);"
                          className="text-primary utils__link--underlined"
                        >
                          Register
                        </a>{' '}
                        if you don&#39;t have account
                      </span>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
