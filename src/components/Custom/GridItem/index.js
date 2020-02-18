import React, { Suspense } from 'react'
import { withSize } from 'react-sizeme'
import { Card, Button, Input, Modal } from 'antd'
import Types from '../../WidgetsComponents/types'

import './styles.scss'

const { confirm } = Modal

let Component = () => <div>No widget Found</div>

const registerComponent = component => {
  Component = component
}

const propsByType = itemDef => {
  const { LINE_CHART } = Types

  switch (itemDef.type) {
    case LINE_CHART:
      return { series: itemDef.series }
    default:
      break
  }
  return {}
}

class GridItem extends React.Component {
  static defaultProps = {
    itemDef: {},
    hoverable: true,
    editable: true,
    dynamicSize: true,
    bordered: true,
    onSaveWidget: itemDef => console.log(`Save widget ${itemDef}`),
    onRemoveButtonClick: itemDef => console.log(`Remove widget ${itemDef}`),
    onEditButtonClick: () => console.log(`Button Edit clicked`),
  }

  state = {
    componentLoaded: false,
    showTitleInput: false,
    currentTitle: '',
  }

  constructor(props) {
    super(props)
    this.editTitle = this.editTitle.bind(this)
    this.saveTitle = this.saveTitle.bind(this)
    this.inputTitleChange = this.inputTitleChange.bind(this)
    this.handleRemoveClick = this.handleRemoveClick.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
  }

  componentDidMount() {
    const { itemDef } = this.props
    const { LINE_CHART } = Types

    switch (itemDef.type) {
      case LINE_CHART:
        registerComponent(React.lazy(() => import('../../WidgetsComponents/LineChart')))
        break
      default:
        break
    }
    this.setState({ componentLoaded: true })
  }

  inputTitleChange(e) {
    this.setState({ currentTitle: e.currentTarget.value })
  }

  editTitle() {
    const { editable } = this.props
    if (editable) {
      this.setState({ showTitleInput: true })
    }
  }

  saveTitle() {
    const { onSaveWidget, itemDef } = this.props
    const { currentTitle } = this.state
    this.setState({ showTitleInput: false }, () => {
      if (currentTitle !== '') {
        const newItemDef = { ...itemDef, title: currentTitle }
        onSaveWidget(newItemDef)
      }
    })
  }

  handleRemoveClick() {
    const { onRemoveButtonClick, itemDef } = this.props
    confirm({
      title: 'Do you want to delete this widget?',
      content: 'All changes will be lost.',
      okType: 'danger',
      onOk() {
        onRemoveButtonClick(itemDef)
      },
    })
  }

  handleEditClick() {
    const { onEditButtonClick, itemDef } = this.props
    onEditButtonClick(itemDef)
  }

  render() {
    const { hoverable, editable, itemDef, size, dynamicSize, bordered } = this.props
    const { componentLoaded } = this.state
    const { showTitleInput } = this.state
    const { title = 'title' } = itemDef
    const componentProps = propsByType(itemDef)
    return (
      <Card
        className="GridItem"
        size="small"
        hoverable={hoverable}
        bordered={bordered}
        title={
          <div onDoubleClick={this.editTitle}>
            {showTitleInput ? (
              <Input
                placeholder="Write a Title"
                allowClear
                onPressEnter={this.saveTitle}
                onBlur={this.saveTitle}
                onChange={this.inputTitleChange}
                defaultValue={title}
                onMouseDown={e => e.stopPropagation()}
              />
            ) : (
              title
            )}
          </div>
        }
        extra={
          editable && (
            <>
              <Button
                type="default"
                icon="edit"
                size="small"
                onClick={this.handleEditClick}
                style={{ marginRight: 5 }}
                // shape="circle"
                onMouseDown={e => e.stopPropagation()}
              />
              <Button
                type="danger"
                icon="delete"
                size="small"
                onClick={this.handleRemoveClick}
                // shape="circle"
                onMouseDown={e => e.stopPropagation()}
              />
            </>
          )
        }
      >
        {/* <LineChart series={itemDef.series} height={dynamicSize ? size.height : null} /> */}
        <Suspense fallback={<div>Loading...</div>}>
          {componentLoaded && (
            <Component height={dynamicSize ? size.height : null} {...componentProps} />
          )}
        </Suspense>
      </Card>
    )
  }
}

export default withSize({ monitorHeight: true })(GridItem)
