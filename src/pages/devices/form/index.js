import React from 'react'
import { Tabs, Icon } from 'antd'

import MetaData from 'components/Custom/MetaData'

import DetailsForm from './device'
import SensorForm from './sensor'

const { TabPane } = Tabs

class DeviceFormIndex extends React.Component {
  render() {
    const {
      device = {},
      saving = false,
      formErrors = {},
      saveAction,
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
                        <Icon type="alert" /> Device Info.
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
                        <Icon type="sliders" /> Sensors
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
                        <Icon type="share-alt" /> Share
                      </span>
                    }
                    key="share"
                  >
                    Share Options
                  </TabPane>
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
