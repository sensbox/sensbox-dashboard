import { all, put, call, takeEvery, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import InvestigadorService from 'services/investigador'
import actions from './actions'

const getData = ({ investigadores }) => investigadores.data;

export function* GET_CURRENT({ payload }) {
  try {
    const { objectId } = payload;
    const current = yield call(InvestigadorService.findById, objectId);
    yield put({
      type: 'investigadores/SET_STATE',
      payload: {
        current: current || {},
        objectNotFound: false
      },
    })
  } catch (error) {
    console.log(error);
    if (error.code === 101) {
      yield put({
        type: 'investigadores/SET_STATE',
        payload: {
          current: {},
          objectNotFound: true
        },
      })
    }
  }
}

export function* CREATE({ payload }) {
  const savingMessage = message.loading('Creando..', 0);
  const { data, notify } = payload;

  try {
    yield put({
      type: 'investigadores/SET_STATE',
      payload: {
        saving: true,
      },
    })

    const investigador = yield call(InvestigadorService.create, data);
    const investigadoresCollection = yield select(getData);
    yield put({
      type: 'investigadores/SET_STATE',
      payload: {
        current: investigador,
        data: investigadoresCollection.map(i => i.objectId === investigador.objectId ? investigador : i),
      },
    })
    if (notify){
      notification.success({
        message: "Perfecto!",
        description: "Investigador Creado correctamente",
        duration: 1.5
      });
    }
  } catch (error) {
    const { code, message: msg} = error;
    // eslint-disable-next-line no-debugger
    // debugger;
    switch (code) {
      case 209:
        yield put({
          type: 'user/LOGOUT',
          payload: {},
        })
        return;
      case 400:
        yield put({
          type: 'investigadores/SET_STATE',
          payload: {
            current: data,
            formErrors: JSON.parse(msg),
          },
        })
        break
      default:
        break;
    }
    notification.error({
      message: "Creación fallida",
      description: "Hubo un error al intentar crear el recurso",
    });
  }
  setTimeout(savingMessage, 0);
  yield put({
    type: 'investigadores/SET_STATE',
    payload: {
      saving: false,
    },
  })
};

export function* UPDATE({ payload }) {
  const savingMessage = message.loading('Actualizando..', 0);
  try {
    const { objectId, data, notify = false} = payload;
    yield put({
      type: 'investigadores/SET_STATE',
      payload: {
        saving: true,
      },
    })
    const centro = yield call(InvestigadorService.update, objectId, data)
    const centrosCollection = yield select(getData);
    yield put({
      type: 'investigadores/SET_STATE',
      payload: {
        current: centro,
        data: centrosCollection.map(i => i.objectId === centro.objectId ? centro : i),
      },
    })
    if (notify){
      notification.success({
        message: "Perfecto!",
        description: "Centro Actualizado correctamente",
        duration: 1.5
      });
    }
  } catch (error) {
    if (error.code === 209) {
      yield put({
        type: 'user/LOGOUT',
        payload: {},
      })
    } else {
      notification.error({
        message: "Actualizacion fallida",
        description: "Hubo un error al intentar actualizar el recurso",
      });
    }
  }
  setTimeout(savingMessage, 0);
  yield put({
    type: 'investigadores/SET_STATE',
    payload: {
      saving: false,
    },
  })
}

export function* GET_DATA({ payload }) {
  yield put({
    type: 'investigadores/SET_STATE',
    payload: {
      loading: true,
      current: {},
      formErrors: {},
      objectNotFound: false
    },
  })
  try {
    const { results: data, total } = yield call(InvestigadorService.find, payload)
    yield put({
      type: 'investigadores/SET_STATE',
      payload: {
        data,
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
    type: 'investigadores/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_CURRENT, GET_CURRENT),
    takeEvery(actions.UPDATE, UPDATE),
    takeEvery(actions.CREATE, CREATE),
  ])
}
