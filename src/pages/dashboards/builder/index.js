import React from 'react'
import { PageHeader, Button, Drawer, Tabs, Card, Divider } from 'antd'
import shortid from 'shortid'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import GridLayout from '../../../components/Custom/GridLayout'
import EditWidgetForm from '../form/editWidget'
import GridItem from '../../../components/Custom/GridItem'
import Types from '../../../components/WidgetsComponents/types'

import styles from './style.module.scss'

const { TabPane } = Tabs
const { Meta } = Card

const mapStateToProps = ({ resource, user, builder }) => ({
  list: resource.list,
  total: resource.total,
  loading: resource.loading,
  current: resource.current,
  user,
  layouts: builder.layouts,
  widgets: builder.widgets,
  stopGridLayoutUpdates: builder.stopGridLayoutUpdates,
  currentWidget: builder.currentWidget,
  currentWidgetErrors: builder.currentWidgetErrors,
  showWidgetEditor: builder.showWidgetEditor,
})

const mapDispatchToProps = dispatch => {
  const updateDashboard = (objectId, layouts, widgets, callback) =>
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Dashboard',
        objectId,
        data: {
          layouts,
          widgets,
        },
        notify: true,
        callback,
      },
    })

  const getCurrentDashboard = (uuid, callback) =>
    dispatch({
      type: 'resource/GET_CURRENT',
      payload: {
        className: 'Dashboard',
        where: {
          uuid,
        },
        callback,
      },
    })

  const initBuilder = (layouts, widgets, callback) => {
    dispatch({
      type: 'builder/INIT',
      payload: {
        layouts,
        widgets,
        callback,
      },
    })
  }

  const updateLayouts = (layouts, callback) =>
    dispatch({
      type: 'builder/UPDATE_LAYOUTS',
      payload: {
        layouts,
        callback,
      },
    })

  const addWidget = (widget, callback) =>
    dispatch({
      type: 'builder/ADD_WIDGET',
      payload: {
        widget,
        callback,
      },
    })

  const openWidgetEditor = (currentWidget, callback) => {
    dispatch({
      type: 'builder/OPEN_WIDGET_EDITOR',
      payload: {
        currentWidget,
        callback,
      },
    })
  }

  const closeWidgetEditor = callback => {
    dispatch({
      type: 'builder/CLOSE_WIDGET_EDITOR',
      payload: {
        callback,
      },
    })
  }

  const updateCurrentWidget = (currentWidget, currentWidgetErrors = {}, callback) =>
    dispatch({
      type: 'builder/UPDATE_CURRENT_WIDGET',
      payload: {
        currentWidget,
        currentWidgetErrors,
        callback,
      },
    })

  const commitWidgetChanges = (widget, callback) =>
    dispatch({
      type: 'builder/COMMIT_WIDGET_CHANGES',
      payload: {
        widget,
        callback,
      },
    })

  const removeWidget = (widget, callback) =>
    dispatch({
      type: 'builder/REMOVE_WIDGET',
      payload: {
        widget,
        callback,
      },
    })

  return {
    initBuilder,
    updateLayouts,
    updateDashboard,
    getCurrentDashboard,
    addWidget,
    updateCurrentWidget,
    commitWidgetChanges,
    removeWidget,
    openWidgetEditor,
    closeWidgetEditor,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class DashboardBuilder extends React.Component {
  constructor(props) {
    super(props)
    const { match, getCurrentDashboard, initBuilder } = props
    const { params } = match

    // console.log(params.uuid);
    this.state = {
      backLink: `/dashboards/${params.uuid}`,
      showAddWidgetPanel: false,
    }

    this.saveBuild = this.saveBuild.bind(this)
    this.goToDashboard = this.goToDashboard.bind(this)
    this.showAddWidgetPanel = this.showAddWidgetPanel.bind(this)
    this.closeAddWidgetPanel = this.closeAddWidgetPanel.bind(this)
    this.onAddWidget = this.onAddWidget.bind(this)

    getCurrentDashboard(params.uuid, () => {
      const { current } = this.props
      const { layouts, widgets } = current
      initBuilder(layouts, widgets)
    })
  }

  onAddWidget(type) {
    const key = shortid.generate()
    const { addWidget } = this.props
    const widget = {
      key,
      type,
      title: type,
    }

    addWidget(widget, () => this.setState({ showAddWidgetPanel: false }))
  }

  goToDashboard() {
    const { history } = this.props
    const { backLink } = this.state
    history.replace({ pathname: backLink })
  }

  saveBuild() {
    const { layouts, widgets, current, updateDashboard } = this.props
    updateDashboard(current.objectId, layouts, widgets, this.goToDashboard)
  }

  showAddWidgetPanel() {
    this.setState({ showAddWidgetPanel: true })
  }

  closeAddWidgetPanel() {
    this.setState({ showAddWidgetPanel: false })
  }

  render() {
    const {
      layouts,
      widgets,
      current,
      currentWidget,
      currentWidgetErrors,
      stopGridLayoutUpdates,
      commitWidgetChanges,
      showWidgetEditor,
      openWidgetEditor,
      closeWidgetEditor,
      removeWidget,
      updateCurrentWidget,
      updateLayouts,
    } = this.props
    const { showAddWidgetPanel } = this.state

    return (
      <div>
        <Helmet title="Dashboard Buider" />
        <PageHeader
          className="mb-2"
          ghost={false}
          title="Dashboard Builder"
          subTitle={current.name}
          extra={[
            <div key="actions">
              <Button
                key="addBtn"
                type="link"
                icon="plus"
                onClick={this.showAddWidgetPanel}
                style={{ marginRight: 10 }}
              >
                Add Widget
              </Button>
              <Button
                key="cancelBtn"
                icon="close-circle"
                onClick={this.goToDashboard}
                style={{ marginRight: 10 }}
              >
                Cancel
              </Button>
              <Button key="saveBtn" type="primary" icon="save" onClick={this.saveBuild}>
                Save
              </Button>
            </div>,
          ]}
        />
        <GridLayout
          layouts={layouts}
          widgets={widgets}
          onLayoutChange={(newLayout, newLayouts) => updateLayouts(newLayouts)}
          onSaveWidget={widget => commitWidgetChanges(widget)}
          onEditButtonClick={widget => openWidgetEditor(widget)}
          onRemoveButtonClick={widget => removeWidget(widget)}
          stopUpdates={stopGridLayoutUpdates}
        />
        <Drawer
          title={<div className={styles.drawerTitle}>Add Widgets</div>}
          bodyStyle={{ padding: 10 }}
          width={450}
          placement="right"
          closable={false}
          onClose={this.closeAddWidgetPanel}
          visible={showAddWidgetPanel}
          // destroyOnClose
        >
          <Tabs defaultActiveKey="1" onChange={key => console.log(key)}>
            <TabPane tab="Historic" key="1">
              <Card hoverable onClick={() => this.onAddWidget(Types.LINE_CHART)}>
                <Meta title="Line Chart" description="Basic Line chart" />
              </Card>
            </TabPane>
            <TabPane tab="Real Time" key="2">
              REAL TIME WIDGETS
            </TabPane>
          </Tabs>
        </Drawer>
        <Drawer
          title={<div className={styles.drawerTitle}>Edit Widget</div>}
          bodyStyle={{ padding: 10 }}
          // height="95%"
          width="80%"
          placement="right"
          onClose={() => closeWidgetEditor()}
          visible={showWidgetEditor}
          closable
          destroyOnClose
        >
          <div className={styles.widgetPreview}>
            <GridItem
              itemDef={currentWidget}
              dynamicSize={false}
              hoverable={false}
              editable={false}
              bordered={false}
            />
          </div>
          <Divider className={styles.divider} dashed />
          <EditWidgetForm
            itemDef={currentWidget}
            errors={currentWidgetErrors}
            onDefinitionChange={(widget, widgetErrors) => updateCurrentWidget(widget, widgetErrors)}
            onSubmit={widget => commitWidgetChanges(widget)}
            onCancel={() => closeWidgetEditor()}
          />
        </Drawer>
      </div>
    )
  }
}

export default DashboardBuilder
