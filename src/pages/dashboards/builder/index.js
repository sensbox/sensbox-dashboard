import React from 'react'
import { PageHeader, Button } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import GridLayout from 'components/Custom/GridLayout'
import WidgetsCatalog from 'components/Custom/WidgetsCatalog'
import WidgetEditor from 'components/Custom/WidgetEditor'

const mapStateToProps = ({ resource, user, builder }) => ({
  list: resource.list,
  total: resource.total,
  loading: resource.loading,
  current: resource.current,
  layouts: builder.layouts,
  widgets: builder.widgets,
  stopGridLayoutUpdates: builder.stopGridLayoutUpdates,
  currentWidget: builder.currentWidget,
  currentWidgetErrors: builder.currentWidgetErrors,
  showWidgetEditor: builder.showWidgetEditor,
  showWidgetsCatalog: builder.showWidgetsCatalog,
  user,
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

  const addWidget = (type, callback) =>
    dispatch({
      type: 'builder/ADD_WIDGET',
      payload: {
        type,
        callback,
      },
    })

  const openWidgetCatalog = callback => {
    dispatch({
      type: 'builder/OPEN_WIDGET_CATALOG',
      payload: {
        callback,
      },
    })
  }

  const closeWidgetCatalog = callback => {
    dispatch({
      type: 'builder/CLOSE_WIDGET_CATALOG',
      payload: {
        callback,
      },
    })
  }

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
    openWidgetCatalog,
    closeWidgetCatalog,
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
    }

    this.saveBuild = this.saveBuild.bind(this)
    this.goToDashboard = this.goToDashboard.bind(this)

    getCurrentDashboard(params.uuid, () => {
      const { current } = this.props
      const { layouts, widgets } = current
      initBuilder(layouts, widgets)
    })
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
      showWidgetsCatalog,
      openWidgetEditor,
      closeWidgetEditor,
      openWidgetCatalog,
      closeWidgetCatalog,
      removeWidget,
      updateCurrentWidget,
      updateLayouts,
      addWidget,
    } = this.props

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
                onClick={() => openWidgetCatalog()}
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
          builderMode
        />
        <WidgetsCatalog
          visible={showWidgetsCatalog}
          onClose={closeWidgetCatalog}
          onAdd={addWidget}
        />
        <WidgetEditor
          widget={currentWidget}
          widgetErrors={currentWidgetErrors}
          visible={showWidgetEditor}
          onDefinitionChange={updateCurrentWidget}
          onSubmit={commitWidgetChanges}
          onCancel={closeWidgetEditor}
        />
      </div>
    )
  }
}

export default DashboardBuilder
