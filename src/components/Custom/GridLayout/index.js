import React from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import sizeMe from 'react-sizeme'
import GridItem from '../GridItem'

import 'react-grid-layout/css/styles.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-resizable/css/styles.css'
import './styles.scss'

class GridLayout extends React.Component {
  static defaultProps = {
    layouts: {},
    widgets: [],
    onLayoutChange: (layout, layouts) => console.log(layout, layouts),
    rowHeight: 30,
    isDraggable: true,
    isResizable: true,
    widgetsHoverable: true,
    widgetsEditable: true,
    stopUpdates: false,
  }

  shouldComponentUpdate(nextProps) {
    const { stopUpdates } = nextProps
    return !stopUpdates
  }

  render() {
    const {
      size,
      layouts,
      onLayoutChange,
      onSaveWidget,
      onEditButtonClick,
      onRemoveButtonClick,
      rowHeight,
      isDraggable,
      isResizable,
      widgetsHoverable,
      widgetsEditable,
      widgets,
    } = this.props

    return (
      <ResponsiveGridLayout
        // style={{ backgroundColor: '#ffff0073' }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        className="layout"
        layouts={layouts}
        rowHeight={rowHeight}
        verticalCompact
        width={size.width}
        onLayoutChange={onLayoutChange}
        isDraggable={isDraggable}
        isResizable={isResizable}
      >
        {widgets.map(w => (
          /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
          <div key={w.key} data-grid={{ x: 0, y: Infinity, w: 4, h: 8, minW: 2, minH: 4 }}>
            <GridItem
              itemDef={w}
              hoverable={widgetsHoverable}
              editable={widgetsEditable}
              onSaveWidget={onSaveWidget}
              onEditButtonClick={onEditButtonClick}
              onRemoveButtonClick={onRemoveButtonClick}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    )
  }
}

export default sizeMe({ refreshMode: 'debounce', refreshRate: 100 })(GridLayout)
