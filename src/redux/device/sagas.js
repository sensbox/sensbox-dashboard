
import { all, put, call, takeEvery } from 'redux-saga/effects'
import { notification } from 'antd'
import Device from 'services/device'

import actions from './actions'

function* loading(){

  notification.info({
    message: 'Getting Device Key from server... ',
    description: ``,
  })

  yield put({
    type: 'device/SET_STATE',
    payload: { isFetching: true, lastError: null }
  })
}

function* receiveKey(response){

  notification.success({
    message: 'Device Key retrieved ',
    description: ``,
  })

  const res = {
    isFetching: false,
    lastError: null,
    deviceKey: response.key,
    lastUpdated: Date.now()
  };

  yield put({
    type: 'device/SET_STATE',
    payload: res
  });

}

function* setError(err){

  notification.error({
    message: 'Oops! Something went wrong! ',
    description: `${err}`,
  })

  yield put({
    type: 'device/SET_STATE',
    payload: { key: '', lastUpdated: Date.now(), isFetching: false, lastError: err }
  })
}



export function* FETCH_KEY({ payload }) {
  const query = payload;

  yield call(loading);

  try {

    const response = yield call(Device.getKey, query)
    
    yield call(receiveKey, response);

  } catch (error) {

    yield call(setError, error);

  }

}

export function* CLEAR_KEY() {

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
    takeEvery(actions.FETCH_KEY, FETCH_KEY),
    // takeEvery(actions.REQUEST_KEY, requestKey),
    takeEvery(actions.CLEAR_KEY, CLEAR_KEY)
  ])
}



