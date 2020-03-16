import React from 'react'
import { connect } from 'react-redux'
import { PageHeader, message } from 'antd'

import { Helmet } from 'react-helmet'

import { Redirect } from 'react-router-dom'

import DeviceFormIndex from '../form'

const mapStateToProps = ({ resource, device, user }) => ({
  permissions: resource.currentObjectPermissions,
  current: resource.current,
  currentUser: user,
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
          requestObjectPermissions: true,
        },
      })
    }
    this.saveAction = this.saveAction.bind(this)
  }

  handleConfirmShareDevice = ({ objectId }, className, form) => {
    const { dispatch } = this.props

    form.validateFields((err, values) => {
      const permissions = {
        public: {
          read: values.public,
          write: false,
        },
      }

      const { users, roles } = values.permissions_details

      permissions.users = users.map(u => ({
        id: u.id,
        read: true,
        write: u.permission === 'edit',
      }))

      permissions.roles = roles.map(role => ({
        name: role.id,
        read: true,
        write: role.permission === 'edit',
      }))

      if (!err) {
        dispatch({
          type: 'resource/SET_PERMISSIONS',
          payload: {
            className,
            objectId,
            permissions,
            notify: true,
          },
        })
      } else {
        const firstFieldWithError = Object.keys(err).pop()
        form.getFieldInstance(firstFieldWithError).focus()
        message.error('Please check all form fields.', 2.5)
      }
    })
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
    const {
      saving,
      objectNotFound,
      location,
      history,
      current = {},
      formErrors,
      activeTab,
      permissions,
      currentUser,
    } = this.props

    console.log('current User', currentUser.id)
    console.log('current device', current.createdBy && current.createdBy.objectId)

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
          permissions={permissions}
          formErrors={formErrors}
          showShareForm={currentUser.id === (current.createdBy && current.createdBy.objectId)}
          shareCallback={this.handleConfirmShareDevice}
          activeTab={activeTab}
          onTabChange={this.dispatchChangeTab}
        />
      </div>
    )
  }
}

export default DeviceSettings
