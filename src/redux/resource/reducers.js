import actions from './actions'

const initialState = {
  list: [],
  formErrors: {},
  current: {},
  objectNotFound: false,
  total: 0,
  loading: false,
  saving: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}