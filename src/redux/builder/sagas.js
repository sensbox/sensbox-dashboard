import { all, call, takeEvery, put } from 'redux-saga/effects'
import actions from './actions'

export function* EDIT_WIDGET({ payload }) {
  const { currentWidget, currentWidgetErrors = [], callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      currentWidget,
      currentWidgetErrors,
    },
  })
  if (callback) yield call(callback)
}

export function* CLEAR_WIDGET({ payload }) {
  const { callback } = payload

  yield put({
    type: 'builder/SET_STATE',
    payload: {
      currentWidget: {},
      currentWidgetErrors: {},
    },
  })
  if (callback) yield call(callback)
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_WIDGET, EDIT_WIDGET),
    takeEvery(actions.CLEAR_WIDGET, CLEAR_WIDGET),
  ])
}
