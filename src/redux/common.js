import { all, put, call, takeEvery } from 'redux-saga/effects'

export function* CLEAR_ALL({ payload }) {
  const { callback } = payload;
  yield put({
    type: 'resource/SET_STATE',
    payload: {
      list: [],
      formErrors: {},
      current: {},
      currentObjectPermissions: {},
      objectNotFound: false,
      total: 0,
      loading: false,
      saving: false,
    },
  });
  if (callback) yield call(callback);
}

export default function* rootSaga() {
  yield all([
    takeEvery('@@router/LOCATION_CHANGE', CLEAR_ALL),
  ])
}