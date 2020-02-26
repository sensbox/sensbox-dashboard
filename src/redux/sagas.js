import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import resource from './resource/sagas'
import sensor from './sensor/sagas'
import common from './common/sagas'
import builder from './builder/sagas'
import device from './device/sagas'

export default function* rootSaga() {
  yield all([user(), menu(), settings(), resource(), sensor(), common(), builder(), device()])
}
