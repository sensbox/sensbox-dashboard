
import { all, put, call, takeEvery } from 'redux-saga/effects'
import { notification } from 'antd'
import Device from 'services/device'

import actions from './actions'

function* loading(){
  yield put({
    type: 'device/SET_STATE',
    payload: { isFetching: true, didInvalidate: false }
  })
}

function* receiveKey(response){

  const res = {
    isFetching: false,
    didInvalidate: false,
    deviceKey: response.key,
    lastUpdated: Date.now()
  };

  yield put({
    type: 'device/SET_STATE',
    payload: res
  });

}



export function* fetchKeyAction({ payload }) {
  const query = payload;

  yield call(loading);

  notification.info({
    message: 'Getting Device Key from server... ',
    description: ``,
  })

  try {
    const response = yield call(Device.getKey, query)
    
    yield call(receiveKey, response);

    notification.success({
      message: 'Device Key retrieved ',
      description: ``,
    })

  } catch (error) {

    notification.error({
      message: 'Oops! Something went wrong! ',
      description: `${error}`,
    })

    yield put({
      type: 'device/SET_STATE',
      payload: { key: '', lastUpdated: Date.now(), isFetching: false, didInvalidate: true }
    })
  }

}

export function* clearKey() {

  yield put({
    type: 'device/SET_STATE',
    payload: {
      deviceKey: '',
      receivedAt: Date.now()
    }
  })
}

export function copyingToClipboard() {
  return () => {
    notification.success({
      message: 'Device Key copied to the clipboard '
    });
  }
}


export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_KEY, fetchKeyAction),
    // takeEvery(actions.REQUEST_KEY, requestKey),
    takeEvery(actions.CLEAR_KEY, clearKey)
  ])
}



