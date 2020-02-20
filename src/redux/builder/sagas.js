import { all, call, takeEvery, put, select } from 'redux-saga/effects'
import shortid from 'shortid'
import actions from './actions'

const getWidgets = ({ builder }) => {
  return builder.widgets
}

export function* INIT({ payload }) {
  const { layouts, widgets, callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      layouts,
      widgets,
    },
  })
  if (callback) yield call(callback)
}

export function* UPDATE_LAYOUTS({ payload }) {
  const { layouts, callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      layouts,
    },
  })
  if (callback) yield call(callback)
}

export function* ADD_WIDGET({ payload }) {
  const { type, callback } = payload
  const key = shortid.generate()
  const defaultSerieKey = shortid.generate()
  const defaultAxisKey = shortid.generate()

  const widget = {
    key,
    type,
    title: type,
    series: [
      {
        id: defaultSerieKey,
        axisId: defaultAxisKey,
      },
    ],
    axes: [
      {
        id: defaultAxisKey,
      },
    ],
  }

  const currentWidgets = yield select(getWidgets)
  yield put({
    type: 'builder/SET_STATE',
    payload: {
      widgets: [...currentWidgets, widget],
      showWidgetsCatalog: false,
      stopGridLayoutUpdates: false,
    },
  })
  if (callback) yield call(callback)
}

export function* OPEN_WIDGET_EDITOR({ payload }) {
  const { currentWidget, currentWidgetErrors = [], callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      currentWidget,
      currentWidgetErrors,
      stopGridLayoutUpdates: true,
      showWidgetEditor: true,
    },
  })
  if (callback) yield call(callback)
}

export function* CLOSE_WIDGET_EDIOR({ payload }) {
  const { callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      showWidgetEditor: false,
      currentWidget: null,
      currentWidgetErrors: [],
      stopGridLayoutUpdates: false,
    },
  })
  if (callback) yield call(callback)
}

export function* OPEN_WIDGET_CATALOG({ payload }) {
  const { callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      showWidgetsCatalog: true,
      stopGridLayoutUpdates: true,
    },
  })
  if (callback) yield call(callback)
}

export function* CLOSE_WIDGET_CATALOG({ payload }) {
  const { callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      showWidgetsCatalog: false,
      stopGridLayoutUpdates: false,
    },
  })
  if (callback) yield call(callback)
}

export function* UPDATE_CURRENT_WIDGET({ payload }) {
  const { currentWidget, currentWidgetErrors = [], callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      currentWidget,
      currentWidgetErrors,
      stopGridLayoutUpdates: true,
    },
  })
  if (callback) yield call(callback)
}

export function* REMOVE_WIDGET({ payload }) {
  const { widget, callback } = payload
  const currentWidgets = yield select(getWidgets)
  const widgets = currentWidgets.filter(w => w.key !== widget.key)

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      widgets,
    },
  })
  if (callback) yield call(callback)
}

export function* COMMIT_WIDGET_CHANGES({ payload }) {
  const { widget, callback } = payload
  const currentWidgets = yield select(getWidgets)
  const widgets = currentWidgets.map(w => {
    if (w.key === widget.key) return widget
    return w
  })

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      widgets,
      currentWidget: null,
      showWidgetEditor: false,
      stopGridLayoutUpdates: false,
    },
  })
  if (callback) yield call(callback)
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.INIT, INIT),
    takeEvery(actions.UPDATE_LAYOUTS, UPDATE_LAYOUTS),
    takeEvery(actions.ADD_WIDGET, ADD_WIDGET),
    takeEvery(actions.UPDATE_CURRENT_WIDGET, UPDATE_CURRENT_WIDGET),
    takeEvery(actions.COMMIT_WIDGET_CHANGES, COMMIT_WIDGET_CHANGES),
    takeEvery(actions.REMOVE_WIDGET, REMOVE_WIDGET),
    takeEvery(actions.OPEN_WIDGET_EDITOR, OPEN_WIDGET_EDITOR),
    takeEvery(actions.CLOSE_WIDGET_EDIOR, CLOSE_WIDGET_EDIOR),
    takeEvery(actions.OPEN_WIDGET_CATALOG, OPEN_WIDGET_CATALOG),
    takeEvery(actions.CLOSE_WIDGET_CATALOG, CLOSE_WIDGET_CATALOG),
  ])
}
