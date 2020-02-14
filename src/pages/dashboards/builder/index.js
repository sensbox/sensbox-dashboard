import React from 'react'
import { PageHeader, Button, Drawer, Tabs, Card, Divider } from 'antd'
import shortid from 'shortid'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import GridLayout from '../../../components/Custom/GridLayout'

import styles from './style.module.scss'
import EditWidgetForm from '../form/editWidget'
import GridItem from '../../../components/Custom/GridItem'

const { TabPane } = Tabs
const { Meta } = Card

const mapStateToProps = ({ resource, user, builder }) => ({
  list: resource.list,
  total: resource.total,
  loading: resource.loading,
  current: resource.current,
  user,
  editingWidget: builder.currentWidget,
  editingWidgetErrors: builder.currentWidgetErrors,
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

  const editWidget = (currentWidget, currentWidgetErrors = {}, callback) =>
    dispatch({
      type: 'builder/EDIT_WIDGET',
      payload: {
        currentWidget,
        currentWidgetErrors,
        callback,
      },
    })
  const clearWidget = callback =>
    dispatch({
      type: 'builder/CLEAR_WIDGET',
      payload: {
        callback,
      },
    })

  return {
    updateDashboard,
    getCurrentDashboard,
    editWidget,
    clearWidget,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class DashboardBuilder extends React.Component {
  constructor(props) {
    super(props)
    const { match, getCurrentDashboard } = props
    const { params } = match

    // console.log(params.uuid);
    this.state = {
      backLink: `/dashboards/${params.uuid}`,
      layouts: [],
      widgets: [],
      showAddWidgetPanel: false,
      showEditWidgetPanel: false,
      stopGridLayoutUpdates: false,
    }

    this.saveLayout = this.saveLayout.bind(this)
    this.saveBuild = this.saveBuild.bind(this)
    this.goToDashboard = this.goToDashboard.bind(this)
    this.showAddWidgetPanel = this.showAddWidgetPanel.bind(this)
    this.closeAddWidgetPanel = this.closeAddWidgetPanel.bind(this)
    this.addWidget = this.addWidget.bind(this)
    this.saveWidget = this.saveWidget.bind(this)
    this.removeWidget = this.removeWidget.bind(this)
    this.showEditWidgetPanel = this.showEditWidgetPanel.bind(this)
    this.closeEditWidgetPanel = this.closeEditWidgetPanel.bind(this)
    this.onSubmitEditForm = this.onSubmitEditForm.bind(this)
    this.onCancelEditForm = this.onCancelEditForm.bind(this)
    this.saveEditingWidget = this.saveEditingWidget.bind(this)

    getCurrentDashboard(params.uuid, () => {
      const { current } = this.props
      const { layouts, widgets } = current
      this.setState({ layouts, widgets })
    })
  }

  onSubmitEditForm(itemDef) {
    console.log(itemDef)
    this.saveWidget(itemDef)
    this.closeEditWidgetPanel()
  }

  onCancelEditForm() {
    this.closeEditWidgetPanel()
  }

  saveLayout(layout, layouts) {
    this.setState({ layouts })
  }

  goToDashboard() {
    const { history } = this.props
    const { backLink } = this.state
    history.replace({ pathname: backLink })
  }

  saveBuild() {
    const { current, updateDashboard } = this.props
    const { layouts, widgets } = this.state
    updateDashboard(current.objectId, layouts, widgets, this.goToDashboard)
  }

  addWidget(type) {
    const key = shortid.generate()
    const { widgets } = this.state
    this.setState({
      widgets: [
        ...widgets,
        {
          key,
          type,
          title: type,
        },
      ],
      showAddWidgetPanel: false,
    })
  }

  saveWidget(itemDef) {
    const { widgets: currentWidgets } = this.state
    const widgets = currentWidgets.map(w => {
      if (w.key === itemDef.key) return itemDef
      return w
    })
    this.setState({ widgets })
  }

  removeWidget(itemDef) {
    const { widgets: currentWidgets } = this.state
    const widgets = currentWidgets.filter(w => w.key !== itemDef.key)
    this.setState({ widgets })
  }

  showAddWidgetPanel() {
    this.setState({ showAddWidgetPanel: true })
  }

  closeAddWidgetPanel() {
    this.setState({ showAddWidgetPanel: false })
  }

  showEditWidgetPanel(itemDef) {
    const { editWidget } = this.props
    editWidget(itemDef, {}, () =>
      this.setState({ stopGridLayoutUpdates: true, showEditWidgetPanel: true }),
    )
  }

  closeEditWidgetPanel() {
    const { clearWidget } = this.props
    clearWidget(() => this.setState({ stopGridLayoutUpdates: false, showEditWidgetPanel: false }))
  }

  saveEditingWidget(itemDef, errors) {
    const { editWidget } = this.props
    editWidget(itemDef, errors)
  }

  render() {
    const { current, editingWidget, editingWidgetErrors } = this.props
    const {
      layouts,
      widgets,
      showAddWidgetPanel,
      showEditWidgetPanel,
      stopGridLayoutUpdates,
    } = this.state

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
          onLayoutChange={this.saveLayout}
          onSaveWidget={this.saveWidget}
          onEditButtonClick={this.showEditWidgetPanel}
          onRemoveButtonClick={this.removeWidget}
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
              <Card hoverable onClick={() => this.addWidget('lineChart')}>
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
          onClose={this.closeEditWidgetPanel}
          visible={showEditWidgetPanel}
          closable
          destroyOnClose
        >
          <div className={styles.widgetPreview}>
            <GridItem
              itemDef={editingWidget}
              dynamicSize={false}
              hoverable={false}
              editable={false}
              bordered={false}
            />
          </div>
          <Divider className={styles.divider} dashed />
          <EditWidgetForm
            itemDef={editingWidget}
            errors={editingWidgetErrors}
            onDefinitionChange={this.saveEditingWidget}
            onSubmit={this.onSubmitEditForm}
            onCancel={this.onCancelEditForm}
          />
        </Drawer>
      </div>
    )
  }
}

export default DashboardBuilder
