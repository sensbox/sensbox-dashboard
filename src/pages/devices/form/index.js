import React from 'react'
import { Tabs, Icon } from 'antd'

import MetaData from 'components/Custom/MetaData'
import ShareForm from 'components/Custom/Share'

import DetailsForm from './device'
import SensorForm from './sensor'
import ParamsForm from './extraParams'

const { TabPane } = Tabs

class DeviceFormIndex extends React.Component {
  render() {
    const fontSize = '1.3rem'
    const {
      device = {},
      saving = false,
      formErrors = {},
      permissions,
      showShareForm = false,
      saveAction,
      shareCallback,
      activeTab = 'details',
      onTabChange,
    } = this.props

    return (
      <div>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-9">
                <Tabs
                  size="small"
                  defaultActiveKey="details"
                  activeKey={activeTab}
                  onChange={onTabChange}
                >
                  <TabPane
                    tab={
                      <span className="h6">
                        <Icon type="alert" style={{ fontSize }} /> Device Info.
                      </span>
                    }
                    key="details"
                  >
                    <DetailsForm
                      device={device}
                      disableSaveButton={saving}
                      saveAction={saveAction}
                      errors={formErrors}
                    />
                  </TabPane>
                  <TabPane
                    disabled={!device.objectId}
                    tab={
                      <span className="h6">
                        <Icon type="sliders" style={{ fontSize }} /> Sensors
                      </span>
                    }
                    key="sensors"
                  >
                    <SensorForm device={device} />
                  </TabPane>
                  <TabPane
                    disabled={!device.objectId}
                    tab={
                      <span className="h6">
                        <Icon type="calculator" style={{ fontSize }} /> Params
                      </span>
                    }
                    key="params"
                  >
                    <ParamsForm device={device} />
                  </TabPane>
                  {showShareForm && (
                    <TabPane
                      disabled={!device.objectId}
                      tab={
                        <span className="h6">
                          <Icon type="share-alt" style={{ fontSize }} /> Share
                        </span>
                      }
                      key="share"
                    >
                      <ShareForm
                        className="Device"
                        searchOn={['Organization', 'User', 'Zone']}
                        resource={device}
                        errors={formErrors}
                        rowsDetailsCount={3}
                        permissions={permissions}
                        okCallback={shareCallback}
                        saving={saving}
                      />
                    </TabPane>
                  )}
                </Tabs>
              </div>

              {device && device.objectId && (
                <div className="col-md-3 ">
                  <MetaData item={device} />
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
