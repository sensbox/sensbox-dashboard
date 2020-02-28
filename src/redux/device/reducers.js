import actions from './actions';

const initialState = {
  deviceKey: '',
  isFetching: false,
  lastError: null,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
