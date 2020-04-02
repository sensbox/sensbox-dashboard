import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd'

import { Helmet } from 'react-helmet'

import { Redirect } from 'react-router-dom'
import MetaData from 'components/Custom/MetaData'
import ZoneForm from '../form'

const mapStateToProps = ({ resource }) => ({
  current: resource.current,
  saving: resource.saving,
  objectNotFound: resource.objectNotFound,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class ZoneEdit extends React.Component {
  state = {
    backLink: '/organizations',
    activeTab: 'details',
  }

  constructor(props) {
    super(props)
    const { dispatch, location } = props
    if (location.state) {
      this.state = {
        ...this.state,
        backLink: `/organizations/${location.state.zone.organization.objectId}/zones`,
      }
      dispatch({
        type: 'resource/GET_CURRENT',
        payload: {
          className: 'Zone',
          objectId: location.state.zone.objectId,
          includes: ['relatedDevices'],
        },
      })
    }
    this.saveAction = this.saveAction.bind(this)
  }

  onBack = () => {
    const { history, current } = this.props
    const { backLink } = this.state
    return history.replace({
      pathname: backLink,
      state: { organization: current.organization },
    })
  }

  changeTab = tab => {
    this.setState({ activeTab: tab })
  }

  saveAction(formData) {
    const { current, dispatch } = this.props
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Zone',
        objectId: current.objectId,
        data: formData,
        notify: true,
      },
    })
  }

  render() {
    const { saving, objectNotFound, location, current, formErrors } = this.props
    const { backLink, activeTab } = this.state

    if (!location.state || objectNotFound) {
      return <Redirect to={backLink} />
    }
    return (
      <div>
        <Helmet title="Zone Edit" />
        <PageHeader
          className="mb-2"
          ghost={false}
          onBack={this.onBack}
          title="Zone Edit"
          subTitle={current.name}
        />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-9">
                {current && (
                  <ZoneForm
                    zone={current}
                    disableSaveButton={saving}
                    saveAction={this.saveAction}
                    errors={formErrors}
                    backLink={{ pathname: backLink, state: { organization: current.organization } }}
                    activeTab={activeTab}
                    onTabChange={this.changeTab}
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

export default ZoneEdit
