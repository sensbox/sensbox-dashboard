import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd'

import { Helmet } from 'react-helmet'

import { Redirect } from 'react-router-dom'
import MetaData from 'components/Custom/MetaData'
import AccountForm from '../form'

const mapStateToProps = ({ resource }) => ({
  current: resource.current,
  saving: resource.saving,
  objectNotFound: resource.objectNotFound,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class AccountEdit extends React.Component {
  state = {
    backLink: '/accounts',
  }

  constructor(props) {
    super(props)
    const { dispatch, location } = props
    if (location.state) {
      dispatch({
        type: 'resource/GET_CURRENT',
        payload: {
          className: 'Account',
          includes: ['user'],
          objectId: location.state.account.objectId,
        },
      })
    }
    this.saveAction = this.saveAction.bind(this)
  }

  saveAction(formData) {
    const { current, dispatch } = this.props
    console.log('GUARDANDO', formData)
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Account',
        objectId: current.objectId,
        data: formData,
        notify: true,
      },
    })
  }

  render() {
    const { saving, objectNotFound, location, history, current, formErrors } = this.props
    const { backLink } = this.state

    if (!location.state || objectNotFound) {
      return <Redirect to={backLink} />
    }
    return (
      <div>
        <Helmet title="User Account Edit" />
        <PageHeader
          className="mb-2"
          ghost={false}
          onBack={() => history.replace({ pathname: backLink })}
          title="User Account Edit"
          subTitle={current.name}
        />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-9">
                {current.objectId && (
                  <AccountForm
                    account={current}
                    disableSaveButton={saving}
                    saveAction={this.saveAction}
                    errors={formErrors}
                    backLink={backLink}
                  />
                )}
              </div>
              <div className="col-md-3">
                <MetaData item={current} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountEdit
