import React, { Suspense } from 'react'
import Types from '../types'

const componentsMap = new Map()

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

const DynamicLoader = ({ type, height, extraProps }) => {
  const { LINE_CHART } = Types
  let LazyComponent
  const componentProps = propsByType(extraProps)

  if (componentsMap.has(type)) {
    LazyComponent = componentsMap.get(type)
  } else {
    switch (type) {
      case LINE_CHART:
        LazyComponent = React.lazy(() => import('../LineChart'))
        componentsMap.set(type, LazyComponent)
        break
      default:
        LazyComponent = () => <div>Widget Not Found</div>
        break
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent height={height} {...componentProps} />
    </Suspense>
  )
}

export default DynamicLoader
