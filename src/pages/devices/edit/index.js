import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd'

import { Helmet } from 'react-helmet'

import { Redirect } from 'react-router-dom'

import DeviceFormIndex from '../form'



const mapStateToProps = ({ resource, device }) => ({
  current: resource.current,
  saving: resource.saving,
  objectNotFound: resource.objectNotFound,
  activeTab: device.activeTab,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class DeviceSettings extends React.Component {
  constructor(props) {
    super(props)
    const { dispatch, location } = props
    if (location.state) {
      dispatch({
        type: 'resource/GET_CURRENT',
        payload: {
          className: 'Device',
          includes: ['createdBy', 'updatedBy'],
          objectId: location.state.device.objectId,
        },
      })
    }
    this.saveAction = this.saveAction.bind(this)
  }
  
  dispatchChangeTab = (tab) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'device/ACTIVE_TAB',
      payload: {
        activeTab: tab
      }
    })
  }
  
  saveAction(formData) {
    const { current, dispatch } = this.props
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Device',
        objectId: current.objectId,
        data: formData,
        notify: true,
      },
    })
  }

  render() {
    const { saving, objectNotFound, location, history, current, formErrors, activeTab } = this.props
    // console.log(history);
    if (!location.state || objectNotFound) {
      return <Redirect to="/devices" />
    }
    return (
      <div>
        <Helmet title="Device Settings" />
        <PageHeader
          className="mb-2"
          ghost={false}
          onBack={() => history.goBack()}
          title="Device Settings"
          subTitle={current.nombre}
        />

        <DeviceFormIndex
          device={current}
          disableSaveButton={saving}
          saveAction={this.saveAction}
          formErrors={formErrors}
          activeTab={activeTab}
          onTabChange={this.dispatchChangeTab}
        />
      </div>
    )
  }
}

export default DeviceSettings
