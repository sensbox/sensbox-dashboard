import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Icon } from 'antd'

import CustomAvatar from 'components/Custom/Avatar'

import DetailsForm from './device'
import SensorForm from './sensor'

import style from './style.module.scss'

const { TabPane } = Tabs;

const mapStateToProps = ({ resource }) => ({
  saving: resource.saving,
  device: resource.current,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class DeviceFormIndex extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'device/ACTIVE_TAB',
      payload: {
        activeTab: 'details'
      }
    })
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

  render() {
    const { device, saving, formErrors, saveAction, activeTab } = this.props

    const metadata = {
      createdBy: device.createdBy,
      updatedBy: device.updatedBy,
      createdAt: device.createdAt && new Date(device.createdAt).toLocaleString(),
      updatedAt: device.updatedAt && new Date(device.updatedAt).toLocaleString(),
    }

    return (
      <div>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                <Tabs defaultActiveKey="details" activeKey={activeTab} onChange={this.dispatchChangeTab}>
                  <TabPane tab={<span className="h5"> <Icon type="alert" /> Device Info. </span>} key="details">
                    <DetailsForm
                      device={device}
                      disableSaveButton={saving}
                      saveAction={saveAction}
                      errors={formErrors}
                    />
                  </TabPane>
                  <TabPane disabled={!device.objectId} tab={<span className="h5"> <Icon type="sliders" /> Sensors </span>} key="sensors">
                    <SensorForm device={device} />
                  </TabPane>
                  <TabPane disabled={!device.objectId} tab={<span className="h5"> <Icon type="share-alt" /> Share </span>} key="share">
                    Share Options
                  </TabPane>
                </Tabs>
              </div>

              {device && device.objectId && (
                <div className="col-lg-4">
                  <h5 className="mb-3 text-black">
                    <strong>Metadata</strong>
                  </h5>
                  <dl className="row">
                    <dt className={`col-xl-4 ${style.metadataItem}`}>Created by:</dt>
                    <dd className="col-xl-8">
                      <CustomAvatar user={metadata.createdBy} />
                    </dd>
                    <dt className={`col-xl-4 ${style.metadataItem}`}>Updated by:</dt>
                    <dd className="col-xl-8">
                      <CustomAvatar user={metadata.updatedBy} />
                    </dd>
                    <dt className={`col-xl-4 ${style.metadataItem}`}>Created:</dt>
                    <dd className="col-xl-8">{metadata.createdAt}</dd>
                    <dt className={`col-xl-4 ${style.metadataItem}`}>Updated:</dt>
                    <dd className="col-xl-8">{metadata.updatedAt}</dd>
                  </dl>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default DeviceFormIndex
