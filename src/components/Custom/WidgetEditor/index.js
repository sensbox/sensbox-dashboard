import React from 'react'
import { Drawer, Divider } from 'antd'
import GridItem from 'components/Custom/GridItem'

import styles from './style.module.scss'
import EditWidgetForm from './form/editWidget'

class WidgetEditor extends React.Component {
  render() {
    const {
      widget,
      widgetErrors,
      visible,
      onCloseEditor,
      onDefinitionChange,
      onSubmit,
      onCancel,
    } = this.props

    return (
      <Drawer
        title={<div className={styles.drawerTitle}>Edit Widget</div>}
        bodyStyle={{ padding: 10 }}
        // height="95%"
        width="80%"
        placement="right"
        onClose={() => onCloseEditor()}
        visible={visible}
        closable
        destroyOnClose
      >
        {widget && (
          <>
            <div className={styles.widgetPreview}>
              <GridItem
                builderMode
                itemDef={widget}
                dynamicSize={false}
                hoverable={false}
                editable={false}
                bordered={false}
              />
            </div>
            <Divider className={styles.divider} dashed />
            <EditWidgetForm
              itemDef={widget}
              errors={widgetErrors}
              onDefinitionChange={onDefinitionChange}
              onSubmit={onSubmit}
              onCancel={onCancel}
            />
          </>
        )}
      </Drawer>
    )
  }
}

export default WidgetEditor
