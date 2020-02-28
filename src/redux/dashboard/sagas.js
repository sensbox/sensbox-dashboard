import { all, call, takeEvery, put } from 'redux-saga/effects'
import actions from './actions'

export function* CHANGE_DATES_RANGE({ payload }) {
  const { startDate, endDate, callback } = payload

  yield put({
    type: 'dashboard/SET_STATE',
    payload: {
      startDate,
      endDate,
    },
  })
  if (callback) yield call(callback)
}

export default function* rootSaga() {
  yield all([takeEvery(actions.CHANGE_DATES_RANGE, CHANGE_DATES_RANGE)])
}
