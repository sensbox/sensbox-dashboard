import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd'
import { Helmet } from 'react-helmet'

import DeviceFormIndex from '../form'

const mapStateToProps = ({ device }) => ({
  activeTab: device.activeTab
})

@connect(mapStateToProps)
class DeviceNew extends React.Component {
  constructor(props) {
    super(props)
    this.saveAction = this.saveAction.bind(this)
  }

  componentDidUpdate() {
    const { current } = this.props
    if (current && current.objectId) {
      const { history } = this.props
      history.push({
        pathname: `/devices/settings/${current.uuid}`,
        state: { device: current },
      })
    }
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
      },
    });

    dispatch({
      type: 'device/ACTIVE_TAB',
      payload: {
        activeTab: 'sensors'
      }
    })

  }

  render() {
    const { history, activeTab } = this.props

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
          saveAction={this.saveAction}
          activeTab={activeTab}
        />
      </div>
    )
  }
}

export default DeviceNew
