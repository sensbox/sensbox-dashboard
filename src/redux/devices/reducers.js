import actions from './actions';

const initialState = {
  deviceKey: '',
  isFetching: false,
  didInvalidate: false,

}

export default function deviceReducers( state = initialState, action ) {
  switch (action.type) {
    case actions.REQUEST_KEY:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case actions.RECEIVE_KEY:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        deviceKey: action.payload.key,
        lastUpdated: action.payload.receivedAt
      })
    case actions.CLEAR_KEY:
      return Object.assign({}, state, {
        deviceKey: '',
      })
    default:
      return state
  }
}
