import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd'
import { Helmet } from 'react-helmet'

import AccountForm from '../form'

const mapStateToProps = ({ resource }) => ({
  saving: resource.saving,
  current: resource.current,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class AccountNew extends React.Component {
  state = {
    backLink: '/accounts',
    editLink: '/accounts/edit',
  }

  constructor(props) {
    super(props)
    this.saveAction = this.saveAction.bind(this)
  }

  componentDidUpdate() {
    const { current } = this.props
    const { editLink } = this.state
    if (current && current.objectId) {
      const { history } = this.props
      history.push({
        pathname: editLink,
        state: { account: current },
      })
    }
  }

  saveAction(formData) {
    // eslint-disable-next-line no-unused-vars
    const { dispatch } = this.props
    // console.log('Saving', formData)
    dispatch({
      type: 'resource/CREATE',
      payload: {
        className: 'Account',
        data: formData,
        notify: true,
      },
    })
  }

  render() {
    const { saving, current, formErrors, history } = this.props
    const { backLink } = this.state
    return (
      <div>
        <Helmet title="New User Account" />
        <PageHeader
          className="mb-2"
          ghost={false}
          onBack={() => history.replace({ pathname: backLink })}
          title="New User Account"
        />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-9">
                <AccountForm
                  account={current}
                  disableSaveButton={saving}
                  saveAction={this.saveAction}
                  errors={formErrors}
                  backLink={backLink}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountNew
