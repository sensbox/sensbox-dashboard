import { all, put, call, takeEvery } from 'redux-saga/effects'
import { notification, message } from 'antd'
import Sensor from 'services/sensor'
import actions from './actions'

export function* GET_CURRENT({ payload }) {
  try {
    const { objectId, callback } = payload;
    delete payload.objectId;
    const current = yield call(Sensor.findById, objectId, payload);
    yield put({
      type: 'sensor/SET_STATE',
      payload: {
        current: current || {},
        objectNotFound: false
      },
    })
    if (callback) yield call(callback);
  } catch (error) {
    yield call(handleError, error);
  }
}

export function* CREATE({ payload }) {
  const savingMessage = message.loading('Saving...', 0);
  const { data, successCallback, notify} = payload;

  try {
    yield put({
      type: 'sensor/SET_STATE',
      payload: {
        saving: true,
      },
    })
    const resource = yield call(Sensor.create, data);
    yield call(successCallback);
    yield put({ type: 'sensor/CLEAR' })
    yield put({
      type: 'resource/GET_CURRENT',
      payload: {
        className: 'Device',
        objectId: resource.device.objectId,
      },
    })


    if (notify){
      notification.success({
        message: "Success!",
        description: "Sensor added successfully!",
        duration: 1.5
      });
    }
  } catch (error) {
    yield call(handleError, error, data);
    notification.error({
      message: "Oops!",
      description: "Error trying to add the sensor",
    });
  }
  setTimeout(savingMessage, 0);
  yield put({
    type: 'sensor/SET_STATE',
    payload: {
      saving: false,
    },
  })
};

export function* UPDATE({ payload }) {
  const savingMessage = message.loading('Updating...', 0);
  const { objectId, data, successCallback, notify = false} = payload;

  try {
    yield put({
      type: 'sensor/SET_STATE',
      payload: {
        saving: true,
        current: {objectId, ...data },
      },
    })
    const resource = yield call(Sensor.update, objectId, data)
    yield call(successCallback);
    yield put({ type: 'sensor/CLEAR' })
    yield put({
      type: 'resource/GET_CURRENT',
      payload: {
        className: 'Device',
        objectId: resource.device.objectId,
      },
    })
    if (notify){
      notification.success({
        message: "Success!",
        description: "Resource updated successfully",
        duration: 1.5
      });
    }
  } catch (error) {
    yield call(handleError, error, {objectId, ...data });
    notification.error({
      message: "Oops!",
      description: "Error trying to update the resource",
    });
  }
  setTimeout(savingMessage, 0);
  yield put({
    type: 'sensor/SET_STATE',
    payload: {
      saving: false,
    },
  })
}

export function* GET_DATA({ payload }) {
  yield put({
    type: 'sensor/SET_STATE',
    payload: {
      loading: true,
      current: {},
      formErrors: {},
      objectNotFound: false
    },
  })
  
  try {
    const { results, total } = yield call(Sensor.find, payload)
    yield put({
      type: 'sensor/SET_STATE',
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
    type: 'sensor/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* REMOVE({ payload }) {
  try {
    const { objectId, device, callback } = payload;
    yield call(Sensor.remove, objectId);
    if (callback) yield call(callback);
    yield put({ type: 'sensor/CLEAR' });
    if (device) {
      yield put({
        type: 'resource/GET_CURRENT',
        payload: {
          className: 'Device',
          objectId: device.objectId,
        },
      })
    }
    notification.success({
      message: "Success!",
      description: "Sensor deleted successfully",
      duration: 1.5
    });
  } catch (error) {
    yield call(handleError, error);
  }
}

function* handleError(error, data) {
  const { code, message: msg } = error;
  switch (code) {
    case 209:
      yield put({
        type: 'user/LOGOUT',
        payload: {},
      })
      return;
    case 400:
      yield put({
        type: 'sensor/SET_STATE',
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
}

export function* CLEAR() {
  yield put({
    type: 'sensor/SET_STATE',
    payload: {
      list: [],
      formErrors: {},
      current: {},
      objectNotFound: false,
      total: 0,
      loading: false,
      saving: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_CURRENT, GET_CURRENT),
    takeEvery(actions.UPDATE, UPDATE),
    takeEvery(actions.CREATE, CREATE),
    takeEvery(actions.CLEAR, CLEAR),
    takeEvery(actions.REMOVE, REMOVE),
  ])
}
