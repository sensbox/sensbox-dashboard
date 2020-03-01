import React from 'react'
import { Drawer, Tabs, Card } from 'antd'

import Types from 'components/WidgetsComponents/types'
import styles from './style.module.scss'

const { TabPane } = Tabs
const { Meta } = Card

class WidgetsCatalog extends React.PureComponent {
  render() {
    const { visible, onClose, onAdd } = this.props

    return (
      <Drawer
        title={<div className={styles.drawerTitle}>Add Widgets</div>}
        bodyStyle={{ padding: 10 }}
        width={450}
        placement="right"
        closable={false}
        onClose={() => onClose()}
        visible={visible}
      >
        <Tabs defaultActiveKey="1" onChange={key => console.log(key)}>
          <TabPane tab="Historic" key="1">
            <Card hoverable onClick={() => onAdd(Types.LINE_CHART)}>
              <Meta title="Line Chart" description="Basic Line chart" />
            </Card>
          </TabPane>
          <TabPane tab="Real Time" key="2">
            REAL TIME WIDGETS
          </TabPane>
        </Tabs>
      </Drawer>
    )
  }
}

export default WidgetsCatalog
