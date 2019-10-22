import { all, put, call, takeEvery, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import Api from 'services/api'
import Cloud from 'services/cloud'
import actions from './actions'

const getList = ({ resource }) => resource.list;
const getTotal = ({ resource }) => resource.total;

export function* GET_CURRENT({ payload }) {
  try {
    const { objectId, className, requestObjectPermissions, callback } = payload;
    delete payload.objectId;
    delete payload.className;
    const current = yield call(Api.findById, className, objectId, payload);
    let objectPermissions = {};
    if (requestObjectPermissions) {
      const { permissions } = yield call(Cloud.requestObjectPermissions, className, objectId);
      objectPermissions = permissions;
    }
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        current: current || {},
        currentObjectPermissions: objectPermissions,
        objectNotFound: false
      },
    })
    if (callback) yield call(callback);
  } catch (error) {
    if (error.code === 101) {
      yield put({
        type: 'resource/SET_STATE',
        payload: {
          current: {},
          objectNotFound: true
        },
      })
    }
  }
}

export function* CREATE({ payload }) {
  const savingMessage = message.loading('Saving...', 0);
  const { className, data, notify, callback } = payload;

  try {
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        saving: true,
      },
    })
    const resource = yield call(Api.create, className, data);
    const resourceCollection = yield select(getList);
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        current: resource,
        list: resourceCollection.map(i => i.objectId === resource.objectId ? resource : i),
        formErrors: {},
      },
    })
    if (notify){
      notification.success({
        message: "Perfect!",
        description: "Resource created successfully!",
        duration: 1.5
      });
    }
    if (callback) yield call(callback);

  } catch (error) {
    yield call(handleError, error, data, 'create');
  }
  setTimeout(savingMessage, 0);
  yield put({
    type: 'resource/SET_STATE',
    payload: {
      saving: false,
    },
  })
};

export function* UPDATE({ payload }) {
  const savingMessage = message.loading('Updating...', 0);
  const { className, objectId, data, notify = false, clearCurrent = false, callback } = payload;

  try {
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        saving: true,
        current: {objectId, ...data },
      },
    })
    const resource = yield call(Api.update, className, objectId, data)
    const resourceCollection = yield select(getList);
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        current: !clearCurrent ? resource : {},
        list: resourceCollection.map(i => i.objectId === resource.objectId ? resource : i),
        formErrors: {},
      },
    })
    if (notify){
      yield notification.success({
        message: "Perfect!",
        description: "Resource updated successfully",
        duration: 1.5
      });
    }
    if (callback) yield call(callback);
  } catch (error) {
    yield call(handleError, error, {objectId, ...data }, 'update');
  }
  setTimeout(savingMessage, 0);
  yield put({
    type: 'resource/SET_STATE',
    payload: {
      saving: false,
    },
  })
}

export function* GET_DATA({ payload }) {
  yield put({
    type: 'resource/SET_STATE',
    payload: {
      loading: true,
      current: {},
      formErrors: {},
      objectNotFound: false
    },
  })
  
  const { className } = payload;
  delete payload.className;
  try {
    const { results, total } = yield call(Api.find, className, payload)
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        list: results,
        total,
      },
    })
  } catch (error) {
    if (error.code === 209) {
      yield put({
        type: 'user/LOGOUT',
        payload: {},
      })
    }
  }

  yield put({
    type: 'resource/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* REMOVE({ payload }) {
  const savingMessage = message.loading('Removing...', 0);
  const { className, objectId, notify = false, callback } = payload;

  try {
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        saving: true,
      },
    })
    const resource = yield call(Api.remove, className, objectId)
    const resourceCollection = yield select(getList);
    const resourceTotal = yield select(getTotal);
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        current: {},
        list: resourceCollection.filter(i => i.objectId !== resource.objectId),
        total: resourceTotal - 1,
        formErrors: {},
      },
    })
    if (callback) yield call(callback);
    if (notify){
      yield notification.success({
        message: "Perfect!",
        description: "Resource removed successfully",
        duration: 1.5
      });
    }
  } catch (error) {
    yield call(handleError, error, {}, 'remove');
  }
  setTimeout(savingMessage, 0);
  yield put({
    type: 'resource/SET_STATE',
    payload: {
      saving: false,
    },
  })
}

export function* SET_PERMISSIONS({ payload }) {
  const { className, objectId, permissions, notify, callback } = payload;
  try {
    yield call(Api.setPermissions, className, objectId, permissions)
    const { permissions: objectPermissions } = yield call(Cloud.requestObjectPermissions, className, objectId);
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        currentObjectPermissions: objectPermissions,
        objectNotFound: false
      },
    })
    if (notify){
      yield notification.success({
        message: "Perfect!",
        description: "Resource permissions configured successfully",
        duration: 1.5
      });
    }
    if (callback) yield call(callback);
  } catch (error) {
    yield call(handleError, error, {}, 'set permissions to');
  }
}

export function* CLEAR_CURRENT({ payload }) {
  const { callback } = payload;
  yield put({
    type: 'resource/SET_STATE',
    payload: {
      current: {},
      currentObjectPermissions: {},
    },
  });
  if (callback) yield call(callback);
}

function* handleError(error, data, operation) {
  const { code, message: msg } = error;
  let detail;
  switch (code) {
    case Api.ErrorCodes.INVALID_SESSION_TOKEN:
      yield put({
        type: 'user/LOGOUT',
        payload: {},
      })
      break;
    case Api.ErrorCodes.VALIDATION_ERROR:
      yield put({
        type: 'resource/SET_STATE',
        payload: {
          current: data,
        },
      })
      detail = msg;
      break;
    case 400:
      yield put({
        type: 'resource/SET_STATE',
        payload: {
          current: data,
          formErrors: JSON.parse(msg),
        },
      })
      break
    default:
      console.log(error);
      break;
  }
  let description = `Error trying to ${operation} the resource.`;
  if (detail) description += ` Detail: ${detail}`;

  yield notification.error({
    message: "Oops!",
    description
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_CURRENT, GET_CURRENT),
    takeEvery(actions.UPDATE, UPDATE),
    takeEvery(actions.CREATE, CREATE),
    takeEvery(actions.REMOVE, REMOVE),
    takeEvery(actions.CLEAR_CURRENT, CLEAR_CURRENT),
    takeEvery(actions.SET_PERMISSIONS, SET_PERMISSIONS),
  ])
}
