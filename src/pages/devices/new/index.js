import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd'
import { Helmet } from 'react-helmet'

import DeviceFormIndex from '../form'

const mapStateToProps = ({ resource, device }) => ({
  activeTab: device.activeTab,
  device: resource.current,
  saving: resource.saving,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class DeviceNew extends React.Component {
  constructor(props) {
    super(props)
    this.saveAction = this.saveAction.bind(this)
  }

  dispatchChangeTab = tab => {
    const { dispatch } = this.props

    dispatch({
      type: 'device/ACTIVE_TAB',
      payload: {
        activeTab: tab,
      },
    })
  }

  saveAction(formData) {
    // eslint-disable-next-line no-unused-vars
    const { dispatch } = this.props

    dispatch({
      type: 'resource/CREATE',
      payload: {
        className: 'Device',
        data: formData,
        notify: true,
        callback: () => {
          dispatch({
            type: 'device/ACTIVE_TAB',
            payload: {
              activeTab: 'sensors',
            },
          })
        },
      },
    })
  }

  render() {
    const { saving, history, activeTab, device, formErrors } = this.props

    return (
      <div>
        <Helmet title="New Device" />
        <PageHeader
          ghost={false}
          className="mb-2"
          onBack={() => history.goBack()}
          title="New Device"
        />
        <DeviceFormIndex
          device={device}
          saveAction={this.saveAction}
          disableSaveButton={saving}
          formErrors={formErrors}
          activeTab={activeTab}
          onTabChange={this.dispatchChangeTab}
        />
      </div>
    )
  }
}

export default DeviceNew
