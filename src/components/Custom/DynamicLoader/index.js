import React, { Suspense } from 'react'
import Types from 'components/WidgetsComponents/types'

const componentsMap = new Map()

const DynamicLoader = ({ type, height, widgetConfiguration, builderMode }) => {
  const { LINE_CHART } = Types
  let LazyComponent

  if (componentsMap.has(type)) {
    LazyComponent = componentsMap.get(type)
  } else {
    switch (type) {
      case LINE_CHART:
        LazyComponent = React.lazy(() => import('components/WidgetsComponents/LineChart'))
        componentsMap.set(type, LazyComponent)
        break
      default:
        LazyComponent = () => <div>Widget Not Found</div>
        break
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent
        height={height}
        widgetConfiguration={widgetConfiguration}
        builderMode={builderMode}
      />
    </Suspense>
  )
}

export default DynamicLoader
