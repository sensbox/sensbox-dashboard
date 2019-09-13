import { all, put, call, takeEvery, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import Api from 'services/api'
import actions from './actions'

const getList = ({ resource }) => resource.list;

export function* GET_CURRENT({ payload }) {
  try {
    const { objectId, className } = payload;
    const current = yield call(Api.findById, className, objectId);
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        current: current || {},
        objectNotFound: false
      },
    })
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
  const { className, data, notify} = payload;

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
      },
    })
    if (notify){
      notification.success({
        message: "Perfecto!",
        description: "Resource created successfully!",
        duration: 1.5
      });
    }
  } catch (error) {
    handleError(error, data);
    notification.error({
      message: "Oops!",
      description: "Error trying to save the resource",
    });
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
  const { className, objectId, data, notify = false} = payload;

  try {
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        saving: true,
      },
    })
    const resource = yield call(Api.update, className, objectId, data)
    const resourceCollection = yield select(getList);
    yield put({
      type: 'resource/SET_STATE',
      payload: {
        current: resource,
        list: resourceCollection.map(i => i.objectId === resource.objectId ? resource : i),
      },
    })
    if (notify){
      notification.success({
        message: "Perfect!",
        description: "Resource updated successfully",
        duration: 1.5
      });
    }
  } catch (error) {
    handleError(error, data);
    notification.error({
      message: "Oops!",
      description: "Error trying to update the resource",
    });
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

function* handleError(error, data) {
  console.log(error);
  const { code, message: msg} = error;
  switch (code) {
    case 209:
      yield put({
        type: 'user/LOGOUT',
        payload: {},
      })
      return;
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
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_CURRENT, GET_CURRENT),
    takeEvery(actions.UPDATE, UPDATE),
    takeEvery(actions.CREATE, CREATE),
  ])
}
