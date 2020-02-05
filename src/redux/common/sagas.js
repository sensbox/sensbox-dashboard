import { all, put, select, takeEvery } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'connected-react-router'
import { matchPath } from 'react-router'
import { routes } from '../../router'

export function* CLEAR_ALL({ payload }) {
  const location = yield select(({ common }) => common.location)

  if (!location || location.pathname !== payload.location.pathname) {
    const currentRoute = routes.find(route => matchPath(payload.location.pathname, route))
    console.log(currentRoute)
    yield put({
      type: 'common/SET_STATE',
      payload: {
        location: payload.location,
        selectedKeys: currentRoute && currentRoute.menuKey ? [currentRoute.menuKey] : [],
      },
    })

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
    })
  }
}

export default function* rootSaga() {
  yield all([takeEvery(LOCATION_CHANGE, CLEAR_ALL)])
}
