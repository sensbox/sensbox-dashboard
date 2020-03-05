import { all, put, call, takeEvery } from 'redux-saga/effects'
import { message, notification } from 'antd'
import Device from 'services/device'

import actions from './actions'

function* loading() {
  yield put({
    type: 'device/SET_STATE',
    payload: { isFetching: true, lastError: null },
  })
}

function* receiveKey(response) {
  notification.success({
    message: 'Success',
    description: 'Device Key retrieved ',
  })

  const res = {
    isFetching: false,
    lastError: null,
    deviceKey: response.key,
    lastUpdated: Date.now(),
  }

  yield put({
    type: 'device/SET_STATE',
    payload: res,
  })
}

function* setError(err) {
  notification.error({
    message: 'Oops! Something went wrong! ',
    description: err.message,
  })

  yield put({
    type: 'device/SET_STATE',
    payload: { lastUpdated: Date.now(), isFetching: false, lastError: err },
  })
}

export function* FETCH_KEY({ payload }) {
  const query = payload
  const loadingMessage = message.loading('Getting Device Key from server... ', 0)
  yield call(loading)
  try {
    const response = yield call(Device.getKey, query)
    yield call(receiveKey, response)
  } catch (error) {
    yield call(setError, error)
  }
  setTimeout(loadingMessage, 0)
}

export function* CLEAR_KEY() {
  yield put({
    type: 'device/SET_STATE',
    payload: {
      deviceKey: null,
      receivedAt: Date.now(),
    },
  })
}

export function copyingToClipboard() {
  return () => {
    notification.success({
      message: 'Device Key copied to the clipboard ',
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_KEY, FETCH_KEY),
    // takeEvery(actions.REQUEST_KEY, requestKey),
    takeEvery(actions.CLEAR_KEY, CLEAR_KEY),
  ])
}
