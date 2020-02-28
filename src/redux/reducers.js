import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import resource from './resource/reducers'
import sensor from './sensor/reducers'
import settings from './settings/reducers'
import common from './common/reducers'
import builder from './builder/reducers'
import dashboard from './dashboard/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    resource,
    settings,
    sensor,
    common,
    builder,
    dashboard,
  })
