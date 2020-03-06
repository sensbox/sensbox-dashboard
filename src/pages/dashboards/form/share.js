import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'

import ShareForm from 'components/Custom/Share'
// import Dashboard from 'pages/ecommerce/dashboard'

const mapStateToProps = ({ resource, user }) => ({
  currentUser: user,
  dashboard: resource.current,
  permissions: resource.currentObjectPermissions,
  saving: resource.saving,
  formErrors: resource.formErrors,
  objectNotFound: resource.objectNotFound,
})

@connect(mapStateToProps)
class ShareModal extends React.Component {
  render() {
    const { saving, visible, dashboard, onCancel, onConfirm } = this.props
    return (
      <Modal
        visible={visible}
        okButtonProps={{ loading: saving }}
        title={`Share Dashboard ${dashboard.name}`}
        okText="Share"
        onCancel={onCancel}
        // onOk={() => onConfirm(dashboard.objectId)}
        footer={null}
        centered
      >
        <ShareForm
          className="Dashboard"
          resource={dashboard}
          cancelCallback={onCancel}
          okCallback={onConfirm}
          saving={saving}
        />
      </Modal>
    )
  }
}

export default ShareModal
